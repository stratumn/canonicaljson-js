## Development

### macOS

The tests need a version of `readlink` that support the `-v` option.
Macports and homebrew provide a coreutils package containing greadlink (GNU readlink).

You can do, for instance:
```
brew install coreutils

# in your .bashrc, .zshrc...
export PATH="/usr/local/opt/coreutils/libexec/gnubin:$PATH"
```

The tests also need the GNU version of `awk`. It is provided by homebrew:

```
brew install gawk
```

The tests will run if you change `#!/usr/bin/awk -f` to `#!/usr/local/bin/gawk -f` in `canonicaljson-spec/test/prettyjson.awk`:

```
sed -i "" s_/usr/bin/awk_/usr/local/bin/gawk_ canonicaljson-spec/test/prettyjson.awk
```

This change will be ignored by `git`.

