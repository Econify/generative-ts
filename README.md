# generative-ts

**a typescript library for building LLM applications+agents**

[![Documentation](https://img.shields.io/badge/docs-generative--ts-blue)](https://econify.github.io/generative-ts/)

generative-ts is a web-first library for programming LLM applications. Its core feature is allowing you to easily use a wide variety of different [model providers](#model-providers) with minimal code and dependencies, while still exposing their native APIs so as to not get in your way. We provide some useful features on top of that for common applications like Chatbots, Tool Use, RAG, and Agents.

## Features

- **Simple**: *NOT* a heavy duty abstraction or framework. The library is easy to understand and model APIs are exposed 1:1.
- **Minimal**: *NOT* a wrapper of a bunch of different SDKs. It uses a small number of dependencies and also provide [scoped packages](#packages) for fine-grained installs.
- **Portable**: Can run in node or entirely in the browser
- **Just HTTP**: It uses native fetch out of the box, giving you universal control of timeout, retries, and proxies. You can also [inject your own HTTP client](#custom-http-client) as an alternative.
- **Versatile**: Provides utilities for things like Chatbots, Tool Use, RAG, and Agents (mostly coming in beta)

## Install

To install everything:

```sh
npm i generative-ts
```

You can also do more granular installs of scoped packages if you want to optimize your builds further (see [packages](#packages))

## Usage

### AWS Bedrock

**[API docs: `createAwsBedrockModelProvider` ](https://econify.github.io/generative-ts/functions/createAwsBedrockModelProvider.html)**

<!-- TEST [Bedrock] -->
```ts
import {
  AmazonTitanTextApi,
  createAwsBedrockModelProvider
} from "generative-ts";

// Bedrock supports many different APIs and models. See API docs (above) for full list.
const titanText = createAwsBedrockModelProvider({
  api: AmazonTitanTextApi,
  modelId: "amazon.titan-text-express-v1",
  // auth will be read from process.env and properly handled for the AWS environment on which the code is running
});

const response = await titanText.sendRequest({ 
  prompt: "Brief history of NY Mets:" 
  // all other options for the specified `api` available here
});

console.log(response.results[0]?.outputText);
```

### Cohere

**[API docs: `createCohereModelProvider` ](https://econify.github.io/generative-ts/functions/createCohereModelProvider.html)**

<!-- TEST [Cohere] -->
```ts
import { createCohereModelProvider } from "generative-ts";

const commandR = createCohereModelProvider({
  modelId: "command-r-plus", // Cohere defined model ID
  // you can explicitly pass auth here, otherwise by default it is read from process.env
});

const response = await commandR.sendRequest({
  prompt: "Brief History of NY Mets:",
  preamble: "Talk like Jafar from Aladdin",
  // all other Cohere /generate options available here
});

console.log(response.text);
```

### Groq

**[API docs: `createGroqModelProvider` ](https://econify.github.io/generative-ts/functions/createGroqModelProvider.html)**

<!-- TEST [Groq] -->
```ts
import { createGroqModelProvider } from "generative-ts";

const llama3 = createGroqModelProvider({
  modelId: "llama3-70b-8192", // Groq defined model ID
  // you can explicitly pass auth here, otherwise by default it is read from process.env
});

const response = await llama3.sendRequest({ 
  prompt: "Brief History of NY Mets:" 
  // all other OpenAI ChatCompletion options available here (Groq uses the OpenAI ChatCompletion API for all the models it hosts)
});

console.log(response.choices[0]?.message.content);
```

### Huggingface Inference

**[API docs: `createHuggingfaceInferenceModelProvider` ](https://econify.github.io/generative-ts/functions/createHuggingfaceInferenceModelProvider.html)**

<!-- TEST [Huggingface] -->
```ts
import { 
  createHuggingfaceInferenceModelProvider, 
  HfTextGenerationTaskApi 
} from "generative-ts";

// Huggingface Inference supports many different APIs and models. See API docs (above) for full list.
const gpt2 = createHuggingfaceInferenceModelProvider({
  api: HfTextGenerationTaskApi,
  modelId: "gpt2",
  // you can explicitly pass auth here, otherwise by default it is read from process.env
});

const response = await gpt2.sendRequest({ 
  prompt: "Hello," 
  // all other options for the specified `api` available here
});

console.log(response[0]?.generated_text);
```

### LMStudio

**[API docs: `createLmStudioModelProvider` ](https://econify.github.io/generative-ts/functions/createLmStudioModelProvider.html)**

<!-- TEST [LMStudio] -->
```ts
import { createLmStudioModelProvider } from "generative-ts";

const llama3 = createLmStudioModelProvider({
  modelId: "lmstudio-community/Meta-Llama-3-70B-Instruct-GGUF", // a ID of a model you have downloaded in LMStudio
});

const response = await llama3.sendRequest({ 
  prompt: "Brief History of NY Mets:" 
  // all other OpenAI ChatCompletion options available here (LMStudio uses the OpenAI ChatCompletion API for all the models it hosts)
});

console.log(response.choices[0]?.message.content);
```

### Mistral

**[API docs: `createMistralModelProvider` ](https://econify.github.io/generative-ts/functions/createMistralModelProvider.html)**

<!-- TEST [Mistral] -->
```ts
import { createMistralModelProvider } from "generative-ts";

const mistralLarge = createMistralModelProvider({
  modelId: "mistral-large-latest", // Mistral defined model ID
  // you can explicitly pass auth here, otherwise by default it is read from process.env
});

const response = await mistralLarge.sendRequest({ 
  prompt: "Brief History of NY Mets:" 
  // all other Mistral ChatCompletion API options available here
});

console.log(response.choices[0]?.message.content);
```

### OpenAI

**[API docs: `createOpenAiChatModelProvider` ](https://econify.github.io/generative-ts/functions/createOpenAiChatModelProvider.html)**

<!-- TEST [OpenAI] -->
```ts
import { createOpenAiChatModelProvider } from "generative-ts";

const gpt = createOpenAiChatModelProvider({
  modelId: "gpt-4-turbo", // OpenAI defined model ID
  // you can explicitly pass auth here, otherwise by default it is read from process.env
});

const response = await gpt.sendRequest({
  prompt: "Brief History of NY Mets:",
  max_tokens: 100,
  // all other OpenAI ChatCompletion options available here
});

console.log(response.choices[0]?.message.content);
```

### Custom HTTP Client

```ts
todo;
```

### Additional Examples

For more examples, please refer to the /examples folder in the repository.

## Supported Providers and Models

See [Usage](#usage) for how to use each provider.

|Provider|Models|Model APIs|
|-|-|-|
|AWS Bedrock|[Multiple hosted models](https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html#model-ids-arns)|[Native model APIs](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters.html)|
|Cohere|Command / Command R+|Cohere /generate and /chat|
|Groq|[Multiple hosted models](https://console.groq.com/docs/models)|OpenAI ChatCompletion|
|Huggingface Inference|Open-source|[Huggingface Inference APIs](https://huggingface.co/docs/api-inference/detailed_parameters)|
|LMStudio (localhost)|Open-source (must be downloaded)|OpenAI ChatCompletion|
|Mistral|Mistral x.y|Mistral ChatCompletion|
|OpenAI|GPT x.y|OpenAI ChatCompletion|
|Azure (coming soon)||
|Google Vertex AI (coming soon)||
|Replicate (coming soon)||
|Anthropic (coming soon)||
|Fireworks (coming soon)||

It's also easy to add your own **TODO LINK**

## Packages

If you're using a modern bundler, just install generative-ts to get everything. Modern bundlers support tree-shaking, so your final bundle won't include unused code. (Note: we distribute both ESM and CJS bundles for compatibility.) If you prefer to avoid unnecessary downloads, or you're operating under constraints where tree-shaking isn't an option, we offer scoped packages under @generative-ts/ with specific functionality for more fine-grained installs.

|Package|Description||
|-|-|-|
| `generative-ts`              | Everything                             | Includes all scoped packages listed below                                                                                                  |
| `@generative-ts/core`        | Core functionality (zero dependencies)                      | Interfaces, classes, utilities, etc                                                                                           |
| `@generative-ts/providers`   | All Model Providers                    | All `ModelProvider` implementations that aren't in their own packages. Most providers don't require any special dependencies so are here                         |
| `@generative-ts/provider-bedrock` | AWS Bedrock provider                    | This is its own package because it uses the `aws4` dependency to properly authenticate when running in AWS environments        |
| `@generative-ts/apis`        | Model APIs                             | `ModelAPI` implementations. These use some internal dependencies (like `ejs` for templating) which arent strictly necessary because you can implement your own (see docs of `ModelAPI` for full details -- **TODO**) |

## Report Bugs / Submit Feature Requests

Please submit all issues here: https://github.com/Econify/generative-ts/issues

## Contributing

To get started developing, optionally fork and then clone the repository and run:

```sh
nvm use
npm ci
```

To run examples and integration/e2e tests you'll need to create an .env file by running `cp .env.example .env` and then add values where necessary. This section needs a lot more work :)

## Publishing

The "main" `generative-ts` package and the scoped `@generative-ts` packages both are controlled by the generative-ts npm organization. Releases are published via circleci job upon pushes of tags that have a name starting with `release/`. The job requires an NPM token that has publishing permissions to both `generative-ts` and `@generative-ts`. Currently this is a "granular" token set to expire every 30 days, created by @jnaglick, set in a circleci context.

## License

**TODO**