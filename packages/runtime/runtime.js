'use strict'

const fs = require('fs')
const util = require('util')

const fsWriteFile = util.promisify(fs.writeFile)

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
  writeFile: null,
  sources: false,
  metaData: false,
  metrics: false,
  samplingInterval: 10 // microseconds; 1000 milliseconds = 1 microsecond
}

let CurrentlyProfiling = false

// Start profiling, resolving to a function which stops the profile and resolves
// the profiling results.
async function startProfiling (options = {}) {
  options = Object.assign({}, DefaultOptions, options)

  if (options.writeFile != null) {
    switch (typeof options.writeFile) {
      case 'string': break
      case 'function': break
      default:
        throw new Error(`invalid value for writeFile option: ${options.writeFile}`)
    }
  }

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

    let metaData, metrics, sources

    if (options.metaData) metaData = await getMetaData()
    if (options.metrics) metrics = await stopMetrics()
    if (options.sources) sources = await getSources(session, profile)

    await session.destroy()

    // build result
    let result = {}
    if (metaData) result.metaData = metaData
    if (metrics) result.metrics = metrics

    Object.assign(result, profile)
    if (sources) result.sources = sources

    if (options.writeFile) {
      await invokeFileWriter(options.writeFile, result)
    }

    return result
  }
}

async function invokeFileWriter (fileNameOrFn, profile) {
  let fileName = fileNameOrFn
  let fn = fileNameOrFn

  if (typeof fileName === 'string') {
    fn = writeFile
  }

  if (typeof fn !== 'function') {
    throw new Error(`invalid value for writeFile option: ${fileNameOrFn}`)
  }

  try {
    await fn(profile)
  } catch (err) {
    debug(`error writing profile: ${err.message}`)
  }

  // write the profile to a file
  async function writeFile (profile) {
    debug(`writing profile to ${fileName}`)

    try {
      await fsWriteFile(fileName, JSON.stringify(profile, null, 2))
    } catch (err) {
      debug(`error writing profile to ${fileName}: ${err.message}`)
    }
  }
}
