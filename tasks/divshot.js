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
  var superstaticDefaults = require('superstatic/lib/defaults');
  
  grunt.registerTask('divshot:push:production', function () {
    push.call(this, 'production', this.async());
  });
  
  grunt.registerTask('divshot:push:staging', function () {
    push.call(this, 'staging', this.async());
  });
  
  grunt.registerTask('divshot:push:development', function () {
    push.call(this, 'development', this.async());
  });
  
  grunt.registerMultiTask('divshot', 'Run Divshot.io locally', function() {
    var createdConfigFile = false;
    var done = this.async();
    var options = this.options({
      port: superstaticDefaults.PORT,
      hostname: superstaticDefaults.HOST,
      root: superstaticDefaults.DIRECTORY,
      clean_urls: false,
      routes: {},
      cache_control: {}
    });
    
    if (!configFilesExists()) {
      grunt.file.write(process.cwd() + '/divshot.json', JSON.stringify({
        root: options.root,
        clean_urls: options.clean_urls,
        routes: options.routes,
        cache_control: options.cache_control,
        error_page: options.error_page
      }, null, 2));
      
      createdConfigFile = true;
    }
    
    var config = configFile(this.options());
    
    // Start the server
    var server = grunt.util.spawn({
      cmd: path.resolve(__dirname, '../node_modules/.bin/superstatic'),
      args: ['--port', options.port, '--host', options.hostname]
    }, function (err, result, code) {
      if (err) grunt.fail.fatal(err);
    });
    
    server.stdout.on('data', function (data) {
      grunt.log.write(data);
      process.nextTick(function () {
        if (grunt.file.exists(process.cwd() + '/divshot.json') && createdConfigFile) {
          grunt.file.delete(process.cwd() + '/divshot.json');
        }
      });
    });
    
    server.stderr.on('data', function (data) {
      process.stderr.write(data.toString().red);
    });
    
    if (!options.keepAlive) process.nextTick(done);
  });
  
  function configFile (options) {
    var config = {};
    
    if (ssExists()) config = grunt.file.readJSON(process.cwd() + '/superstatic.json');
    if (dioExists()) config = grunt.file.readJSON(process.cwd() + '/divshot.json');
    
    return _.extend(config, options);
  }
  
  function configFilesExists () {
    return dioExists() || ssExists();
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