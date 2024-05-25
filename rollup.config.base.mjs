import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import json from '@rollup/plugin-json';

export const baseConfig = {
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    json({
      include: '**/ejs/package.json',
    }),
    terser(),
    visualizer({
      filename: './stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  external: ['process']
};
