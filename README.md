# grunt-divshot

Perform common [Divshot](http://divshot.com) commands using Grunt.

* [Run a local server](https://github.com/divshot/grunt-divshot#the-divshot-task)
* [Deploy to various hosting environments](https://github.com/divshot/grunt-divshot#deploying-to-divshot-with-grunt)

See [Divshot docs](http://docs.divshot.io/guides/configuration) for documentation and details about options and how to configure your app.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-divshot --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-divshot');
```

## The "divshot" task

### Usage
In your project's Gruntfile, add a section named `divshot` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  divshot: {
    server: {
      options: {
        //
      }
    }
  }
})
```

### Options

By default, `grunt-divshot` will read your configurations from your [`divshot.json`](http://docs.divshot.io/guides/configuration) file. If no file is provided, the defaults will be used.

Each of these options are, well, optional. Any values provided will override any configurations you have in your [`divshot.json`](http://docs.divshot.io/guides/configuration) file.

#### keepAlive
Type: `Boolean`
Default value: `true`

Once grunt's tasks have completed, the web server stops. This behavior can be changed with the `keepAlive` option

#### port
Type: `Number`
Default value: `3474`

The port number to run the server on

#### hostname
Type: `String`
Default value: `127.0.0.1`

The hostname to run the server at

#### root
Type: `String`
Default value: `./`

The relative path the the directory to run the server out of

#### clean_urls
Type: `Boolean`
Default value: `false`

Force Divshot.io server to write clean urls for `.html` files

#### routes
Type: `Object`
Default value: `{}`

Key/value pairs of glob to path routing

#### cache_control
Type: `Object`
Default value: `{}`

Key/value pairs of glob to path cache control settings

#### redirects
Type: `Object`
Default value: `{}`

Key/value paris of globs that describe various redirects within your app

## Deploying to Divshot with Grunt

**grunt-divshot** lets you deploy to any environment that is available to you on Divshot (i.e. production, staging, etc.)

### Usage
In your project's Gruntfile, add a section named any of the above tasks.

```js
'divshot:push': {
  production: {
    // options
  },
  staging: {
     // options
  }
}
```

The values in your `divshot.json` file are the values that will configure your app on the Divshot hosting servers. If you have any special configuration in your `Gruntfile.js` under `server`, you'll need to add those values to your `divshot.json` file in order to see their affects on Divshot.


### Options

#### token
type: `String`
Default value: `null`

Optionally override your user access token. Useful for build and deploy environments.

Each corresponds the features available in the [divshot-cli](https://github.com/divshot/divshot-cli/blob/master/README.md#push)

#### exclude
type: `Array`
Default value: `[]`

Array of globs of files or directories to exclude on deploy
