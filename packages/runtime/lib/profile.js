'use strict'

const DefaultOptions = {
  samplingInterval: 10 // microseconds; 1000 milliseconds = 1 microsecond
}

// Start a new profile, resolves to a function to stop the profile and resolve
// the profile data.
module.exports = async function startProfiling (session, options = {}) {
  options = Object.assign({}, DefaultOptions, options)

  const interval = options.samplingInterval

  await session.post(session, 'Profiler.enable')
  await session.post(session, 'Profiler.setSamplingInterval', { interval })
  await session.post(session, 'Profiler.start')

  // returned function which stops the profile and resolves to the profile data
  return async function stopProfiling () {
    const result = await session.post('Profiler.stop')
    const { nodes } = result

    return { nodes }
  }
}
