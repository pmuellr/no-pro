'use strict'

module.exports = {
  main
}

const path = require('path')
const childProcess = require('child_process')

const createDeferred = require('../lib/deferred')
const noProRuntime = require('..')
const someCodeToBeProfiled = require('./code-to-profile')

const DefaultOutputDir = path.resolve(__dirname, '..', 'tmp')

if (require.main === module) main()

async function main (outputFileDir = DefaultOutputDir) {
  let [ profilingOpts, appOpts ] = process.argv.slice(2)

  if (profilingOpts == null) return launchProfiles()

  profilingOpts = JSON.parse(profilingOpts)
  appOpts = JSON.parse(appOpts)

  await runProfile(profilingOpts, appOpts)
}

async function launchProfiles (outputFileDir) {
  const profilingOpts = {
    metaData: false,
    metrics: false,
    scripts: false
  }

  const appOpts = {
    count: 3,
    delay: 100,
    verbose: false
  }

  profilingOpts.writeProfile = path.join(outputFileDir, 'vanilla-quiet.cpuprofile')
  await runNodeProcess(profilingOpts, appOpts)

  appOpts.verbose = true
  profilingOpts.metaData = true
  profilingOpts.metrics = true
  profilingOpts.sourscripts = true
  profilingOpts.writeProfile = path.join(outputFileDir, 'extras-verbose.cpuprofile')
  await runNodeProcess(profilingOpts, appOpts)
}

async function runNodeProcess (profilingOpts, appOpts) {
  console.log('-------------------')
  console.log(`generating profile ${profilingOpts.writeProfile}`)

  profilingOpts = JSON.stringify(profilingOpts)
  appOpts = JSON.stringify(appOpts)

  const command = `node ${__filename} '${profilingOpts}' '${appOpts}'`
  const deferred = createDeferred()

  console.log(`running: ${command}`)
  childProcess.exec(command, (err, stdout, stderr) => {
    const code = (err && err.code) || 0
    const signal = (err && err.signal) || '<none>'

    console.log(`code: ${code}; signal: ${signal}`)
    console.log(`stdout:`)
    console.log(stdout || '')
    console.log(`stderr:`)
    console.log(stderr || '')

    return deferred.resolve({ err, stdout, stderr })
  })

  return deferred.promise
}

async function runProfile (profilingOpts, appOpts) {
  const stopProfiling = await noProRuntime.startProfiling(profilingOpts)

  await someCodeToBeProfiled(appOpts)

  await stopProfiling()
}
