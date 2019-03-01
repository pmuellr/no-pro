no-pro tools - development tools for the cli
================================================================================

There are a number of executable scripts in the `tools` directory.  They are
generally all invoked in the repository root directory in one way or another,
though some embedded projects invoke them via npm scripts (eg,
`node ../../tools/foo.js`).

Generally they return a status code of 1 for "failure" conditions, and 0 on
success.

The `run-one.js` and `run-all.js` scripts can be used to run arbitrary cli
commands in one or all embedded project directories.


deps-check.js
--------------------------------------------------------------------------------

Checks package production dependencies to make there are none missing (used in
code) and unused (in package.json but not used in code).

uses: https://www.npmjs.com/package/dependency-check


ncu-all.js
--------------------------------------------------------------------------------

Runs `ncu` in all embedded directories, to look for package updates.  Note,
`ncu` must be installed globally via `npm install -g npm-check-updates`, since
it installs `npm` locally, which seems not great.

uses: https://www.npmjs.com/package/npm-check-updates


npm-clean-all.js
--------------------------------------------------------------------------------

Clean out all the `node_modules` and `package-lock.json` files in embedded
packages.  An `npm install` run in the repository root directory will run
`npm installs` in all embedded directories via a `postinstall` script.


run-all.js
--------------------------------------------------------------------------------

Run a cli command specified as arguments to this program, in all embedded
directories.

#### example

`tools/run-all.js "pwd; ls"`

Runs the `pwd` then `ls` in each embedded project.


run-one.js
--------------------------------------------------------------------------------

Run a cli command specified as arguments to this program, after the embedded
package name, in the relevant embedded package directory.


#### example

`tools/run-one.js runtime jest --colors`

Runs the `jest --colors` command in the `packages/runtime`
directory, to run the jest tests.


version-info.js
--------------------------------------------------------------------------------

Prints version info about embedded packages and their dependencies.


watch-one.js
--------------------------------------------------------------------------------

Short-cut for `tools/run-one.js <embedded package> npm run watch`.  Each
embedded package has an npm `watch` script intended to be used during
development, which watches for source file changes, builds, tests, etc.

#### example

`tools/watch-one.js runtime`

Runs the `npm run watch` command-line tool in the `packages/runtime`
directory, which will watch for changes, then run `standard`, `jest`,
etc.

