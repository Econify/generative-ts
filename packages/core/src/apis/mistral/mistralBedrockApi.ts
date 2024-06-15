/* eslint-disable camelcase */
import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

import type { FewShotRequestOptions } from "../shared";

/**
 * @category Requests
 * @category Mistral Bedrock
 */
export interface MistralBedrockOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {
  max_tokens?: number;
  stop?: string[];
  temperature?: number;
  top_p?: number;
  top_k?: number;
}

/**
 * @category Templates
 * @category Mistral Bedrock
 */
export const MistralBedrockTemplate = new FnTemplate(
  ({
    prompt,
    system,
    examplePairs,
    max_tokens,
    stop,
    temperature,
    top_p,
    top_k,
  }: MistralBedrockOptions) => {
    // LLama2 Chat ML (https://llama.meta.com/docs/model-cards-and-prompt-formats/meta-llama-2)
    const llama2chatFomat = [
      "<s>[INST] ",
      ...(system ? [`<<SYS>>\n${system}\n<</SYS>>\n\n`] : []),
      ...(examplePairs
        ? examplePairs.flatMap((pair) => [
            `${pair.user} [/INST] ${pair.assistant} </s><s>[INST] `,
          ])
        : []),
      `${prompt} [/INST]`,
    ].join("");

    const rewritten = {
      prompt: llama2chatFomat,
    };

    return JSON.stringify(
      {
        ...rewritten,
        max_tokens,
        stop,
        temperature,
        top_p,
        top_k,
      },
      null,
      2,
    );
  },
);

const MistralBedrockResponseCodec = t.type({
  outputs: t.array(
    t.type({
      text: t.string,
      stop_reason: t.string,
    }),
  ),
});

/**
 * @category Responses
 * @category Mistral Bedrock
 */
export interface MistralBedrockResponse
  extends TypeOf<typeof MistralBedrockResponseCodec> {}

export function isMistralBedrockResponse(
  response: unknown,
): response is MistralBedrockResponse {
  return !isLeft(MistralBedrockResponseCodec.decode(response));
}

export interface MistralBedrockApi
  extends ModelApi<MistralBedrockOptions, MistralBedrockResponse> {}

/**
 *
 * ## Reference
 * [Mistral on AWS Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-mistral.html)
 *
 * ## Providers using this API
 * - {@link createAwsBedrockModelProvider | AWS Bedrock}
 *
 * @category APIs
 * @category Mistral Bedrock
 * @category Provider: AWS Bedrock
 *
 */
export const MistralBedrockApi: MistralBedrockApi = {
  requestTemplate: MistralBedrockTemplate,
  responseGuard: isMistralBedrockResponse,
};
