import { baseConfig } from '../../rollup.config.base.mjs';

export default [
  // main bundles (cjs, esm)
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.mjs',
        format: 'esm',
        sourcemap: true
      }
    ],
    ...baseConfig
  }
];
