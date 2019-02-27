'use strict'

const noProRuntime = require('..')
const createDeferred = require('../lib/deferred')

describe('basic tests', () => {
  test('runtime has a version property', done => {
    expect(noProRuntime.version).toEqual(expect.stringMatching(/^\d*\.\d*\.\d*$/))
    done()
  })

  test('run a profile with no sources', async done => {
    const stopProfiling = await noProRuntime.startProfiling()
    await someStuffToBeProfiled()
    const profile = await stopProfiling()

    validateProfileResult(profile, false)
    done()
  })

  test('run a profile with sources', async done => {
    const stopProfiling = await noProRuntime.startProfiling({ sources: true })
    await someStuffToBeProfiled()
    const profile = await stopProfiling()

    validateProfileResult(profile, true)
    done()
  })
})

function validateProfileResult (profile, checkSources) {
  const { nodes, metaData, metrics, sources } = profile
  expect(Array.isArray(nodes)).toBeTruthy()
  if (checkSources) expect(Array.isArray(sources)).toBeTruthy()

  expect(nodes[0]).toMatchObject({
    id: expect.any(Number),
    callFrame: {
      functionName: expect.any(String),
      scriptId: expect.any(String),
      url: expect.any(String),
      lineNumber: expect.any(Number),
      columnNumber: expect.any(Number)
    },
    hitCount: expect.any(Number)
    // children: expect.any([Number]) ??? hmm, shame that's not supported
  })

  if (checkSources) {
    expect(sources[0]).toMatchObject({
      scriptId: expect.any(String),
      url: expect.any(String),
      source: expect.any(String)
    })
  }

  expect(metaData).toMatchObject({
    date: expect.any(String),
    title: expect.any(String),
    nodeVersion: expect.any(String),
    arch: expect.any(String),
    platform: expect.any(String),
    // pid: expect.any(Number), ??? is pid always a number???
    execPath: expect.any(String)
  })

  expect(metrics).toMatchObject({
    cpu: {
      user: expect.any(Number),
      system: expect.any(Number),
      total: expect.any(Number)
    },
    mem: {
      rss: expect.any(Number),
      heapUsed: expect.any(Number),
      heapTotal: expect.any(Number)
    }
  })
}

async function someStuffToBeProfiled () {
  const count = 10
  for (let i = 0; i < count; i++) {
    delaySync(10)
  }

  for (let i = 0; i < count; i++) {
    await delayAsync(10)
  }
}

function delaySync (ms) {
  const end = ms + Date.now()
  while (Date.now() < end) {}
  return ms
}

async function delayAsync (ms) {
  const deferred = createDeferred()
  setTimeout(() => deferred.resolve(ms), ms)
  return deferred.promise
}
