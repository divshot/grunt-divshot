'use strict';

var path = require('path');
var pkg = require('../package.json');
var _ = require('lodash');
var format = require('chalk');
var superstaticDefaults = require('superstatic/lib/defaults');

module.exports = function(grunt) {
  var cmdExtension = /^win/.test(process.platform) ? '.cmd' : '';

  grunt.registerMultiTask('divshot', pkg.description, function() {
    var done = this.async();
    var nameArgs = this.nameArgs;
    var options = this.options({
      keepAlive: true,
      port: superstaticDefaults.PORT,
      hostname: superstaticDefaults.HOST,
      root: './',
      clean_urls: false,
      routes: {},
      cache_control: {},
      exclude: []
    });
    
    var config = configFile(this.options());
    
    // Start the server
    var server = grunt.util.spawn({
      cmd: path.resolve(__dirname, '../node_modules/.bin/superstatic' + cmdExtension),
      args: [
        '--port', options.port,
        '--host', options.hostname,
        '--config', JSON.stringify(config)
      ]
    }, function (err, result, code) {
      if (err) grunt.fail.fatal(err);
    });
    
    // Info
    server.stdout.on('data', function (data) {
      grunt.log.write('\n' + format.underline(nameArgs) + ': ' + data);
    });
    
    // Errors
    server.stderr.on('data', function (data) {
      process.stderr.write(format.red(data.toString()));
    });
    
    // Quit process?
    if (!options.keepAlive) process.nextTick(done);
  });
  
  // Pushing
  grunt.registerMultiTask('divshot:push', function () {
    var done = this.async();
    var config = configFile(this.options());
    var cmd = path.resolve(__dirname, '../node_modules/.bin/divshot' + cmdExtension);
    var environment = this.target || 'development';
    var args = ['push', environment];
    
    if (config.token) args = args.concat(['--token', config.token]);
    
    var pusher = grunt.util.spawn({ cmd: cmd, args: args }, function (err, result, code) {
      if (err) grunt.fail.fatal(err);
    });
    
    pusher.stdout.on('data', function (data) {
      process.stdout.write(data);
    });
    
    pusher.stderr.on('data', function (data) {
      process.stderr.write(data);
    });
    
    pusher.on('close', done);
  });
  
  function configFile (options) {
    var config = {};
    
    if (ssExists()) config = grunt.file.readJSON(process.cwd() + '/superstatic.json');
    if (dioExists()) config = grunt.file.readJSON(process.cwd() + '/divshot.json');
    
    return _.extend(config, options);
  }
  
  function dioExists () {
    return grunt.file.exists(process.cwd() + '/divshot.json');
  }
  
  function ssExists() {
    return grunt.file.exists(process.cwd() + '/superstatic.json');
  }
};
