'use strict'

module.exports = getProfilingMiddleware

const pkg = require('./package.json')
module.exports.version = pkg.version

const fs = require('fs')
const url = require('url')
const path = require('path')
const util = require('util')

const noProRuntime = require('@no-pro/runtime/')

const debug = require('./lib/debug')(__filename)

const fsWriteFile = util.promisify(fs.writeFile)

const DefaultOptions = {
  profilingKeyHeader: 'x-no-pro-profiling-key',
  profilingSuggestedNameHeader: 'x-no-pro-suggested-name'
}

// get the profiling middleware function
function getProfilingMiddleware (options) {
  options = Object.assign({}, DefaultOptions, options)

  const {
    profilingKey,
    profilingKeyHeader,
    profilingSuggestedNameHeader,
    writeProfile
  } = options

  // must be a profilingKey option
  if (profilingKey == null) {
    throw new Error('option profilingKey must be provided')
  }

  // must be a writeProfile option
  let writeProfileFn
  if (typeof writeProfile === 'string') {
    writeProfileFn = getWriteProfileWithPath(writeProfile)
  } else if (typeof writeProfile === 'function') {
    writeProfileFn = writeProfile
  } else {
    throw new Error(`option writeProfile must be a string or function: ${writeProfile}`)
  }

  // delete the writeProfile key so the runtime doesn't call it
  delete options.writeProfile

  const profilingKeyValue = `${profilingKey}`

  return async function profilingMiddleware (req, res, next) {
    if (profilingKeyValue !== req.get(profilingKeyHeader)) return next()

    debug(`starting profile of ${req.method.toUpperCase()} ${req.url}`)
    res.once('finish', () => finished(req, res, options))

    const suggestedFileName = getSuggestedFileName(req)
    res.set(profilingSuggestedNameHeader, suggestedFileName)

    res.locals['no-pro'] = {
      suggestedFileName,
      stopProfiler: await noProRuntime.startProfiling(options)
    }

    next()
  }

  async function finished (req, res, options) {
    const { suggestedFileName, stopProfiler } = res.locals['no-pro']

    try {
      var profile = await stopProfiler()
    } catch (err) {
      debug(`error stopping profile: ${err.message}`)
      return
    }

    debug(`writing profile as ${suggestedFileName}`)
    writeProfileFn(req, res, profile, suggestedFileName)
  }
}

function getWriteProfileWithPath (profilePath) {
  return async function writeProfile (req, res, profile, suggestedFileName) {
    const fileName = path.join(profilePath, suggestedFileName)

    debug(`writing profile to ${fileName}`)
    try {
      await fsWriteFile(fileName, JSON.stringify(profile, null, 2))
    } catch (err) {
      debug(`error writing profile to ${fileName}: ${err.message}`)
    }
  }
}

// returns eg YYYY-MM-DD@HH-MM-SS-MMM.get.path-to-resource.cpuprofile
function getSuggestedFileName (req) {
  const method = req.method.toLowerCase()
  const date = new Date().toISOString()
    .substr(0, 23)
    .replace('T', '@')
    .replace(/:/g, '-')
    .replace('.', '-')

  const { pathname } = url.parse(req.originalUrl)
  const urlPath = pathname
    .replace(/\//g, ' ')
    .trim()
    .replace(/ /g, '-')

  return `${date}.${method}.${urlPath}.cpuprofile`
}
