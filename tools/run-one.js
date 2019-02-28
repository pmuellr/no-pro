#!/usr/bin/env node

'use strict'

module.exports = runOne

const path = require('path')

const shell = require('shelljs')

const createDeferred = require('./lib/deferred')

async function runOne (pkg, command) {
  if (pkg == null) {
    console.log('package name (from packages dir) must be the first argument')
    process.exit(1)
  }

  // all full directory name, for tab completion from the cli
  if (pkg.startsWith('packages/')) pkg = pkg.replace(/^packages\//, '')
  if (pkg.endsWith('/')) pkg = pkg.replace(/\/$/, '')

  if (Array.isArray(command)) command = command.join(' ')
  if (command == null || command.length === 0) {
    console.log('no command specified to run')
    process.exit(1)
  }

  const rootDir = path.resolve(path.join(__dirname, '..'))
  const pkgDir = path.join(rootDir, 'packages', pkg)
  const nmbDir = path.join(rootDir, 'node_modules/.bin')
  const toolsDir = path.join(rootDir, 'tools')

  const oldPath = process.env.PATH
  const newPath = [nmbDir, toolsDir, oldPath].join(path.delimiter)
  const newEnv = Object.assign({}, process.env, {
    PATH: newPath
  })

  const execArgs = {
    cwd: pkgDir,
    env: newEnv
  }

  const deferred = createDeferred()

  shell.exec(command, execArgs, (code, stdout, stderr) => {
    deferred.resolve({ code, stdout, stderr })
  })

  return deferred.promise
}

if (require.main === module) main()

async function main () {
  const [ pkg, ...command ] = process.argv.slice(2)
  const { code } = await runOne(pkg, command.join(' '))
  if (code !== 0) process.exit(1)
}
