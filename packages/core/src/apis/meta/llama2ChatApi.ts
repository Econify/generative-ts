import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

import type { FewShotRequestOptions } from "../_shared_interfaces/fewShot";

import { isLlamaResponse, LlamaResponse } from "./llama";

export const Llama2ChatMlTemplateSource = `<s>[INST] <% if (typeof system !== 'undefined') { %><<SYS>>\\n<%= system %>\\n<</SYS>>\\n\\n<% } %><% (typeof examplePairs !== 'undefined' ? examplePairs : []).forEach(pair => { %><%= pair.user %> [/INST] <%= pair.assistant %> </s><s>[INST] <% }) %><%= prompt %> [/INST]`;

const templateSource = `{
  "prompt": "${Llama2ChatMlTemplateSource}"
  <% if (typeof temperature !== 'undefined') { %>, "temperature": <%= temperature %><% } %>
  <% if (typeof top_p !== 'undefined') { %>, "top_p": <%= top_p %><% } %>
  <% if (typeof max_gen_len !== 'undefined') { %>, "max_gen_len": <%= max_gen_len %><% } %>
}`;

/**
 * @category Llama2
 * @category Requests
 */
export interface Llama2ChatOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {
  temperature?: number;
  top_p?: number;
  max_gen_len?: number;
}

/**
 * @category Llama2
 * @category Templates
 */
export const Llama2ChatTemplate = new EjsTemplate<Llama2ChatOptions>(
  templateSource,
);

/**
 *
 * ## Reference
 * [LLama2](https://llama.meta.com/docs/model-cards-and-prompt-formats/meta-llama-2/)
 *
 * ## Providers using this API
 * - {@link createAwsBedrockModelProvider | AWS Bedrock}
 *
 * @category Llama2
 * @category APIs
 */
export const Llama2ChatApi: ModelApi<Llama2ChatOptions, LlamaResponse> = {
  requestTemplate: Llama2ChatTemplate,
  responseGuard: isLlamaResponse,
};
