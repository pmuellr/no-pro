'use strict'

const DevMode = process.env.DEV_MODE != null

const path = require('path')

const chalk = require('chalk')
const shell = require('shelljs')

const updateBuildInfo = require('./update-build-info')
const createDeferred = require('../lib/deferred')

const pkgDir = P(__dirname, '..')
const rootDir = P(pkgDir, '..', '..')
const docsDir = P(rootDir, 'docs')
const nmdDir = P(pkgDir, 'node_modules', '.bin')

if (require.main === module) main()

async function main () {
  logAction('running build.js')

  logAction('- cleaning /docs directory')
  shell.rm('-rf', docsDir)
  shell.mkdir(docsDir)

  logAction('- copying static files to /docs')
  shell.cp(P(pkgDir, 'index.html'), docsDir)
  shell.cp('-r', P(pkgDir, 'images/'), docsDir)
  shell.rm(P(docsDir, 'images/**/*.acorn'))
  shell.mkdir(P(docsDir, 'profiles'))
  shell.cp(P(rootDir, 'packages/profile-info/test/fixtures/extras-verbose.cpuprofile'), P(docsDir, 'profiles'))

  // update build info
  logAction('- building dynamically generated files')
  updateBuildInfo()

  // build css
  logAction('- running lessc')
  const lessScript = P(nmdDir, 'lessc')
  const lessInput = P(pkgDir, 'css', 'index.less')
  const lessOutput = P(docsDir, 'bundled.css')
  const lessCommand = `${lessScript} ${lessInput} ${lessOutput}`
  const lessStatus = await exec(lessCommand)

  if (lessStatus !== 0) {
    process.exit(lessStatus)
  }

  // run webpack
  logAction('- running webpack')
  const webPackArgs = DevMode ? '--env.development' : ''
  const webPackScript = P(nmdDir, 'webpack')
  const webPackCommand = `${webPackScript} --display-modules ${webPackArgs}`
  const webPackStatus = await exec(webPackCommand)

  if (webPackStatus !== 0) {
    process.exit(webPackStatus)
  }
}

function logAction (message) {
  console.log(chalk.blue(message))
}

// short-cut path builder
function P (...args) {
  return path.resolve(
    path.join(...args)
  )
}

// short-cut  to shell.exec()
function exec (...command) {
  command = command.join(' ')

  const deferred = createDeferred()

  shell.exec(command, (code) => deferred.resolve(code))

  return deferred.promise
}
