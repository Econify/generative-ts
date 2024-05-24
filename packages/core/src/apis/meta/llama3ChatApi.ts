import type { ModelApi, ModelRequestOptions } from "../../typeDefs";

import { Template } from "../../utils/template";

import type { FewShotRequestOptions } from "../_shared_interfaces/fewShot";

import { isLlamaResponse, LlamaResponse } from "./llama";

const llama3ChatMlTemplateSrc = `<|begin_of_text|><% if (typeof system !== 'undefined') { %><|start_header_id|>system<|end_header_id|>\\n\\n<%= system %><|eot_id|><% } %><% (typeof examplePairs !== 'undefined' ? examplePairs : []).forEach(pair => { %><|start_header_id|>user<|end_header_id|>\\n\\n<%= pair.user %><|eot_id|><|start_header_id|>assistant<|end_header_id|>\\n\\n<%= pair.assistant %><|eot_id|><% }) %><|start_header_id|>user<|end_header_id|>\\n\\n<%= prompt %><|eot_id|><|start_header_id|>assistant<|end_header_id|>`;

const templateSource = `{
  "prompt": "${llama3ChatMlTemplateSrc}"
  <% if (typeof temperature !== 'undefined') { %>, "temperature": <%= temperature %><% } %>
  <% if (typeof top_p !== 'undefined') { %>, "top_p": <%= top_p %><% } %>
  <% if (typeof max_gen_len !== 'undefined') { %>, "max_gen_len": <%= max_gen_len %><% } %>
}`;

export interface Llama3ChatOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {
  temperature?: number;
  top_p?: number;
  max_gen_len?: number;
}

export const Llama3Template = new Template<Llama3ChatOptions>(templateSource);

export const Llama3ChatApi: ModelApi<Llama3ChatOptions, LlamaResponse> = {
  requestTemplate: Llama3Template,
  responseGuard: isLlamaResponse,
};
