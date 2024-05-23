# Generative-TS

**Simple, type-safe, isomorphic LLM interactions.**

Generative-TS is a TypeScript library designed to simplify the process of developing applications powered by large language models (LLMs). This library makes it easy to interact with various LLMs and model providers, ensuring a smooth and efficient development experience.

## Features

- **Simple interface**: Easy to use and understand. TODO
- **Type safety**: Leverages TypeScript to provide type-safe interactions. TODO
- **Isomorphic**: Works seamlessly on both server and client sides.
- **Tiny bundle size**: Minimal footprint for optimal performance. TODO

## Install

```sh
npm install generative-ts
```

## Developing

```sh
nvm use
npm install
```

## How it Works

### APIs

Model APIs help you talk to different models easily without obsessing over the prompt template format, model configuration parameters, and response format. Generative-TS abstracts away these complexities, providing a unified interface for various LLMs.

Currently supported models:

- Cohere
- Llama 2
- Llama 3
- OpenAI
- Jurassic

### Providers

Model Providers help you interact with your models easily no matter where you host them. Generative-TS ensures seamless integration with different hosting environments, allowing you to focus on building your application rather than managing infrastructure.

Currently supported providers:

- Bedrock
- Groq
- LM Studio

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

## Contributing

We welcome contributions! Please check out the open Github Issues for a starting point.

## Submit Feature Request

Have a feature request? Please submit it here. TODO

## Report Bug

Encountered a bug? Report it here. TODO

## License

TODO: License details will be added here.

- right nows:
  // rollup
  // docs
  // relocate tests
  // specs: templates, factory funcs

- features:
  // rest client params (timeout, Proxy, what else?)
  // memoization in template
  // plugins
  // response tracking
  // utils that run on providers

- exploratory
  // ToolUse common interfaces?
  // do something about explicitly passing auth to awsProvider (param that controls it? Is that overcomplicating?)

- infra
  // try in browser
  // look @ bundle size; build strategies separating providers
