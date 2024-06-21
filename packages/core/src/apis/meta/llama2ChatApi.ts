/* eslint-disable camelcase */
import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

import type { FewShotRequestOptions } from "../shared";

import { isLlamaResponse, LlamaResponse } from "./llama";

/**
 * @category Requests
 * @category Llama2
 */
export interface Llama2ChatOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {
  temperature?: number;
  top_p?: number;
  max_gen_len?: number;
}

/**
 * @category Templates
 * @category Llama2
 *
 */
export const Llama2ChatTemplate = new FnTemplate(
  ({
    $prompt,
    system,
    examplePairs,
    temperature,
    top_p,
    max_gen_len,
  }: Llama2ChatOptions) => {
    const rewritten = {
      prompt: [
        `<s>[INST] `,
        ...(system ? [`<<SYS>>\n${system}\n<</SYS>>\n\n`] : []),
        ...(examplePairs
          ? examplePairs.flatMap((pair) => [
              `${pair.user} [/INST] ${pair.assistant} </s><s>[INST] `,
            ])
          : []),
        `${$prompt} [/INST]`,
      ].join(""),
    };

    const result = {
      ...rewritten,
      temperature,
      top_p,
      max_gen_len,
    };

    return JSON.stringify(result, null, 2);
  },
);

export interface Llama2ChatApi
  extends ModelApi<Llama2ChatOptions, LlamaResponse> {}

/**
 *
 * ## Reference
 * [LLama2](https://llama.meta.com/docs/model-cards-and-prompt-formats/meta-llama-2/)
 *
 * ## Providers using this API
 * - {@link createAwsBedrockModelProvider | AWS Bedrock}
 *
 * @category APIs
 * @category Llama2
 * @category Provider: AWS Bedrock
 *
 */
export const Llama2ChatApi: Llama2ChatApi = {
  requestTemplate: Llama2ChatTemplate,
  responseGuard: isLlamaResponse,
};
