import { baseConfig, dtsConfig } from '../../rollup.config.base.mjs';

export default [
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
    ...baseConfig
  },
  // typedefs (index.d.ts)
  {
    input: 'src/index.ts',
    output: [{
      file: 'dist/index.d.ts',
      format: 'es'
    }],
    ...dtsConfig
  }
];
