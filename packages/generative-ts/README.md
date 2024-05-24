# generative-ts

**a typescript-first utility library for building LLM applications+agents for node and the browser**

generative-ts provides a strongly-typed interface for invoking LLMs from various service providers as defined by their own APIs. It’s not a "universal interface," set of heavy abstractions, or wrapper around existing SDKs. Instead, it offers an easy way to get type-safe requests and responses from multiple LLM providers using their actual APIs. It has some useful features purpose-built for LLMs, and it’s designed for the TypeScript ecosystem with a minimal footprint and high portability in mind.

## Design Goals

- **Simple**: Invoke many different popular models and providers out of the box, using their native interfaces, with a couple lines of code
- **Typesafe**: todo
- **Customizable**: Built on interfaces and injectable dependencies, you can define your own APIs and Providers, supply your own Template implementation, or use your own HTTP client.
- **Portable**: Runs in node or the browser, ships with cjs, esm, and browser-optimized bundles
- **Minimal**: Minimal dependencies, <100KB bundles, and [scoped packages](#packages) for fine-grain installs 
- **HTTP-level control**: It uses native fetch (or optionally lets you to [pass your own client](#custom-http-client)) to interact with models APIs, giving you uniform control of the request at the http level
- **Useful**: todo 

## Install

To install everything:

```sh
npm i generative-ts
```

You can also do more granular installs of scoped packages if you want to optimize your builds further (see [packages](#packages))

## How it Works

TODO explain concept of ModelAPIs vs ModelProviders here

### ModelAPIs

* AI21: Jurrassic
* Amazon: Titan Text
* Cohere: Chat and Generate
* Huggingface Inference: Text Generation; Conversational (TODO!)
* Meta: LLama2 Chat; LLama3 Chat
* Mistral: Mistral AI API ChatCompletion; Mistral Bedrock
* OpenAI: ChatCompletion
* Antrophic: (COMING SOON)
* Google: Gemini (COMING SOON)

### ModelProviders

* AWS Bedrock
* Cohere
* Groq
* Huggingface Inference
* OpenAI
* Replicate (TODO!)
* Mistral (TODO!)
* LMStudio
* LLamafile (TODO - OpenAI ChatCompletion running local)
* vLLM (TODO - OpenAI ChatCompletion running local)
* Google Vertex AI (COMING SOON)
* Microsoft Azure (COMING SOON?)

It's also easy to add your own APIs and ModelProviders (TODO section)

## Usage

### Hello gpt

```ts
import { createOpenAiChatModelProvider } from "generative-ts";

const gpt = createOpenAiChatModelProvider({
  modelId: "gpt-3.5-turbo",
  // you can explicitly pass auth here, otherwise by default it is read from process.env
});

const response = await gpt.sendRequest({
  prompt: "Brief History of NY Mets:",
  temperature: 1.0,
  // all other OpenAI Chat Completion options are available here
});

console.log(response.choices[0]?.message); // the response has been runtime validated within a typeguard, so this is also typesafe
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
| `@generative-ts/core`        | Core functionality (zero dependencies)                      | Interfaces, classes, utilities, etc                                                                                           |
| `@generative-ts/providers`   | All Model Providers                    | All `ModelProvider` implementations that aren't in their own packages. Most providers don't require any special dependencies so are here                         |
| `@generative-ts/provider-bedrock` | AWS Bedrock provider                    | This is its own package because it uses the `aws4` dependency to properly authenticate when running in AWS environments        |
| `@generative-ts/apis`        | Model APIs                             | `ModelAPI` implementations. These use some internal dependencies (like `ejs` for templating) which arent strictly necessary because you can implement your own (see docs of `ModelAPI` for full details -- **TODO**) |


## Contributing

We welcome contributions! To get started developing, clone the repository and run:

```sh
nvm use
npm install
```

From there you can run the examples (`npm run example`) or the "e2e tests" in `tests/`

## Report Bugs / Submit Feature Requests

Encountered a bug or have a feature request? Please submit issues here: https://github.com/Econify/generative-ts/issues

## License

**TODO**: License details will be added here.

## Package publishing and ownership

Both the "main" `generative-ts` package and the scoped `@generative-ts` packages are controlled by the generative-ts npm organization. Currently the 'developer' team in the org only has read permissions. The only way the packages can be published is via ci/cd.

Releases are published via circleci job upon pushes to branches that have a name starting with `release/`. The job requires an NPM token that has publishing permissions to both `generative-ts` and `@generative-ts`. Currently this is a "granular" token set to expire every 30 days, created by @jnaglick, set in a circleci context.
