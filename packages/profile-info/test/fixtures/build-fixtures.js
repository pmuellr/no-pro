#!/usr/bin/env node

'use strict'

const path = require('path')
const childProcess = require('child_process')
const createDeferred = require('../../lib/deferred')

const ScriptDir = path.resolve(__dirname, '..', '..', '..', 'runtime', 'test')

main()

async function main () {
  await profileScript('vanilla-quiet')
  console.log('')
  await profileScript('extras-verbose')
  console.log('')
  await profileScript('npm-install')
}

async function profileScript (name) {
  const scriptFileName = path.relative(process.cwd(), path.join(ScriptDir, `run-profile-${name}.js`))
  const outputFileName = path.relative(process.cwd(), path.join(__dirname, `${name}.cpuprofile`))

  console.log(`running:   ${scriptFileName}`)

  const { err, stdout, stderr } = await runNodeScript(scriptFileName, outputFileName)

  console.log('stdout:')
  console.log(stdout)

  console.log('')
  console.log('stderr:')
  console.log(stderr)

  if (err) {
    console.log(`error: ${err.message}; code: ${err.code}; signal: ${err.signal}`)
    return
  }

  console.log(`generated: ${outputFileName}`)
}

async function runNodeScript (script, profileFile) {
  const command = `node '${script}' '${profileFile}'`
  const deferred = createDeferred()

  const execOpts = {
    maxBuffer: 64 * 1000 * 1000 // 64MB should be enough for anyone!
  }

  childProcess.exec(command, execOpts, (err, stdout, stderr) => {
    // const code = (err && err.code) || 0
    // const signal = (err && err.signal) || '<none>'

    // console.log(`code: ${code}; signal: ${signal}`)
    // console.log(`stdout:`)
    // console.log(stdout || '')
    // console.log(`stderr:`)
    // console.log(stderr || '')

    return deferred.resolve({ err, stdout, stderr })
  })

  return deferred.promise
}
