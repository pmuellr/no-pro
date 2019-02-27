'use strict'

const debug = require('./debug')(__filename)

const DefaultOptions = {
  samplingInterval: 10 // microseconds; 1000 milliseconds = 1 microsecond
}

// Start a new profile, resolves to a function to stop the profile and resolve
// the profile data.
module.exports = async function startProfiling (session, options = {}) {
  options = Object.assign({}, DefaultOptions, options)

  debug('starting profile')

  const interval = options.samplingInterval

  await session.post(session, 'Profiler.enable')
  await session.post(session, 'Profiler.setSamplingInterval', { interval })
  await session.post(session, 'Profiler.start')

  // returned function which stops the profile and resolves to the profile data
  return async function stopProfiling () {
    debug('stopping profile')
    return session.post('Profiler.stop')
  }
}
