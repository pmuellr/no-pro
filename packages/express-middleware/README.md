no-pro express-middleware - express-compatible middleware to profile keyed requests
================================================================================

<img src="https://raw.githubusercontent.com/pmuellr/no-pro/master/images/no-pro.png" width="64" align="right">

Part of the [no-pro mono-repo](https://github.com/pmuellr/no-pro).


install
================================================================================

    npm install @no-pro/express-middleware


quick start
================================================================================

```js
...

const profilingMiddleware = require('@no-pro/express-middleware')

...

const app = express()

...

app.use('*', profilingMiddleware({
  profilingKey: 'my-secret-profiling-key-42',
  writeProfile: '/tmp'
}))

...
```

The options here indicate that profiles will be written to the `/tmp` directory,
and that only requests with the following header will be profiled:

    x-no-pro-profiling-key: my-secret-profiling-key-42


usage
================================================================================

The package exports a function which will return an express middleware function
to profile requests to the server.  

The exported function takes an object as a parameter, with the following
properties:

- all the options from the 
  [runtime startProfiling() function][runtime-startProfiling]
  function

- `profilingKey` (required)

  A string which will be the "key" that indicates requests should be profiled.
  This key needs to be sent as the value of the http header
  `x-no-pro-profiling-key` when making a request that you'd like to profile.

- `writeProfile` (required)

  A string or function which indicates where to write the profile.

  If a string is passed, it will be used as the directory name to write the
  profile to, with the suggested file name, as described below.

  If a function is passed, it will be invoked with the following arguments:

  - http request object
  - http response object
  - JSON-able profile data
  - suggestedFileName

  The suggested file name is built from the date, request method, and url.

  For example, to write the profile data to the console (not recommended, heh),
  use:
  
      writeProfile: function (req, res, profile) { console.log(profile) }

- `profilingKeyHeader`

  Rather than using the header `x-no-pro-profiling-key` to pass the profiling
  key, you can specify the header with this option.

- `profilingSuggestedNameHeader`

  In the http response of a request that has been profiled, a header with the
  name `x-no-pro-suggested-name` will be added with the suggested name of the
  profile.  The name of the header can be overridden with this value.

[runtime-startProfiling]: https://github.com/pmuellr/no-pro/blob/master/packages/runtime/README.md#async-startprofilingoptions


changelog
================================================================================

See the file [CHANGELOG.md](CHANGELOG.md).


license / contributing / etc
================================================================================

See the root of the [no-pro mono-repo](https://github.com/pmuellr/no-pro).