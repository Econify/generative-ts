import type { ModelApi, ModelRequestOptions } from "../../typeDefs";

import { Template } from "../../utils/template";

import type { FewShotRequestOptions } from "../shared/fewShot";

import { isLlamaResponse, LlamaResponse } from "./llama";

const llama3ChatPrompt =
  "<|begin_of_text|>" +
  "{% if system %}<|start_header_id|>system<|end_header_id|>\\n\\n{{ system | safe }}<|eot_id|>{% endif %}" +
  "{% for pair in examplePairs %}<|start_header_id|>user<|end_header_id|>\\n\\n{{ pair.user | safe }}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\\n\\n{{ pair.assistant | safe }}<|eot_id|>{% endfor %}" +
  "<|start_header_id|>user<|end_header_id|>\\n\\n{{ prompt | safe }}<|eot_id|><|start_header_id|>assistant<|end_header_id|>";

export const templateSource =
  "{" +
  `"prompt": "${llama3ChatPrompt}"` +
  '{% if temperature %}, "temperature": {{ temperature }}{% endif %}' +
  '{% if top_p %}, "top_p": {{ top_p }}{% endif %}' +
  '{% if max_gen_len %}, "max_gen_len": {{ max_gen_len }}{% endif %}' +
  "}";

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
