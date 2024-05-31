import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

import type { FewShotRequestOptions } from "../_shared_interfaces/fewShot";

import { isLlamaResponse, LlamaResponse } from "./llama";

export const Llama3ChatMlTemplateSource = `<|begin_of_text|><% if (typeof system !== 'undefined') { %><|start_header_id|>system<|end_header_id|>\\n\\n<%= system %><|eot_id|><% } %><% (typeof examplePairs !== 'undefined' ? examplePairs : []).forEach(pair => { %><|start_header_id|>user<|end_header_id|>\\n\\n<%= pair.user %><|eot_id|><|start_header_id|>assistant<|end_header_id|>\\n\\n<%= pair.assistant %><|eot_id|><% }) %><|start_header_id|>user<|end_header_id|>\\n\\n<%= prompt %><|eot_id|><|start_header_id|>assistant<|end_header_id|>`;

const templateSource = `{
  "prompt": "${Llama3ChatMlTemplateSource}"
  <% if (typeof temperature !== 'undefined') { %>, "temperature": <%= temperature %><% } %>
  <% if (typeof top_p !== 'undefined') { %>, "top_p": <%= top_p %><% } %>
  <% if (typeof max_gen_len !== 'undefined') { %>, "max_gen_len": <%= max_gen_len %><% } %>
}`;

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
export const Llama3ChatTemplate = new EjsTemplate<Llama3ChatOptions>(
  templateSource,
);

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
export const Llama3ChatApi: ModelApi<Llama3ChatOptions, LlamaResponse> = {
  requestTemplate: Llama3ChatTemplate,
  responseGuard: isLlamaResponse,
};
