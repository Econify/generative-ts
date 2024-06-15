/* eslint-disable camelcase */
import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

import type { FewShotRequestOptions } from "../shared";

import { isLlamaResponse, LlamaResponse } from "./llama";

/**
 * @category Requests
 * @category Llama3
 */
export interface Llama3ChatOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {
  temperature?: number;
  top_p?: number;
  max_gen_len?: number;
}

/**
 * @category Templates
 * @category Llama3
 */
export const Llama3ChatTemplate = new FnTemplate(
  ({
    prompt,
    system,
    examplePairs,
    temperature,
    top_p,
    max_gen_len,
  }: Llama3ChatOptions) => {
    const rewrittenPrompt = [
      ...(system
        ? [`<|start_header_id|>system<|end_header_id|>\n\n${system}<|eot_id|>`]
        : []),
      ...(examplePairs
        ? examplePairs.flatMap((pair) => [
            `<|start_header_id|>user<|end_header_id|>\n\n${pair.user}<|eot_id|>`,
            `<|start_header_id|>assistant<|end_header_id|>\n\n${pair.assistant}<|eot_id|>`,
          ])
        : []),
      `<|start_header_id|>user<|end_header_id|>\n\n${prompt}<|eot_id|>`,
      `<|start_header_id|>assistant<|end_header_id|>`,
    ].join("");

    const rewritten = {
      prompt: `<|begin_of_text|>${rewrittenPrompt}`,
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

export interface Llama3ChatApi
  extends ModelApi<Llama3ChatOptions, LlamaResponse> {}

/**
 *
 * ## Reference
 * [LLama3](https://llama.meta.com/docs/model-cards-and-prompt-formats/meta-llama-3)
 *
 * ## Providers using this API
 * - {@link createAwsBedrockModelProvider | AWS Bedrock}
 *
 * @category APIs
 * @category Llama3
 * @category Provider: AWS Bedrock
 *
 */
export const Llama3ChatApi: Llama3ChatApi = {
  requestTemplate: Llama3ChatTemplate,
  responseGuard: isLlamaResponse,
};
