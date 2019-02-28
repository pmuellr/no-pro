#!/usr/bin/env node

'use strict'

// Start an http server testing the middleware.
// The async startServer() function resolves to a function which stops the
// server.  When a profiling request is made, the profile will be written to
// the tmp directory.

module.exports = startServer

const express = require('express')

const profilingMiddleware = require('..')

const someCodeToBeProfiled = require('./code-to-profile')
const debug = require('../lib/debug')(__filename)
const createDeferred = require('../lib/deferred')

// starts a server, resolves to an async function to stop the server
async function startServer (options) {
  const app = express()

  const { port, profilingOptions } = options

  app.use('*', profilingMiddleware(profilingOptions))
  app.all('*', handleRequest)

  debug('starting server')
  const deferredStart = createDeferred()
  const server = app.listen(port, () => {
    deferredStart.resolve(stopServer)
  })

  return deferredStart.promise

  async function stopServer () {
    debug('stopping server')
    const deferredClose = createDeferred()

    server.close(() => {
      deferredClose.resolve()
    })

    return deferredStart.promise
  }
}

async function handleRequest (req, res) {
  await someCodeToBeProfiled({ count: 3 })

  res.send({ status: 'complete' })
}

if (require.main === module) main()

async function main () {
  const crypto = require('crypto')

  const port = process.env.PORT || '3000'
  const profilingKey = process.env.PROFILING_KEY || crypto.randomBytes(8).toString('hex')
  const writeProfile = '.'
  const profilingOptions = { profilingKey, writeProfile }

  try {
    await startServer({ port, profilingOptions })
  } catch (err) {
    console.log(`error starting server: ${err.message}`)
    process.exit(1)
  }

  console.log(`started sample profiling server at http://localhost:${port}`)
  console.log('')
  console.log(`to profile a request, add the following header to the request:`)
  console.log('')
  console.log(`  x-no-pro-profiling-key: ${profilingKey}`)
  console.log('')
  console.log(`profiles will be written to the current directory (${process.cwd()})`)
  console.log('')
  console.log('example:')
  console.log('')
  console.log(`  curl -v -X POST -H "x-no-pro-profiling-key: ${profilingKey}" http://localhost:${port}/foo/bar`)
}
