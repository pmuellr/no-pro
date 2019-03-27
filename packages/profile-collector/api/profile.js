'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
module.exports = app

app.get('*', handleGet)
app.put('*', bodyParser.json(), handlePutProfile)
app.delete('*', handleDeleteProfile)
app.all('*', handleUnknown)

async function handleGet (req, res) {
  if (req.query.id == null) return handleListProfiles(req, res)
  return handleGetProfile(req, res)
}

async function handleListProfiles (req, res) {
  return res.send({ status: 'handleListProfiles() not yet implemented' })
}

async function handleGetProfile (req, res) {
  return res.send({ status: 'handleGetProfile() not yet implemented' })
}

async function handlePutProfile (req, res) {
  return res.send({ status: 'handlePutProfile() not yet implemented' })
}

async function handleDeleteProfile (req, res) {
  return res.send({ status: 'handleDeleteProfile() not yet implemented' })
}

async function handleUnknown (req, res) {
  return res.send({ error: `unknown request: ${req.method} ${req.originalUrl}` })
}

if (require.main === module) {
  const port = process.env.PORT || '3000'
  app.listen(port, 'localhost', () => {
    console.log(`server started on http://localhost:${port}`)
  })
}
