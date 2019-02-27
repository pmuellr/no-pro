#!/usr/bin/env node

'use strict'

module.exports = main

const path = require('path')

const shell = require('shelljs')

if (require.main === module) {
  const [ pkg, ...command ] = process.argv.slice(2)
  main(pkg, command.join(' '))
}

function main (pkg, command) {
  if (pkg == null) {
    console.log('package name (from packages dir) must be the first argument')
    process.exit(1)
  }

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

  shell.exec(command, execArgs, code => {
    if (code !== 0) process.exit(code)
  })
}
