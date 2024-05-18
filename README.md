# 🦧 generative.ts

generative.ts is a typescript first library for easily interfacing with LLMs.

* It provides typesafe interfaces for popular model APIs and service providers *as they're defined by the people who make them* -- It's **NOT** an attempt at a *universal* interface

* It gives you the lowest level of control (in most cases, HTTP) over model interactions. Control things you otherwise couldn't like timeouts, retries, and proxies -- It's **NOT** a wrapper around other existing SDKs or libraries. 

* It allows you to build a very tiny bundle and it's isomorphic. Drop it into any JS environment and it should start working -- It's **NOT** heavy

* A guiding design principle is that "Agent AI" is easiest to write using normal, imperative code. You don't have to learn a new way of making API calls -- It's **NOT** declarative or configuration based.

* It's a minimal but feature-rich utility library -- It's **NOT** a framework

* It gives sensible default implementations but also allows you fine grained control. You can easily define new model APIs and service providers. You can inject your own http client or template rendering function -- It's **NOT** opinionated

*generative.ts does the tedious stuff like type-checking and error-handling, allowing you to write the interesting stuff like RAG context grooming and new AI agents*

## Install

```
npm i generative-ts
```

## Examples

### Basic Usage

A good example of the use-case of generative.ts is comparing how it looks to use (1) gpt4 on openAI (2) llama3 on AWS bedrock (3) llama3 on groq

The reason this is a good example is because it highlights the diversity of the ecosystem. OpenAI provides both models and services. AWS Bedrock is only a service, and exposes the APIs of the models it hosts as-is. Whereas Groq is a service but puts all the models it hosts behind the OpenAI API. 

This mix-and-match of "APIs" and "Providers" is found throughout the ecosystem, so it's also the main pattern of generative-ts. It turns out that it allows for a lot of flexibility:

(**These are just 3 examples** -- see [TODO] for the complete list of supported models and providers, and see [TODO] for how to add your own)

#### GPT4 on OpenAI

```
import { createOpenAiChatModelProvider } from "generative-ts";

const gpt4 = createOpenAiChatModelProvider({
  modelId: "gpt-4-turbo", // the modelId as defined by openAI
});

const response = await gpt4.sendRequest({
  prompt: "Tell me the history of the NY Mets"

  // all OpenAI Chat Completion options are available here:
  temperature: 1.0,
  max_tokens: 1024,
})

console.log(response.choices[0]?.message.content) // the typesafe chat completion response
```

#### Llama3 on AWS Bedrock

```
import { 
  createAwsBedrockModelProvider,
  Llama3ChatApi,
} from "generative-ts";

const llama3 = createAwsBedrockModelProvider({
  api: Llama3ChatApi, // bedrock provides many different APIs
  modelId: "meta.llama3-8b-instruct-v1:0", // the modelId as defined by bedrock
});

const response = await llama3.sendRequest({
  prompt: "Tell me the history of the NY Mets",

  // all LLama3 Chat options are available here:
  temperature: 1.0,
  max_gen_len: 1024,
})

console.log(response.generation) // the typesafe llama3 chat response
```

#### Llama3 on Groq

```
import { createGroqModelProvider } from "generative-ts";

const llama3 = createGroqModelProvider({
  // no 'api' option is necessary. like OpenAI, everything on groq uses the openAI API.
  modelId: "llama3-70b-8192", // the modelId as defined by groq
});

const response = await llama3.sendRequest({
  prompt: "Tell me the history of the NY Mets"

  // all OpenAI Chat Completion options are available here:
  temperature: 1.0,
  max_tokens: 1024,
})

console.log(response.choices[0]?.message.content) // the typesafe chat completion response
```

### Etc...

