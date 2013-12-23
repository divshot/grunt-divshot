/*
 * grunt-divshot
 * https://github.com/divshot/grunt-divshot
 *
 * Copyright (c) 2013 Divshot
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path');
  var _ = require('lodash');
  var chalk = require('chalk');
  var superstaticDefaults = require('superstatic/lib/defaults');
  var environments = [
    'development',
    'staging',
    'production'
  ];
  
  _.each(environments, function (environment) {
    grunt.registerTask('divshot:push:' + environment, function () {
      push.call(this, environment, this.async());
    });
  });
  
  grunt.registerMultiTask('divshot', 'Run Divshot.io locally', function() {
    var createdConfigFile = false;
    var done = this.async();
    var options = this.options({
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
      cmd: path.resolve(__dirname, '../node_modules/.bin/superstatic'),
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
      grunt.log.write(data);
      process.nextTick(function () {
        if (grunt.file.exists(process.cwd() + '/divshot.json') && createdConfigFile) {
          grunt.file.delete(process.cwd() + '/divshot.json');
        }
      });
    });
    
    // Errors
    server.stderr.on('data', function (data) {
      process.stderr.write(chalk.red(data.toString()));
    });
    
    // Quit process?
    if (!options.keepAlive) process.nextTick(done);
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
  
  function push (env, done) {
    var done = this.async();
    var config = configFile(this.options());
    var cmd = path.resolve(__dirname, '../node_modules/.bin/divshot');
    var args = ['push', env];
    
    if (config.token) args = args.concat(['--token', config.token]);
    
    var push = grunt.util.spawn({ cmd: cmd, args: args }, function (err, result, code) {
      if (err) grunt.fail.fatal(err);
    });
    
    push.stdout.on('data', function (data) {
      grunt.log.write(data.toString());
    });
    
    push.stderr.on('data', function (data) {
      process.stderr.write(data.toString());
    });
    
    push.on('close', done);
  }
};
