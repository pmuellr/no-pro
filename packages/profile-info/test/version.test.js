'use strict'

/* global describe, test, expect */

describe('profile-info basic tests', () => {
  test('profile-info has a package.json', done => {
    expect(require('../package.json')).toHaveProperty('name')
    done()
  })
})
