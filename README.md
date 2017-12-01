# canonicaljson-js

JS library for producing JSON in canonical format as specified by https://gibson042.github.io/canonicaljson-spec/. The provided interface matches that of native JSON object.

[![npm](https://img.shields.io/npm/v/canonicaljson.svg)](https://www.npmjs.com/package/canonicaljson)
[![build status](https://travis-ci.org/stratumn/canonicaljson-js.svg?branch=master)](https://travis-ci.org/stratumn/canonicaljson-js)
[![codecov](https://codecov.io/gh/stratumn/canonicaljson-js/branch/master/graph/badge.svg)](https://codecov.io/gh/stratumn/canonicaljson-js)

## Installation

```bash
npm install canonicaljson
```

or

```bash
yarn add canonicaljson
```

## Usage

```bash
const json = require('canonicaljson');

const obj = json.parse('{ "a": 12 }');
console.log(json.stringify(obj))

// or if you use ES6 modules
import { parse, stringify } from 'canonicaljson';

const obj = parse('{ "a": 12 }');
console.log(stringify(obj))
```


## Development

Integration tests are located in the `canonicaljson-spec` submodule.
To download them, you should run:

```bash
git submodule init
git submodule update
```

### macOS

The tests need a version of `readlink` that support the `-v` option.
Macports and homebrew provide a coreutils package containing greadlink (GNU readlink).

You can do, for instance:

```bash
brew install coreutils

# in your .bashrc, .zshrc...
export PATH="/usr/local/opt/coreutils/libexec/gnubin:$PATH"
```

The tests also need the GNU version of `awk`. It is provided by homebrew:

```bash
brew install gawk
```

The tests will run if you change `#!/usr/bin/awk -f` to `#!/usr/local/bin/gawk -f` in `canonicaljson-spec/test/prettyjson.awk`:

```bash
sed -i "" s_/usr/bin/awk_/usr/local/bin/gawk_ canonicaljson-spec/test/prettyjson.awk
```

This change will be ignored by `git`.
