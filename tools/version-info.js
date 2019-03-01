#!/usr/bin/env node

'use strict'

// print version info embedded packages

const path = require('path')

const embeddedPackages = require('./lib/embedded-packages')

const RootPath = path.resolve(path.join(__dirname, '..'))

let rows = []
rows.push(['package', 'declared', 'installed'])
rows.push(['-------', '--------', '---------'])

for (let embeddedPackage of embeddedPackages) {
  rows = rows.concat(getRowsForPackage(embeddedPackage))
  rows.push([])
}

rows.pop()

printTable(rows)

function getRowsForPackage (embeddedPackage) {
  const pkgJson = require(`${RootPath}/packages/${embeddedPackage}/package.json`)
  const deps = pkgJson.dependencies || {}

  const rows = []
  // rows.push([`${pkgJson.name} - ${pkgJson.version}`])
  rows.push([pkgJson.name, pkgJson.version])

  let foundSome = false
  for (let depName in deps) {
    foundSome = true

    const depVersionDeclared = deps[depName]
    const depVersionInstalled = getInstalledPackageVersion(embeddedPackage, depName)

    rows.push([`  - ${depName}`, depVersionDeclared, depVersionInstalled])
  }

  if (!foundSome) rows.push(['', 'none'])

  return rows
}

function getInstalledPackageVersion (embeddedPackage, depPackage) {
  try {
    var depPkgJson = require(`${RootPath}/packages/${embeddedPackage}/node_modules/${depPackage}/package.json`)
  } catch (err) {
    return 'not installed'
  }

  return depPkgJson.version
}

function printTable (rows) {
  let cols = 0

  // get number of columns
  for (let row of rows) {
    cols = Math.max(cols, row.length)
  }

  // pad columns in rows if neccessary
  for (let row of rows) {
    while (row.length < cols) row.push('')
  }

  // convert to strings
  for (let row of rows) {
    for (let i = 0; i < row.length; i++) {
      row[i] = `${row[i]}`
    }
  }

  // calculate max widths for each column
  const maxWidths = new Array(cols).fill(0)

  for (let row of rows) {
    for (let i = 0; i < row.length; i++) {
      maxWidths[i] = Math.max(maxWidths[i], row[i].length)
    }
  }

  // print
  for (let row of rows) {
    const parts = []

    for (let i = 0; i < row.length; i++) {
      let col = row[i]

      if (/^-+$/.test(col)) {
        col = ''.padEnd(maxWidths[i], '-')
      }

      parts[i] = col.padEnd(maxWidths[i], ' ')
    }

    console.log(parts.join('  '))
  }
}
