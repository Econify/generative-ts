# generative-ts

**a typescript utility library for building LLM applications+agents for node and the browser**

generative-ts seeks to be an unopinionated "web-first" utility library for LLM applications. Its core selling point is a simple interface for hitting a wide variety of LLM providers, providing type-safety (including runtime checking of responses) *without* hiding APIs under layers of abstraction. It uses native fetch (or lets you inject an http client) to give better control over the request than many SDKs allow, in addition to being tiny and portable. It also tries to provide some utility functions for common LLM use-cases... 

## Goals

- **Simple**: Provides support for [many different model providers](#supported-model-providers) out of the box, giving typesafe interfaces for the APIs as they're already defined
- **Minimal/Portable**: Runs in node or the browser, has tiny bundles and [scoped packages](#packages) for fine-grain installs 
- **Features**
  - Stuff
  - Goes
  - Here

## Install

To install everything:

```sh
npm i generative-ts
```

You can also do more granular installs of scoped packages if you want to optimize your builds further (see [packages](#packages))

## How it Works

**TODO** This should go in a guide/docs:

* A model isn't synonymous with its API or its hosting provider. There are many quirks like:
  * Services like Groq, LMStudio, LLamafile, and vLLM put many different open source models behind OpenAI's ChatCompletion spec
  * But if you're using a model hosted by its own creator (mistral on mistral, cohere on cohere, etc) you'll often get that provider's unique API
  * Some models (like LLama) arent hosted by their creators at all, and their APIs depend on where theyre hosted
  * Some models (like GPT3.5 and above) are only hosted by their creators, and their APIs never change
  * There are one-off situations to deal with, like mistral on AWS bedrock using llama2's chat prompt format
  * Providers like huggingface provide thousands of models behind a set of several different APIs

### Supported Model Providers

* AWS Bedrock
* Cohere
* Groq
* Huggingface Inference
* OpenAI
* Replicate (TODO!)
* Mistral (TODO!)
* LMStudio
* LLamafile (TODO!)
* vLLM (TODO!)
* Google Vertex AI (COMING SOON)
* Microsoft Azure (COMING SOON?)

### Supported Models APIs

* OpenAI ChatCompletion
* LLama2 Chat
* LLama3 Instruct
* Cohere Chat and Generate
* Mistral AI API ChatCompletion; Bedrock-specific Mistral API
* AI21 Jurrassic
* Amazon Titan Text
* Huggingface Inference Text Generation and Conversational tasks
* Antrophic: ? (COMING SOON)
* Google: Gemini (COMING SOON)

It's also easy to add your own (**TODO** link here)

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
