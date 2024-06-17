import json from '@rollup/plugin-json';
import polyfills from 'rollup-plugin-polyfill-node';
import replace from '@rollup/plugin-replace';

import { baseConfig, finishedPlugin } from '../../rollup.config.base.mjs';

// import pkg from './package.json' assert { type: 'json' };
const pkg = { name: 'generative-ts' };

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'GenTs',
      sourcemap: true,
      globals: {
        'fetch': 'fetch',
      }
    },
    plugins: [
      json(),
      polyfills(),
      replace({
        'node-fetch': 'fetch',
      }),
      ...baseConfig.plugins,
      finishedPlugin(pkg),
    ],
    external: [
      ...baseConfig.external,
      'fetch'
    ],
  },
];
