import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../../typeDefs";

import { Template } from "../../utils/template";

import type { FewShotRequestOptions } from "../_shared_interfaces/fewShot";

const templateSource = `{
  "model": "{{ modelId }}",
  "messages": [
    {% if system %}
    {
      "role": "system",
      "content": "{{ system | safe }}"
    },
    {% endif %}
    {% for pair in examplePairs %}
    {
      "role": "user",
      "content": "{{ pair.user | safe }}"
    },
    {
      "role": "assistant",
      "content": "{{ pair.assistant | safe }}"
    },
    {% endfor %}
    {% for message in messages %}
    {
      "role": "{{ message.role }}",
      "content": "{{ message.content | safe }}"
    },
    {% endfor %}
    {
      "role": "user",
      "content": "{{ prompt | safe }}"
    }
  ]
  {% if temperature %}, "temperature": {{ temperature }}{% endif %}
  {% if max_tokens %}, "max_tokens": {{ max_tokens }}{% endif %}
  {% if frequency_penalty %}, "frequency_penalty": {{ frequency_penalty }}{% endif %}
  {% if logit_bias %}, "logit_bias": {{ logit_bias | to_json }}{% endif %}
  {% if logprobs %}, "logprobs": true{% endif %}
  {% if top_logprobs %}, "top_logprobs": {{ top_logprobs }}{% endif %}
  {% if n %}, "n": {{ n }}{% endif %}
  {% if presence_penalty %}, "presence_penalty": {{ presence_penalty }}{% endif %}
  {% if response_format %}, "response_format": {{ response_format | to_json }}{% endif %}
  {% if seed %}, "seed": {{ seed }}{% endif %}
  {% if stop %}, "stop": {{ stop | to_json }}{% endif %}
  {% if top_p %}, "top_p": {{ top_p }}{% endif %}
  {% if tools %}, "tools": {{ tools | to_json }}{% endif %}
  {% if tool_choice %}, "tool_choice": {{ tool_choice | to_json }}{% endif %}
  {% if user %}, "user": "{{ user }}{% endif %}
}`;

export interface OpenAiChatOptions
  extends ModelRequestOptions,
    FewShotRequestOptions {
  messages?: {
    role: "user" | "assistant" | "system";
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  logprobs?: boolean;
  top_logprobs?: number;
  n?: number;
  presence_penalty?: number;
  response_format?: {
    type: "text" | "json_object";
  };
  seed?: number;
  stop?: string | string[];
  // stream
  // stream_options
  top_p?: number;
  tools?: {
    type: "function";
    function: {
      name: string;
      description?: string;
      parameters?: object; // TODO: JsonSchema
    };
  }[];
  tool_choice?:
    | "none"
    | "auto"
    | "required"
    | {
        type: "function";
        function: {
          name: string;
        };
      };
  user?: string;
  // function_call
  // functions
}

export const OpenAiChatTemplate = new Template<OpenAiChatOptions>(
  templateSource,
);

const OpenAiChatResponseCodec = t.type({
  id: t.string,
  object: t.string,
  created: t.number,
  model: t.string,
  choices: t.array(
    t.type({
      index: t.number,
      finish_reason: t.string,
      message: t.type({
        role: t.string,
        content: t.string,
        // tool_calls
        // function_call
      }),
      // logprobs: t.type({
      //   content: t.array(
      //     t.type({
      //       token: t.string,
      //       logprob: t.number,
      //       // bytes
      //       // top_logprobs
      //     }),
      //   ),
      // }),
    }),
  ),
  usage: t.type({
    prompt_tokens: t.number,
    completion_tokens: t.number,
    total_tokens: t.number,
  }),
  // system_fingerprint: t.string,
});

export type OpenAiChatResponse = TypeOf<typeof OpenAiChatResponseCodec>;

export function isOpenAiChatResponse(
  response: unknown,
): response is OpenAiChatResponse {
  return !isLeft(OpenAiChatResponseCodec.decode(response));
}

export const OpenAiChatApi: ModelApi<OpenAiChatOptions, OpenAiChatResponse> = {
  requestTemplate: OpenAiChatTemplate,
  responseGuard: isOpenAiChatResponse,
};