import { baseConfig, finishedPlugin } from '../../rollup.config.base.mjs';

// import pkg from './package.json' assert { type: 'json' };
const pkg = { name: '@generative-ts/core' };

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
      ...baseConfig.external,
      'aws4',
      'fp-ts/lib/Either.js',
      'io-ts',
    ]
  }
];
