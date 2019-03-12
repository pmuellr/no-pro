'use strict'

/* global describe, test, expect */

describe('profile-viewer basic tests', () => {
  test('profile-viewer has a package.json', done => {
    expect(require('../package.json')).toHaveProperty('name')
    done()
  })
})
