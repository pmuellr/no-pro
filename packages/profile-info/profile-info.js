'use strict'

const buildProfileEntries = require('./lib/profile-entries-builder')

module.exports = {
  create
}

// create a profile info object from a profile
function create (profile) {
  return new ProfileInfo(profile)
}

// model of the profile info returned for  a profile
class ProfileInfo {
  constructor (profile) {
    if (profile == null) throw new Error('expecting profile object as argument')

    if (!Array.isArray(profile.nodes)) {
      throw new Error('expecting profile argument to have nodes array property')
    }

    if (typeof profile.startTime !== 'number') {
      throw new Error('expecting profile argument to have numeric startTime property')
    }

    if (typeof profile.endTime !== 'number') {
      throw new Error('expecting profile argument to have numeric endTime property')
    }

    // microseconds
    this._time = profile.endTime - profile.startTime

    const { nodes, scripts } = profile
    const { pkgs, mods, fns } = buildProfileEntries(this._time, nodes, scripts)

    // these are all maps of id -> node (Pkg, Mod, Fn)
    this._pkgMap = pkgs
    this._modMap = mods
    this._fnMap = fns

    this._pkgs = new Set(pkgs.values())
    this._mods = new Set(mods.values())
    this._fns = new Set(fns.values())

    this._nodeCount = profile.nodes.length
    this._metaData = profile.metaData
    this._metrics = profile.metrics
  }

  // microseconds
  get time () { return this._time }
  get packages () { return this._pkgs }
  get modules () { return this._mods }
  get functions () { return this._fns }
  get metaData () { return this._metaData }
  get metrics () { return this._metrics }
  get nodeCount () { return this._nodeCount }

  packageById (id) { return this._pkgMap.get(id) }
  moduleById (id) { return this._modMap.get(id) }
  functionById (id) { return this._fnMap.get(id) }
}

/*
if (require.main === module) main()

async function main () {
  const fs = require('fs')
  const path = require('path')

  const profileName = path.join(__dirname, 'test', 'fixtures', 'extras-verbose.cpuprofile')
  // const profileName = path.join(__dirname, 'test', 'fixtures', 'vanilla-quiet.cpuprofile')
  const profile = JSON.parse(fs.readFileSync(profileName, 'utf8'))
  const profileInfo = create(profile)

  console.log(`time: ${profileInfo.time} μs`)
  console.log(`metadata: ${JSON.stringify(profileInfo.metaData, null, 4)}`)
  console.log(`metrics: ${JSON.stringify(profileInfo.metrics, null, 4)}`)

  console.log()
  console.log('packages')
  for (let entry of profileInfo.packages) {
    entry.dump()
  }

  console.log()
  console.log('modules')
  for (let entry of profileInfo.modules) {
    entry.dump()
  }

  console.log()
  console.log('functions')
  for (let entry of profileInfo.functions) {
    entry.dump()
  }
}
*/
