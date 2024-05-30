# generative-ts

**a typescript utility library for building LLM applications+agents for node and the browser**

generative-ts is an unopinionated, web-first utility library for LLM applications. Its core functionality revolves around providing a type-safe interface for interacting with a wide variety of LLM providers using their "native" APIs. It's *not* a heavy abstraction or wrapper around a bunch of existing SDKs. It *is* tiny, portable, and comes with some useful extra features.

## Features

- **Simple**: Provides support for many different [model providers](#model-providers), giving typesafe interfaces to the APIs as they're already defined
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

generative-ts separates the "Model API" (the request and response interfaces wrapping the model) from the "Model Provider" (the service providing access to the model). This separation accommodates the many quirks of LLM hosting services. For instance, many services (such as LMStudio) rely on llama.cpp, which uses a subset of the OpenAI-ChatCompletion API for all models. Meanwhile, a single model may have different APIs depending on its hosting platform. For example, Mistral uses the Mistral-ChatCompletion API when hosted by Mistral, but it uses the LLama2 Chat API on AWS Bedrock. There are many other unique examples.

generative-ts provides `ModelApi` **TODO LINK** and `ModelProvider` **TODO LINK** to represent these concepts. Some `ModelProvider`s only use a single `ModelApi` (e.g., OpenAI always uses its own OpenAI API) while other `ModelProvider`s can use many different `ModelApi`s (e.g., AWS Bedrock uses a different API depending on which model you use). Factory functions **TODO LINK** for creating `ModelProviders` expose an `api` parameter when the API is not determined by the provider.


### Model Providers

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

### Model APIs

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

It's also easy to add your own by using either the `BaseModelProvider` or `HttpModelProvider` class **TODO LINK**

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
