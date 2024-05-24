# generative-ts

**a typescript-first utility library for building LLM applications+agents for node and the browser**

generative-ts provides a strongly-typed interface for invoking LLMs from various service providers as defined by their own APIs. It’s not a "universal interface," set of heavy abstractions, or wrapper around existing SDKs. Instead, it offers an easy way to get type-safe requests and responses from multiple LLM providers using their actual APIs. It has some useful features purpose-built for LLMs, and it’s designed for the TypeScript ecosystem with a minimal footprint and high portability in mind.

## Features

- **Simple interface**: Easy to use and understand. TODO
- **Type safety**: Leverages TypeScript to provide type-safe interactions. TODO
- **Isomorphic**: Works seamlessly on both server and client sides.
- **Tiny bundle size**: Minimal footprint for optimal performance. TODO
- **HTTP-level control**: It uses native fetch (or optionally lets you to pass your own client) to interact with models APIs, giving you uniform control of the request at the http level

## Install

To install everything:

```sh
npm i generative-ts
```

You can also do more granular installs of scoped packages if you want to optimize your builds further (see [packages](#packages))

## How it Works

TODO explain concept of APIs vs. Providers here

### APIs

* AI21 Jurrassic
* Amazon Titan Text
* Antrophic: TODO
* Cohere: chat and generate (legacy) 
* Huggingface Inference: Text Generation (and TODO)
* Meta: LLama2 chat, LLama3 chat
* Mistral (TODO: name?)
* OpenAI: chat
* (see TODO about adding your own)

### Providers

* AWS Bedrock
* Cohere
* Groq
* Huggingface Inference
* LMStudio
* OpenAI
* Any model provider with an HTTP interface should be trivial to add (see TODO)

## Usage

### Importing API and Provider

```ts
import { createAwsBedrockModelProvider } from "$generative-ts/providers/aws_bedrock";
import { Llama3ChatApi } from "$generative-ts/apis/meta";
```

### Instantiating a Model Provider

```ts
const model = createAwsBedrockModelProvider({
  api: Llama3ChatApi,
  modelId: "meta.llama3-8b-instruct-v1:0",
  // Optional
  auth: {
    accessKeyId: "TODO",
    secretAccessKey: "TODO",
    region: "us-east-1",
  },
});
```

### Custom HTTP Client

```ts
todo;
```

### Additional Examples

For more examples, please refer to the /examples folder in the repository.

## Packages

If you're using a modern bundler, just install generative-ts to get everything. Modern bundlers support tree-shaking, so your final bundle won't include unused code. (Note: we distribute both ESM and CJS bundles for compatibility.) If you prefer to avoid unnecessary downloads, or you're operating under constraints where tree-shaking isn't an option, we offer scoped packages under @generative-ts/ with specific functionality for more fine-grained installs.

|Package|Description||
|-|-|-|
| `generative-ts`              | Everything                             | Includes all scoped packages listed below                                                                                                  |
| `@generative-ts/core`        | Core dependencies                      | Interfaces, classes, utilities, etc                                                                                           |
| `@generative-ts/providers`   | All Model Providers                    | All `ModelProvider` implementations that aren't in their own packages. Most providers don't require any special dependencies so are here                         |
| `@generative-ts/provider-bedrock` | AWS Bedrock provider                    | This is its own package because it uses the `aws4` dependency to properly authenticate when running in AWS environments        |
| `@generative-ts/apis`        | Model APIs                             | `ModelAPI` implementations. These use some internal dependencies (like `ejs` for templating) which arent strictly necessary if you want to use your own implementation of `ModelAPI` (see docs of `ModelAPI` for full details -- **TODO**) |


## Contributing

We welcome contributions! To get started developing, clone the repository and run:

```sh
nvm use
npm install
```

From there you can run the example scripts (`npm run example`) which import from src/ or the "e2e tests" in `tests/`

## Report Bugs / Submit Feature Requests

Encountered a bug or have a feature request? Please submit issues here: https://github.com/Econify/generative-ts/issues

## License

**TODO**: License details will be added here.

## Package publishing and ownership

Both the "main" `generative-ts` package and the scoped `@generative-ts` packages are controlled by the generative-ts npm organization and require either 2FA or a granular access token for publishing. Currently the 'developer' team in the org only has read permissions to these packages, so that the only way they can be published is via ci/cd (as described below).

Releases are published via circleci job upon pushes to branches that have a name starting with `release/`. The job requires an NPM token that has publishing permissions to both `generative-ts` and `@generative-ts`. Currently this is a "granular" token set to expire every 30 days, created by @jnaglick