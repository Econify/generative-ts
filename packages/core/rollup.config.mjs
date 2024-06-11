import { baseConfig } from '../../rollup.config.base.mjs';

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
      {
        name: 'finished',
        buildStart() {
          console.log(`\x1b[32mBundling ${pkg.name}...\x1b[0m`);
        },
        writeBundle({ format }) {
          console.log(`\x1b[32mFinished \x1b[1m${pkg.name}\x1b[0m (${format})`);
        }
      }
    ],
    external: [
      ...baseConfig.external,
      'aws4',
      'ejs',
      'fp-ts/lib/Either.js',
      'io-ts',
    ]
  }
];
