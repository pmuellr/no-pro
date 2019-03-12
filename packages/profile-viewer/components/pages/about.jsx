'use strict'

import React from 'react'

const Store = require('../../lib/store')
const BuildDate = require('../../build-info.js')

const debug = require('../../lib/debug')(__filename)

export default function AboutPage (props) {
  debug('rendering AboutPage')

  Store.set({ pageSubtitle: 'about' })

  return <div style={{ overflowY: 'scroll', height: '100%' }}>
    <img
      src='images/no-pro.png'
      style={{ width: 64, float: 'right', marginLeft: '1em', marginBottom: '1em' }}
    />

    <p>built: {BuildDate}</p>

    <p>
      This app provides an alternative from the 'typical'
      CPU profilers you might be familiar with.
      Instead of flame graphs, singular lists of functions, and multiple
      time values (eg, self vs total), this app:
    </p>

    <ul>
      <li><p>
        shows functions grouped by package and module
      </p></li>
      <li><p>
        only deals with the time spent in a function and not
        time spent in a function and the functions it calls
        (only shows self time, not total time)
      </p></li>
      <li><p>
        shows packages, modules and functions sorted by
        time, descending
      </p></li>
      <li><p>
        generally hides functions that run in less than 100 microseconds
      </p></li>
    </ul>

    <p>
      The app is part of the&nbsp;
      <a href='https://github.com/pmuellr/no-pro' target='no-pro-gh'>
        no-pro project
      </a>.
    </p>

    <p>License:&nbsp;
      <a href='https://github.com/pmuellr/no-pro/blob/master/LICENSE.md' target='no-pro-license'>
        MIT
      </a>
    </p>

    <p>
      If you'd like to contribute, awesome! Please see the&nbsp;
      <a href='https://github.com/pmuellr/no-pro/blob/master/CONTRIBUTING.md' target='no-pro-contrib'>
        page on contributing
      </a>
      &nbsp;for more details.
    </p>
  </div>
}
