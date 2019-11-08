'use strict'

module.exports = buildProfileEntries

const entries = require('./entries')
const LongestCommonPath = require('./longest-common-path')

// const debug = require('./debug')(__filename)

const SOURCE_NOT_AVAILABLE = '// source not available'
const ANONYMOUS_FUNCTION = '(anonymous)'
const CORE_MODULE = '(core)'
const CORE_PACKAGE = '(core)'

// populate the profile info object from the profile
function buildProfileEntries (time, nodes, scripts) {
  const miPerSample = microsPerSample(time, nodes)

  const [ pkgs, mods, fns ] = [new Map(), new Map(), new Map()]

  const scriptMap = buildScriptMap(scripts)
  const fnAccessor = new FnAccessor(fns, scriptMap)
  const modAccessor = new ModAccessor(mods, scriptMap)
  const pkgAccessor = new PkgAccessor(pkgs, scriptMap)

  const nodeMap = buildNodeMap(nodes)

  // build fn, mod, and pkg objects
  for (let node of nodes) {
    // create entries
    const fn = fnAccessor.getEntry(node)
    const mod = modAccessor.getEntry(node)
    const pkg = pkgAccessor.getEntry(node)

    // link fn / mod / pkg objects
    fn.mod = mod
    fn.pkg = pkg

    mod.pkg = pkg
    mod.fns.add(fn)

    pkg.fns.add(fn)
    pkg.mods.add(mod)

    // add time to entries
    const time = Math.round(node.hitCount * miPerSample)
    fn.addTime(time)
    mod.addTime(time)
    pkg.addTime(time)
  }

  // add calls / calledBy
  for (let node of nodes) {
    // create entries
    const fn = fnAccessor.getEntry(node)
    const mod = modAccessor.getEntry(node)
    const pkg = pkgAccessor.getEntry(node)

    const children = node.children || []
    for (let childNodeId of children) {
      const childNode = nodeMap.get(childNodeId)
      const childFn = fnAccessor.getEntry(childNode)
      const childMod = modAccessor.getEntry(childNode)
      const childPkg = pkgAccessor.getEntry(childNode)

      fn.addCalls(childFn)
      if (mod !== childMod) mod.addCalls(childMod)
      if (pkg !== childPkg) pkg.addCalls(childPkg)
    }
  }

  // simplify the ids, now that all the data has been linked
  resetIds(fns, 'f')
  resetIds(mods, 'm')
  resetIds(pkgs, 'p')

  resetModulePathsInApp(pkgs)

  // add
  return { pkgs, mods, fns }
}

function resetModulePathsInApp (pkgs) {
  const appPackage = Array
    .from(pkgs.values())
    .filter(pkg => pkg.name === '<app>')[0]

  if (appPackage == null) return

  const allModuleNames = Array.from(appPackage.mods)
    .map(mod => mod.name)

  if (allModuleNames.length === 0) return

  const longestCommonPath = LongestCommonPath(allModuleNames)

  for (let mod of appPackage.mods) {
    mod.name = mod.name.substr(longestCommonPath.length + 1)
  }
}

function resetIds (map, prefix) {
  const oldKeys = Array.from(map.keys())

  let id = 0
  for (let oldKey of oldKeys) {
    const item = map.get(oldKey)
    map.delete(oldKey)

    const newKey = `${prefix}-${id}`
    id++

    item._id = newKey
    map.set(newKey, item)
  }
}

// classes to handle unique aspects of entries: getting keys and construction
class EntryAccessor {
  constructor (entriesMap, scriptMap) {
    this._entriesMap = entriesMap
    this._scriptMap = scriptMap
    this._cachedIds = new WeakMap()
  }

  // get the id for a node
  getId (node) {
    const cachedId = this._cachedIds.get(node)
    if (cachedId != null) return cachedId

    const id = this._getId(node)
    this._cachedIds.set(node, id)

    return id
  }

  // get an entry for a node
  getEntry (node) {
    const id = this.getId(node)

    let entry = this._entriesMap.get(id)
    if (entry != null) return entry

    entry = this._createEntry(id, node)
    this._entriesMap.set(id, entry)

    return entry
  }

  // methods subclasses should implement
  _getId (node) { throw new Error('subclass responsibility') }
  _createEntry (id, node) { throw new Error('subclass responsibility') }
}

// function entry accessor
class FnAccessor extends EntryAccessor {
  _getId (node) {
    let { functionName, url, lineNumber, columnNumber } = node.callFrame

    url = removeFileProtocol(url || '')
    functionName = functionName || ANONYMOUS_FUNCTION
    lineNumber = lineNumber || 0
    columnNumber = columnNumber || 0

    return `${url}:${lineNumber}:${columnNumber} ${functionName}`
  }

