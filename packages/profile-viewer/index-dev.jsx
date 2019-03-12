'use strict'

import './index.jsx'

onLoad()

async function onLoad () {
  const body = document.getElementById('body')
  const bodyClasses = body.classList

  bodyClasses.add('dev-mode')
}
