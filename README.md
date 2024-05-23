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

## Package publishing and ownership.

Both the "main" `generative-ts` package and the scoped `@generative-ts` packages are controlled by the generative-ts npm organization and require either 2FA or a granular access token for publishing. Currently the 'developer' team in the org only has read permissions to these packages, so that the only way they can be published is via ci/cd (as described below).

Releases are published via circleci upon pushes to branches that have a name starting with `release/`. The job expects a circleci env variable called GENERATIVE_TS_NPM_TOKEN containing an NPM token that has publishing permissioned to both `generative-ts` and `@generative-ts`. Currently this is a "granular" token set to expire every 30 days, created by @jnaglick. In the future, members of the generative-ts npm organization will be able to create this token, if they are on a team that has read+write permissions to the packages.
