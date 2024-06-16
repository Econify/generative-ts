import { baseConfig, finishedPlugin } from '../../rollup.config.base.mjs';

// import pkg from './package.json' assert { type: 'json' };
const pkg = { name: 'generative-ts' };

export default [
  {
    ...baseConfig,
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
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'GenerativeTs',
        globals: {
        }
      }
    ],
    plugins: [
      ...baseConfig.plugins,
      finishedPlugin(pkg),
    ],
    external: [
      '@generative-ts/core', 
      '@generative-ts/gcloud-vertex-ai',
      'tslib',
      'process',
    ]
  }
];
