'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
module.exports = app

app.use(bodyParser.json())

app.post('*', (req, res) => {
  if (req.body == null) {
    return res.send(400, { error: 'no JSON object in the request' })
  }

  res.set('Content-Type', 'application/json')
  res.send(200, JSON.stringify(req.body, null, 4))
})

app.all('*', (req, res) => {
  res.send(405, { error: 'only POST requests are accepted' })
})

if (require.main === module) main()

function main() {
  console.log('basically worked')
}
