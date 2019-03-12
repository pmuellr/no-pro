'use strict'

const util = require('util')

const DefaultNpmPackage = '/usr/local/lib/node_modules/npm'

const npmPackage = process.env.NPM_PACKAGE || DefaultNpmPackage

try {
  var npm = require(npmPackage)
} catch (err) {
  console.error(`unable to load npm package from ${npmPackage}`)
  process.exit(1)
}

module.exports = {
  main,
  run
}

const noProRuntime = require('../runtime')

if (require.main === module) main()

async function main () {
  const profileFile = process.argv[2]
  const profile = await run(profileFile)
  if (profileFile == null) {
    console.log(JSON.stringify(profile, null, 4))
  } else {
    console.log(`generated ${profileFile}`)
  }
}

async function run (profileFile) {
  const appOpts = {
    count: 3,
    delay: 100,
    verbose: true
  }

  const profilingOpts = {
    metaData: true,
    metrics: true,
    scripts: false,
    writeProfile: profileFile
  }

  return runProfile(profilingOpts, appOpts)
}

async function runProfile (profilingOpts, appOpts) {
  const stopProfiling = await noProRuntime.startProfiling(profilingOpts)

  const npmLoad = util.promisify(npm.load)

  process.argv = process.argv.slice(0, 2)

  try {
    await npmLoad()
  } catch (err) {
    console.error(`error running npm.load(): ${err.message}`)
    process.exit(1)
  }

  const npmInstall = util.promisify(npm.commands.install)

  npm.on('log', logNpmMessages)

  try {
    await npmInstall([])
  } catch (err) {
    console.error(`error running npm.commands.install(): ${err.message}`)
    process.exit(1)
  }

  npm.off('log', logNpmMessages)

  return stopProfiling()
}

function logNpmMessages (message) {
  console.error(message)
}
