import type { ModelApi, ModelRequestOptions } from "../../typeDefs";

import { Template } from "../../utils/template";

import type { FewShotRequestOptions } from "../_shared_interfaces/fewShot";

import { isLlamaResponse, LlamaResponse } from "./llama";

const llama2ChatMlTemplateSrc = `<s>[INST] <% if (typeof system !== 'undefined') { %><<SYS>>\\n<%= system %>\\n<</SYS>>\\n\\n<% } %><% (typeof examplePairs !== 'undefined' ? examplePairs : []).forEach(pair => { %><%= pair.user %> [/INST] <%= pair.assistant %> </s><s>[INST] <% }) %><%= prompt %> [/INST]`;

const templateSource = `{
  "prompt": "${llama2ChatMlTemplateSrc}"
  <% if (typeof temperature !== 'undefined') { %>, "temperature": <%= temperature %><% } %>
  <% if (typeof top_p !== 'undefined') { %>, "top_p": <%= top_p %><% } %>
  <% if (typeof max_gen_len !== 'undefined') { %>, "max_gen_len": <%= max_gen_len %><% } %>
}`;

export interface Llama2ChatOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {
  temperature?: number;
  top_p?: number;
  max_gen_len?: number;
}

export const Llama2Template = new Template<Llama2ChatOptions>(templateSource);

export const Llama2ChatApi: ModelApi<Llama2ChatOptions, LlamaResponse> = {
  requestTemplate: Llama2Template,
  responseGuard: isLlamaResponse,
};
