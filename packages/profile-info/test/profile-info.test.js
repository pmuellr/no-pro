'use strict'

/* global describe, test, expect */

const fs = require('fs')

const ProfileInfo = require('..')

const ProfileDataExtrasVerbose = readProfile(`${__dirname}/fixtures/extras-verbose.cpuprofile`)
const ProfileDataVanillaQuiet = readProfile(`${__dirname}/fixtures/vanilla-quiet.cpuprofile`)

describe('profile-info constructor tests', () => {
  test('profile-info can load valid profile data', done => {
    let profileInfo

    profileInfo = ProfileInfo.create(ProfileDataExtrasVerbose)
    expect(profileInfo).toEqual(expect.anything())

    profileInfo = ProfileInfo.create(ProfileDataVanillaQuiet)
    expect(profileInfo).toEqual(expect.anything())

    done()
  })
})

function readProfile (fileName) {
  return JSON.parse(fs.readFileSync(fileName, 'utf8'))
}
