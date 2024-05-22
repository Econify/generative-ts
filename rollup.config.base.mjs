import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';

export const baseConfig = {
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
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

export const dtsConfig = {
  plugins: [dts()]
};
