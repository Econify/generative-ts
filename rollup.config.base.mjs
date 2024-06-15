import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

export const baseConfig = {
  plugins: [
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
    })
  ],
  external: [
    '@generative-ts/core', 
    '@generative-ts/gcloud-vertex-ai',
    'tslib',
    'process',
  ],
};
