'use strict'

module.exports = {
  version: require('./package.json').version,
  startProfiling
}

const createSession = require('./lib/session')
const getSources = require('./lib/sources')
const getMetaData = require('./lib/meta-data')
const startMetrics = require('./lib/metrics')

const debug = require('./lib/debug')(__filename)

const DefaultOptions = {
  sources: false,
  samplingInterval: 10 // microseconds; 1000 milliseconds = 1 microsecond
}

let CurrentlyProfiling = false

// Start profiling, resolving to a function which stops the profile and resolves
// the profiling results.
async function startProfiling (options = {}) {
  options = Object.assign({}, DefaultOptions, options)

  if (CurrentlyProfiling) {
    throw new Error(`already profiling`)
  }

  const session = await createSession()
  const stopMetrics = await startMetrics()

  const interval = options.samplingInterval

  debug('starting profile')

  await session.post('Runtime.runIfWaitingForDebugger')
  await session.post('Runtime.enable')
  await session.post('Profiler.enable')
  await session.post('Profiler.setSamplingInterval', { interval })
  await session.post('Profiler.start')

  let alreadyStopped = false
  return stopProfiling

  async function stopProfiling () {
    if (alreadyStopped) throw new Error('profile already stopped')
    alreadyStopped = true

    const { profile } = await session.post('Profiler.stop')

    debug('stopping profile')

    const nodes = profile.nodes

    const metrics = await stopMetrics()
    const metaData = await getMetaData()

    let sources = null
    if (options.sources) {
      sources = await getSources(session, profile)
    }

    await session.destroy()

    const result = { nodes, metaData, metrics }
    if (sources) result.sources = sources

    return result
  }
}
