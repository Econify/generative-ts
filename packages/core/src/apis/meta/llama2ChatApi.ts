import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

import type { FewShotRequestOptions } from "../shared";

import { isLlamaResponse, LlamaResponse } from "./llama";

export const Llama2ChatMlTemplateSource = `<s>[INST] <% if (typeof system !== 'undefined') { %><<SYS>>\\n<%= system %>\\n<</SYS>>\\n\\n<% } %><% (typeof examplePairs !== 'undefined' ? examplePairs : []).forEach(pair => { %><%= pair.user %> [/INST] <%= pair.assistant %> </s><s>[INST] <% }) %><%= prompt %> [/INST]`;

const templateSource = `{
  "prompt": "${Llama2ChatMlTemplateSource}"
  <% if (typeof temperature !== 'undefined') { %>, "temperature": <%= temperature %><% } %>
  <% if (typeof top_p !== 'undefined') { %>, "top_p": <%= top_p %><% } %>
  <% if (typeof max_gen_len !== 'undefined') { %>, "max_gen_len": <%= max_gen_len %><% } %>
}`;

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
export const Llama2ChatTemplate = new EjsTemplate<Llama2ChatOptions>(
  templateSource,
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
