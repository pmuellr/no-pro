'use strict'

/* global fetch */

// get the json from a url
module.exports = async function fetchJSON (url) {
  try {
    var response = await fetch(url)
  } catch (err) {
    return { error: `error fetching ${url}: ${err.message}` }
  }

  if (response.status >= 400 && response.status < 500) {
    return null
  }

  try {
    var result = await response.json()
  } catch (err) {
    return { error: `error parsing json from ${url}: ${err.message}` }
  }

  return result
}
