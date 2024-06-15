/* eslint-disable camelcase */
import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

import type { FewShotRequestOptions } from "../shared";

/**
 * @category Requests
 * @category Mistral ChatCompletion
 */
export interface MistralAiOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {
  messages?: {
    role: "user" | "assistant" | "system";
    content: string;
  }[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  safe_prompt?: boolean;
  random_seed?: number;
}

/**
 * @category Templates
 * @category Mistral ChatCompletion
 */
export const MistralAiTemplate = new FnTemplate(
  ({
    modelId,
    prompt,
    system,
    examplePairs,
    messages,
    temperature,
    top_p,
    max_tokens,
    stream,
    safe_prompt,
    random_seed,
  }: MistralAiOptions) => {
    const rewritten = {
      model: modelId,
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        ...(examplePairs
          ? examplePairs.flatMap((pair) => [
              { role: "user", content: pair.user },
              { role: "assistant", content: pair.assistant },
            ])
          : []),
        ...(messages
          ? messages.map((message) => ({
              role: message.role,
              content: message.content,
            }))
          : []),
        { role: "user", content: prompt },
      ],
    };

    const result = {
      ...rewritten,
      temperature,
      top_p,
      max_tokens,
      stream,
      safe_prompt,
      random_seed,
    };

    return JSON.stringify(result, null, 2);
  },
);

const MistralAiApiResponseCodec = t.type({
  id: t.string,
  object: t.string,
  created: t.number,
  model: t.string,
  choices: t.array(
    t.type({
      index: t.number,
      message: t.type({
        role: t.string,
        content: t.string,
      }),
      finish_reason: t.string,
    }),
  ),
  usage: t.type({
    prompt_tokens: t.number,
    completion_tokens: t.number,
    total_tokens: t.number,
  }),
});

/**
 * @category Responses
 * @category Mistral ChatCompletion
 */
export interface MistralAiResponse
  extends TypeOf<typeof MistralAiApiResponseCodec> {}

export function isMistralAiResponse(
  response: unknown,
): response is MistralAiResponse {
  return !isLeft(MistralAiApiResponseCodec.decode(response));
}

/**
 *
 * ## Reference
 * [Mistral AI Chat Completion](https://docs.mistral.ai/api/#operation/createChatCompletion)
 *
 * ## Providers using this API
 * - {@link createMistralModelProvider | Mistral}
 *
 * @category APIs
 * @category Mistral ChatCompletion
 * @category Provider: Mistral
 *
 */
export const MistralAiApi: ModelApi<MistralAiOptions, MistralAiResponse> = {
  requestTemplate: MistralAiTemplate,
  responseGuard: isMistralAiResponse,
};
