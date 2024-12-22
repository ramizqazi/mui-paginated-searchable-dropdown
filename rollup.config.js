import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import url from '@rollup/plugin-url';

export default {
  input: 'src/SearchableDropdown.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    url({
      limit: 4096, // inline files < 4kb, copy files > 4kb
      include: ['**/*.png', '**/*.jpg', '**/*.gif', '**/*.svg'],
      emitFiles: true
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx']
    }),
    resolve({
      extensions: ['.js', '.jsx']
    }),
    commonjs(),
    terser(),
  ],
  external: [
    'react',
    'react-dom',
    '@mui/material',
    '@mui/icons-material',
    'lodash.debounce',
    'material-ui-popup-state',
    'prop-types',
    'react-window'
  ]
};