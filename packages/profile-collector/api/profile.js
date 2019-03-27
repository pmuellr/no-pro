'use strict'

module.exports = profile

const URL = require('url')

const createTx = require('../lib/tx')

async function profile (req, res) {
  console.log(`${__filename}: profile() ${req.method} ${req.url}`)
  // console.log(`headers:`, req.headers)

  const method = req.method.toUpperCase()
  const url = URL.parse(req.url, true)
  const path = url.pathname
  const query = url.query
  console.log(`path: ${path}`)
  console.log(`query: ${JSON.stringify(query)}`)

  const tx = createTx(req, res)

  if (method === 'GET' && query.id == null) return doListProfiles(tx)
  if (method === 'GET') return doGetProfile(tx, query.id)
  if (method === 'PUT') return doPutProfile(tx, query.id)
  if (method === 'DELETE') return doDeleteProfile(tx, query.id)

  await tx.send(new Error('invalid operation'))
}

async function doListProfiles (tx) {
  return tx.send({ status: 'doListProfiles() not yet implemented' })
}

async function doGetProfile (tx) {
  return tx.send({ status: 'doGetProfile() not yet implemented' })
}

async function doPutProfile (tx) {
  return tx.send({ status: 'doPutProfile() not yet implemented' })
}

async function doDeleteProfile (tx) {
  return tx.send({ status: 'doDeleteProfile() not yet implemented' })
}

if (require.main === module) {
  const req = {
    method: 'GET',
    url: '/api/profile.js?id=foo',
    headers: {}
  }

  const res = {
    end (content, cb) { setImmediate(cb) }
  }

  profile(req, res)
}
