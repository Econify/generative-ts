import json from '@rollup/plugin-json';
import polyfills from 'rollup-plugin-polyfill-node';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

import { finishedPlugin } from '../../rollup.config.base.mjs';

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
      resolve(),
      typescript({
        outputToFilesystem: true,
      }),
      commonjs(),
      terser(),
      visualizer({
        filename: './stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true
      }),
      finishedPlugin(pkg),
    ],
    external: [
      'fetch',
    ],
  },
];
