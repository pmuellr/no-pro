'use strict'

const fs = require('fs')
const util = require('util')

const fsWriteFile = util.promisify(fs.writeFile)

module.exports = {
  version: require('./package.json').version,
  startProfiling
}

const createSession = require('./lib/session')
const getScripts = require('./lib/scripts')
const getMeta = require('./lib/meta-data')
const startMetrics = require('./lib/metrics')

const debug = require('./lib/debug')(__filename)

const DefaultOptions = {
  writeProfile: null,
  scripts: false,
  metaData: true,
  metrics: true,
  samplingInterval: 10 // microseconds; 1000 milliseconds = 1 microsecond
}

let CurrentlyProfiling = false

// Start profiling, resolving to a function which stops the profile and resolves
// the profiling results.
async function startProfiling (options = {}) {
  options = Object.assign({}, DefaultOptions, options)

  if (options.writeProfile != null) {
    switch (typeof options.writeProfile) {
      case 'string': break
      case 'function': break
      default:
        throw new Error(`invalid value for writeProfile option: ${options.writeProfile}`)
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

    let metaData, metrics, scripts

    if (options.metaData) metaData = await getMeta()
    if (options.metrics) metrics = await stopMetrics()
    if (options.scripts) scripts = await getScripts(session, profile)

    await session.destroy()

    // build result
    let result = {}
    if (metaData) result.metaData = metaData
    if (metrics) result.metrics = metrics

    Object.assign(result, profile)
    if (scripts) result.scripts = scripts

    if (options.writeProfile) {
      await invokeFileWriter(options.writeProfile, result)
    }

    return result
  }
}

async function invokeFileWriter (fileNameOrFn, profile) {
  let fn = fileNameOrFn
  let fileName = fileNameOrFn

  if (typeof fileName === 'string') {
    fn = writeFile
  }

  if (typeof fn !== 'function') {
    throw new Error(`invalid value for writeProfile option: ${fileNameOrFn}`)
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
      await fsWriteFile(fileName, JSON.stringify(profile))
    } catch (err) {
      debug(`error writing profile to ${fileName}: ${err.message}`)
    }
  }
}
