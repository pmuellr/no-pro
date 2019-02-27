'use strict'

const debug = require('./debug')(__filename)

// return array of {scriptId, source} for scriptId's found in a profile
module.exports = async function getSources (session, profile) {
  debug('getting sources')

  const { nodes } = profile
  if (!Array.isArray(nodes)) {
    throw new Error('profile.nodes is not an array')
  }

  await session.post('Debugger.enable')

  const notFoundScriptIds = new Set()
  const scripts = new Map()

  for (let node of nodes) {
    // make sure there's  some valid info on the call frame
    const callFrame = node.callFrame
    if (callFrame == null) continue

    const { scriptId, url } = callFrame
    if (scriptId == null) continue
    if (url == null) continue

    // did we already get it? if so, nothing to do
    if (scripts.get(scriptId) != null) continue
    if (notFoundScriptIds.has(scriptId)) continue

    // get the source
    try {
      var result = await session.post('Debugger.getScriptSource', { scriptId })
    } catch (err) {
      notFoundScriptIds.add(scriptId)
      continue
    }

    const source = result && result.scriptSource

    scripts.set(scriptId, { scriptId, url, source })
  }

  return Array.from(scripts.values())
}
