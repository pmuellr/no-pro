'use strict'

/* global describe, test, expect, beforeEach */

const PORT = parseInt(process.env.PORT || '42043')

const path = require('path')

const shell = require('shelljs')
const httpClient = require('tiny-json-http')

const getProfilingMiddleware = require('..')
const startServer = require('./server')

const profilingKeyHeader = 'x-no-pro-profiling-key'
// const profilingSuggestedNameHeader = 'x-no-pro-suggested-name'

// create a tmp directory in the root of the package dir
const tmpDir = path.join(__dirname, '..', 'tmp', 'profiles')
shell.mkdir('-p', tmpDir)

describe('express-middleware basic tests', () => {
  test('express-middleware has a version property', done => {
    expect(getProfilingMiddleware.version).toEqual(expect.stringMatching(/^\d*\.\d*\.\d*$/))
    done()
  })

  test('check for missing invalid options', done => {
    expect(() => getProfilingMiddleware()).toThrow('profilingKey')
    expect(() => getProfilingMiddleware({})).toThrow('profilingKey')

    expect(() => getProfilingMiddleware({
      profilingKey: 'x'
    })).toThrow('writeProfile')

    expect(() => getProfilingMiddleware({
      profilingKey: 'x',
      writeProfile: 42
    })).toThrow('writeProfile')

    done()
  })
})

describe('express-middleware server tests', () => {
  beforeEach(() => {
    shell.rm('-rf', `${tmpDir}/*`)
  })

  test('server with writeProfile path', async done => {
    const serverOptions = {
      port: PORT,
      profilingOptions: {
        profilingKey: '42x42',
        writeProfile: tmpDir
      }
    }

    const stopServer = await startServer(serverOptions)

    await httpRequest('get', '/foo/bar')
    expect(lsProfiles()).toHaveLength(0)

    await httpRequest('get', '/foo/bar', '43x43')
    expect(lsProfiles()).toHaveLength(0)

    await httpRequest('get', '/foo/bar', '42x42')
    expect(lsProfiles()).toHaveLength(1)

    await stopServer()

    done()
  })
})

// make an http request to our test server
async function httpRequest (method, uri, profilingKey) {
  if (!uri.startsWith('/')) uri = `/${uri}`

  const url = `http://localhost:${PORT}${uri}`

  const headers = {}
  if (profilingKey != null) {
    headers[profilingKeyHeader] = profilingKey
  }

  return httpClient[method]({ url, headers })
}

// list the profiles available
function lsProfiles () {
  return shell.ls(tmpDir)
}
