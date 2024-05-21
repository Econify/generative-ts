import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';

const config = [
  // main bundles (cjs, esm)
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.cjs.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/bundle.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
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
  },
  // typedefs (index.d.ts)
  {
    input: 'src/index.ts',
    output: [{
      file: 'dist/index.d.ts',
      format: 'es'
    }],
    plugins: [dts()],
  }
];

export default config;
