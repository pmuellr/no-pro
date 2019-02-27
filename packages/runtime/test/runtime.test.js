'use strict'

const path = require('path')

const shell = require('shelljs')

const noProRuntime = require('..')
const someCodeToBeProfiled = require('./code-to-profile')

// create a tmp directory in the root of the package dir
const tmpDir = path.join(__dirname, '..', 'tmp')
shell.mkdir('-p', tmpDir)

describe('basic tests', () => {
  test('runtime has a version property', done => {
    expect(noProRuntime.version).toEqual(expect.stringMatching(/^\d*\.\d*\.\d*$/))
    done()
  })

  test('run a profile with no extras', async done => {
    const stopProfiling = await noProRuntime.startProfiling()
    await someCodeToBeProfiled({ count: 5 })
    const profile = await stopProfiling()

    validateProfileResult(profile, { metaData: false, metrics: false, sources: false })

    writeProfile(profile, 'test-no-extras.cpuprofile')

    done()
  }, 10 * 1000) // timeout

  test('run a profile with extras', async done => {
    const profileFile = path.join(tmpDir, 'test-extras.cpuprofile')

    // remove profile file
    shell.rm(profileFile)

    const stopProfiling = await noProRuntime.startProfiling({
      metaData: true,
      metrics: true,
      sources: true,
      writeFile: path.join(tmpDir, 'test-extras.cpuprofile')
    })

    await someCodeToBeProfiled({ count: 5 })
    const profile = await stopProfiling()

    // check that the written file is as expected
    const profileWritten = shell.cat(profileFile)
    expect(JSON.parse(profileWritten)).toEqual(profile)

    validateProfileResult(profile, { metaData: true, metrics: true, sources: true })

    done()
  }, 10 * 1000) // timeout
})

function validateProfileResult (profile, check) {
  const { nodes, metaData, metrics, sources } = profile

  expect(Array.isArray(nodes)).toBeTruthy()
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

  if (check.metaData) {
    expect(metaData).toMatchObject({
      date: expect.any(String),
      title: expect.any(String),
      nodeVersion: expect.any(String),
      arch: expect.any(String),
      platform: expect.any(String),
      // pid: expect.any(Number), ??? is pid always a number???
      execPath: expect.any(String)
    })
  }

  if (check.metrics) {
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

  if (check.sources) {
    expect(Array.isArray(sources)).toBeTruthy()
    expect(sources[0]).toMatchObject({
      scriptId: expect.any(String),
      url: expect.any(String),
      source: expect.any(String)
    })
  }
}

function writeProfile (profile, fileName) {
  const profileString = shell.ShellString(JSON.stringify(profile, null, 4))

  const profileFileName = path.join(tmpDir, fileName)
  profileString.to(profileFileName)
}
