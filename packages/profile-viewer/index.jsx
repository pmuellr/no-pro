'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/app.jsx'

const debug = require('./lib/debug')(__filename)

console.log(`use "localStorage.debug = '*'" to enable debug messages`)
debug('starting app')

onLoad()

function onLoad () {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  )
}
