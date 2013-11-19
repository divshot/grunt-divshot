# grunt-divshot

Perform common Divshot.io commands using Grunt.

* Run a local server
* Deploy to production, staging, and devleopment

See [Divshot.io docs](http://docs.divshot.io/) for documentation and details about options.

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
        keepAlive: true,
        port: 3474,
        hostname: 'localhost',
        root: './',
        clean_urls: false,
        routes: {
          '**': 'index.html'
        },
        cache_control: {}
      }
    }
  }
})
```

### Options

#### keepAlive
Type: `Boolean`
Default value: `false`

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

## Deploying to Divshot.io with Grunt

**grunt-divshot** automatically creates 3 tasks you can use to deploy to [Divshot.io](http://divshot.io) using Grunt.

* ` divshot:push:production `
* ` divshot:push:staging `
* ` divshot:push:development `

Each corresponds the features available in the [divshot-cli](https://github.com/divshot/divshot-cli/blob/master/README.md#push)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
