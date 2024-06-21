import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

export const finishedPlugin = ({ name }) => ({
  name: 'finished',
  buildStart() {
    console.log(`\x1b[32mBundling ${name}...\x1b[0m`);
  },
  writeBundle({ format }) {
    console.log(`\x1b[32mFinished \x1b[1m${name}\x1b[0m (${format})`);
  }
});

export const baseConfig = {
  plugins: [
    resolve(),
    typescript({
      outputToFilesystem: true,
      tslib: 'tslib',
    }),
    commonjs(),
    terser(),
    visualizer({
      filename: './stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
  ],
  external: [
    'tslib',
    'process',
  ]
};
