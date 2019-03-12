no-pro profile-info - API providing info on profiles
================================================================================

<img src="https://raw.githubusercontent.com/pmuellr/no-pro/master/docs/images/no-pro.png" width="64" align="right">

[![NPM version](https://img.shields.io/npm/v/@no-pro/profile-info.svg)](https://www.npmjs.com/package/@no-pro/profile-info)

Part of the [no-pro mono-repo](https://github.com/pmuellr/no-pro).


api
================================================================================

This package exports the following methods:

### `createFromProfileData(jsonProfileData)`

This function takes profile data as a JSON-able object, and returns the
following object structure:

```js
interface ProfileInfo {
  metaData: Metadata,
  metrics: Metrics,
  fns: Fns,
  mods: Modules,
  pkgs: Packages
}

interface Metadata {
  TODO
}

interface Metrics {
  TODO
}

interface Sample {
  fn: Fn,
  line: number,
  col: number,
  time: number
}

interface Fn {
  name: string,
  mod: Mod,
}

interface Mod {
  url: string,
  source: string,
  pkg: Pkg,
  fns: Fn[]
}

interface Pkg {
  name: string,
  mods: Mod[]
}

```

changelog
================================================================================

See the file [CHANGELOG.md](CHANGELOG.md).


license / contributing / etc
================================================================================

See the root of the [no-pro mono-repo](https://github.com/pmuellr/no-pro).