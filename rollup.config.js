import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies);

export default {
  plugins: [
    babel(
      Object.assign(
        {
          exclude: 'node_modules/**'
        },
        babelrc()
      )
    )
  ],
  sourcemap: true,
  input: 'src/index.js',
  name: 'CanonicalJSON',
  external,
  output: [
    {
      file: pkg.module,
      format: 'es'
    },
    {
      file: pkg.main,
      format: 'umd'
    }
  ]
};
