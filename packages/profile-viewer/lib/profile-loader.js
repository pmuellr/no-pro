'use strict'

module.exports = {
  loadFromURL,
  loadFromFile
}

const Store = require('./store')
const fetchJSON = require('./fetch-json')
const ProfileInfo = require('../../profile-info/profile-info')
const createDeferred = require('./deferred')

const debug = require('./debug')(__filename)

// load a profile (from drop-handler or file-reader)
async function loadFromFile (file) {
  const deferred = createDeferred()

  const fileReader = new window.FileReader()

  fileReader.onload = onLoad
  fileReader.onabort = () => {
    deferred.reject(new Error(`file load interrupted: ${file}`))
  }
  fileReader.onerror = () => {
    deferred.reject(new Error(`file load error: ${file}`))
  }

  fileReader.readAsText(file)

  return deferred.promise

  function onLoad (event) {
    const data = event.target && event.target.result
    if (data == null) {
      return deferred.reject(new Error(`no data in file: ${file.name}`))
    }

    let profileData
    try {
      profileData = JSON.parse(data)
    } catch (err) {
      return deferred.reject(new Error(`file is not JSON: ${file.name}`))
    }

    const profileInfo = ProfileInfo.create(profileData)
    if (profileInfo == null) {
      return deferred.reject(new Error(`file is not a V8 CPU profile: ${file.name}`))
    }

    profileInfo.fileName = file.name

    Store.set({
      profileInfo,
      pkgIdSelected: null,
      modIdSelected: null,
      fnIdSelected: null
    })

    deferred.resolve(profileInfo)
  }
}

// load a profile from a URL
async function loadFromURL (url) {
  debug(`loading profile from ${url}`)

  try {
    var profile = await fetchJSON(url)
  } catch (err) {
    throw new Error(`error loading profile from ${url}: ${err.message}`)
  }

  const profileInfo = ProfileInfo.create(profile)

  Store.set({
    profileInfo,
    pkgIdSelected: null,
    modIdSelected: null,
    fnIdSelected: null
  })

  return profileInfo
}
