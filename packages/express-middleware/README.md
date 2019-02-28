no-pro runtime - core profiling library for node.js
================================================================================

<img src="https://raw.githubusercontent.com/pmuellr/no-pro/master/images/no-pro.png" width="64" align="right">

Part of the [no-pro mono-repo](https://github.com/pmuellr/no-pro).


install
================================================================================

    npm install @no-pro/runtime


quick start
================================================================================

```js
const { startProfiling } = require('@no-pro/runtime')

...

async function someFunction () {
  const stopProfiling = await startProfiling()

  // run some code to be profiled

  const profile = await stopProfiling()

  // the profile variable now contains JSON-able profile data
}

```


usage
================================================================================

The package exports the following properties and functions:


### `version`

The value of this property is the version of this npm package installed.


### `async startProfiling([options])`

This function will start the CPU profiler.  It resolves to an async function
which is used to stop the CPU profile and return the profile result.

The "stop" async function resolved by this function takes no arguments.
It stops the profile and returns the profile data as a JSON-able object.

The optional `options` argument is an object which can contain the following
properties:

- `sources`

  If set to a truthy value, the source code of the modules that were profiled
  will be returned with the result.
  Default: `false`

- `metaData`

  If set to a truthy value, some meta-data about the process
  will be returned with the result.
  Default: `false`

- `metrics`

  If set to a truthy value, some metrics gathered during the profile
  will be returned with the result.
  Default: `false`

- `samplingInterval`

  Set to the CPU profiler sampling interval, in microseconds
  (1000 microseconds = 1 millisecond; 1000 milliseconds = 1 second).
  Default: `10`

- `writeFile`

  The value should be a string or function.  If a string, the profile
  will be written to the specified file.  If a function, the function
  will be invoked as an async function, and passed the profile object
  to be written.


license / contributing / etc
================================================================================

See the root of the [no-pro mono-repo](https://github.com/pmuellr/no-pro).