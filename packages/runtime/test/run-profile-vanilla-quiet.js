'use strict'

const codeToProfile = require('./code-to-profile')

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
    verbose: false
  }

  const profilingOpts = {
    metaData: false,
    metrics: false,
    scripts: false,
    writeProfile: profileFile
  }

  return runProfile(profilingOpts, appOpts)
}

async function runProfile (profilingOpts, appOpts) {
  const stopProfiling = await noProRuntime.startProfiling(profilingOpts)

  await codeToProfile(appOpts)

  return stopProfiling()
}
