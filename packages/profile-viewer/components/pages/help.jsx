'use strict'

import React from 'react'

import ToolBarIcon from '../tool-bar-icon.jsx'

const Store = require('../../lib/store.js')

const debug = require('../../lib/debug')(__filename)

export default function HelpPage (props) {
  debug('rendering HelpPage')

  Store.set({ pageSubtitle: 'help' })

  return <div style={{ overflowY: 'scroll', height: '100%' }}>
    <img
      src='images/no-pro.png'
      style={{ width: 64, float: 'right', marginLeft: '1em', marginBottom: '1em' }}
    />

    <p>
      This web application is used to display information from a V8
      CPU profiler file.  Typically these files have an extension of
      <tt>.cpuprofile</tt>.  They can be created from Chrome Dev Tools
      and other diagnostic tooling.
    </p>

    <p>
      Below is a screen capture of the application, displaying a
      profile from a run of <tt> npm install</tt>.
    </p>

    <img
      src='images/no-pro-profile-viewer.png'
      style={{
        width: '50%',
        border: 'thin solid #999',
        marginLeft: '2em'
      }}
    />

    <p>
      The primary user interface for this application are the four "panes" -
      three panes arranged horizontally above one long pane.  The three top panes
      are labelled "packages", "modules" and "functions".  The longer pane
      at the bottom displays data about content selected in other panes.
      In the image above, it's displaying information about the module
      &nbsp;<tt>lib/install/deps.js</tt>.
    </p>

    <p>
      When a profile is loaded into the application, each function is
      associated with a package and module.  The time spent within
      each function, module and package is calculated.  The "packages",
      "modules", and "functions" panes show each of these entries, sorted
      by longest amount of time.
    </p>

    <p>
      When you select a package, module, or function by clicking on it:
    </p>

    <ul>
      <li><p>
        the entries in the panes to the right will be filtered to only show
        entries associated with the item clicked
      </p></li>
      <li><p>
        the content pane at the bottom will show more detail about the
        selected item
      </p></li>
    </ul>

    <p>
      The displayed time units are
      "μs" for microseconds (1 / 1000th of a millisecond),
      "ms" for milliseconds (1 / 1000th of a second), and
      "s" for seconds.
    </p>
    <p>
      At the top right are the following tool buttons:
    </p>

    <p><ToolBarIcon icon='add_box' /> -
      open a new profile file on your computer
      ( or you can drag a file from your desktop to this application )
    </p>
    <p><ToolBarIcon icon='dashboard' /> -
      show the main page with the profile data
    </p>
    <p><ToolBarIcon icon='help' /> -
      show this help page
    </p>
    <p><ToolBarIcon icon='info' /> -
      display some information about this application
    </p>

  </div>
}
