no-pro runtime - node.js profiling tools
================================================================================

<img src="images/no-pro.png" width="64" align="right">

no-pro provides CPU profiling tools for Node.js.

This repository is a mono-repo, with the following embedded packages:

- [runtime](packages/runtime/README.md)

  This package is the core runtime function to generate profile data, to be
  added as instrumentationn to your application.


development
================================================================================

This repository contains a number of independent packages rooted in the
`packages` directory - like a [lerna repo](https://lernajs.io/), but currently
not actually a lerna repo.  These packages are referred to below as
"embedded packages".

The root directory contains a `package.json` which largely just includes
`devDependencies` used by the embedded packages.  Generally, the embedded
packages do not contain **any** `devDependencies`.

The downside of this approach is that `devDependencies` executables are not
directly available, when running in an embedded package's root directory.

To counter this down-side, there are some command-line tools available in the
`tools` directory, intended to be run from the root directory of the repository,
to perform actions on the embedded packages.

- `tools/run-one.js <package> <cmd>`

  This tool will run a single command in the embedded package's root directory.
  It's actions:

    - adds the root `tools` directory to the path
    - adds the root `node_modules/.bin` directory to the path
    - collects all the arguments after `<package>` to be used as the command
      to run
    - runs the command in the `packages/<package>` directory

- `tools/watch-one.js <package>`

  A shortcut for the command: ``tools/run-one.js <package> npm run watch`.
  The npm script `watch` is generally used during development to watch for
  changes to the source, and then run builds, tests, etc.

### examples

- `tools/run-one.js runtime jest --colors`

  Runs the `jest --colors` command in the `packages/runtime`
  directory, to run the jest tests.

- `tools/watch-one.js runtime`

  Runs the `npm run watch` command-line tool in the `packages/runtime`
  directory, which will watch for changes, then run `standard`, `jest`,
  etc.


license
================================================================================

This package is licensed under the MIT license.  See the [LICENSE.md][] file
for more information.


contributing
================================================================================

Awesome!  We're happy that you want to contribute.

Please read the [CONTRIBUTING.md][] file for more information.


[LICENSE.md]: LICENSE.md
[CONTRIBUTING.md]: CONTRIBUTING.md