  _createEntry (id, node) {
    let { functionName, url, scriptId, lineNumber, columnNumber } = node.callFrame

    url = removeFileProtocol(url || '')

    const pkg = null
    const mod = null
    const name = `${functionName || ANONYMOUS_FUNCTION}()`
    const line = lineNumber || 0
    const col = columnNumber || 0
    const source = this._scriptMap.get(scriptId) || SOURCE_NOT_AVAILABLE

    const props = { pkg, mod, name, url, line, col, source }
    return entries.createFn(id, props)
  }
}

// module entry accessor
class ModAccessor extends EntryAccessor {
  _getId (node) {
    return removeFileProtocol(node.callFrame.url)
  }

  _createEntry (id, node) {
    let { url, scriptId } = node.callFrame
    const { modPath } = splitUrl(url)

    const pkg = null
    const name = modPath || CORE_MODULE
    const fns = new Set()
    const source = this._scriptMap.get(scriptId) || SOURCE_NOT_AVAILABLE

    url = removeFileProtocol(url)
    const props = { pkg, name, url, fns, source }
    return entries.createMod(id, props)
  }
}

// package entry accessor
class PkgAccessor extends EntryAccessor {
  _getId (node) {
    const { pkgName, pkgPath } = splitUrl(node.callFrame.url)

    return `${pkgName} ${pkgPath}`
  }

  _createEntry (id, node) {
    const { pkgName, pkgPath } = splitUrl(node.callFrame.url)

    const name = pkgName || CORE_PACKAGE
    const mods = new Set()
    const fns = new Set()

    const props = { name, pkgPath, mods, fns }
    return entries.createPkg(id, props)
  }
}

// split a profile node url into { pkgName, pkgPath, modPath }
// - pkgName - package name w/ or wo/ scope
// - pkgPath - the path to the package
// - modPath - the path of the module relative to the package
// url = path.join(pkgPath, pkgName, modPath)
function splitUrl (url) {
  if (url == null) url = '<core>'
  if (url === '') url = '<core>'

  const result = { pkgName: '<core>', pkgPath: '', modPath: url }

  if (url === '<core>') return result
  if (!url.startsWith('file:')) return result

  url = removeFileProtocol(url)

  const patternNM = /^(.*)\/node_modules\/(.*)$/

  let match = url.match(patternNM)
  if (match == null) {
    const fakePkgInfo = splitByFakePackageDir(url)
    if (fakePkgInfo != null) return fakePkgInfo

    const pkgName = '<app>'
    return Object.assign({}, result, { pkgName })
  }

  const pkgPath = match[1]
  const pkgRelPath = match[2]

  const pathParts = pkgRelPath.split('/')

  const partsLen = pathParts[0].startsWith('@') ? 2 : 1
  const pkgName = pathParts.slice(0, partsLen).join('/')
  const modPath = pathParts.slice(partsLen).join('/')

  return { pkgName, pkgPath, modPath }
}

function removeFileProtocol (url) {
  return url.replace(/^file:\/*/, '/')
}

// build a map of node id -> node
function buildNodeMap (nodes) {
  const result = new Map()

  for (let node of nodes) {
    if (node.id === null) throw new Error('every profile node should have an id')
    result.set(node.id, node)
  }

  return result
}

// build a map of script scriptId -> script
function buildScriptMap (scripts) {
  const result = new Map()
  if (scripts == null) return result

  for (let script of scripts) {
    if (script.scriptId === null) throw new Error('every profile source should have a scriptId')
    result.set(script.scriptId, script.source)
  }

  return result
}

// compute rough number of microseconds per sample
function microsPerSample (timeMicros, nodes) {
  let samples = 0
  for (let node of nodes) {
    samples += node.hitCount || 0
  }

  return timeMicros / samples
}

// get fake-package-dirs from localhost, split on ',' and ws
function getFakePackageDirs () {
  if (typeof window === 'undefined') return []
  if (typeof window.localStorage === 'undefined') return []

  let fakePackageDirs = window.localStorage['fake-packages-dirs']
  if (fakePackageDirs == null) return []

  return fakePackageDirs.replace(/,/g, ' ').trim().split(/\s+/g)
}

const FakePackageDirs = getFakePackageDirs()

function splitByFakePackageDir (url) {
  url = removeFileProtocol(url)
  for (let pkgName of FakePackageDirs) {
    const index = url.indexOf(`/${pkgName}/`)
    if (index === -1) continue

    const pkgPath = url.substr(0, index)
    const module = url.substr(index + pkgName.length + 2)
    const match = module.match(/^(.*?)\/(.*)$/)

    pkgName = `^${pkgName}/${match[1]}`
    const modPath = match[2]
    return { pkgName, pkgPath, modPath }
  }

  return null
}
