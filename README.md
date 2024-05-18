# 🦧 generative.ts

generative.ts is a typescript first library for easily interfacing with LLMs.

* It's **NOT** an attempt at a *universal* interface

* It provides typesafe interfaces for popular model APIs and service providers *as they're defined by the people who make them*

* It's **NOT** a wrapper around other existing SDKs or libraries. 

* It gives you the lowest level of control (in most cases, HTTP) over model interactions. Control things you otherwise couldn't like timeouts, retries, and proxies. 

* It's **NOT** heavy

* It allows you to build a very tiny bundle and it's isomorphic. Drop it into any JS environment and it should start working. 

* It's **NOT** declarative or configuration based.

* A guiding design principle is that "Agent AI" is easiest to write using normal, imperative code. You don't have to learn a new way of making API calls.

* It's **NOT** a framework

* It's a minimal but feature-rich utility library. 

* It's **NOT** opinionated

* It gives sensible default implementations but also allows you fine grained control. You can easily define new model APIs and service providers. You can inject your own http client or template rendering function.

*generative.ts does the tedious stuff like type-checking and error-handling, allowing you to write the interesting stuff like RAG context grooming and new AI agents*

## Install

```
npm i generative-ts
```

## Examples

### Basic Usage

A good example of the use-case of generative.ts is comparing how it looks to use (1) gpt4 on openAI (2) llama3 on AWS bedrock (3) llama3 on groq

The reason this is a good example is because it highlights the diversity of the ecosystem. OpenAI provides both models and services. AWS Bedrock is only a service, and exposes the APIs of the models it hosts as-is. Whereas Groq is a service but puts all the models it hosts behind the OpenAI API!

This mix-and-match of "APIs" and "Providers" is found throughout the ecosystem, so it's also the main pattern of generative-ts. It turns out that it allows for a lot of flexibility:

```
import { 
  createAwsBedrockModelProvider, 
  createOpenAiChatModelProvider, 
  createGroqModelProvider,
  Llama3ChatApi,
} from "generative-ts";

const gpt4 = createOpenAiChatModelProvider({
  // no 'api' necessary, everything on openAI uses openAI
  modelId: "gpt-4-turbo", // the modelId as defined by openAI
});

const llama3aws = createAwsBedrockModelProvider({
  api: Llama3ChatApi, // since it's bedrock, specify what api to use
  modelId: "meta.llama3-8b-instruct-v1:0", // the modelId as defined by bedrock
});

const llama3groq = createGroqModelProvider({
  // no 'api' necessary, everything on groq uses openAI
  modelId: "llama3-70b-8192", // the modelId as defined by groq
});

// make requests. note: request options are type-safe and specific to the API being used!

const prompt = "Tell me the history of the NY Mets"
const temp = 1.0
const tokens = 1024

const gpt4response = await gpt4.sendRequest({
  prompt,

  // some openAI request options:
  temperature: temp,
  max_tokens: tokens,
})

const llama3awsResponse = await llama3aws.sendRequest({
  prompt,

  // some llama3 request options:
  temperature: temp,
  max_gen_len: tokens,
})

const llama3groqResponse = await llama3groq.sendRequest({
  prompt,

  // some openAI request options:
  temperature: temp,
  max_tokens: tokens,
})

// print responses. again, they're type-safe and specific to the API being used:

console.log("GPT-4-Turbo (OpenAI):", gpt4response.choices[0]?.message.content)
console.log("Llama3 (Bedrock):", llama3awsResponse.generation)
console.log("Llama3 (Groq):", llama3groqResponse.choices[0]?.message.content)
```

### Etc...