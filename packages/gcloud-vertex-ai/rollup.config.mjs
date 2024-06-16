import { baseConfig, finishedPlugin } from '../../rollup.config.base.mjs';

// import pkg from './package.json' assert { type: 'json' };
const pkg = { name: '@generative-ts/gcloud-vertex-ai' };

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
      }
    ],
    plugins: [
      ...baseConfig.plugins,
      finishedPlugin(pkg),
    ],
    external: [
      // ...baseConfig.external,
      '@generative-ts/core',
      'google-auth-library',
      'tslib',
      'process',
    ]
  }
];
