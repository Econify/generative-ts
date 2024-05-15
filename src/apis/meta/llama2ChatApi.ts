import type { ModelApi, ModelRequestOptions } from "../../typeDefs";

import { Template } from "../../utils/template";

import type { FewShotRequestOptions } from "../shared/fewShot";

import { isLlamaResponse, LlamaResponse } from "./llama";

const llama2ChatPrompt =
  "<s>[INST] " +
  `{% if system %}<<SYS>>\\n{{ system | safe }}\\n<</SYS>>\\n\\n{% endif %}` +
  "{% for pair in examplePairs %}{{ pair.user | safe }} [/INST] {{ pair.assistant | safe }} </s><s>[INST] {% endfor %}" +
  "{{ prompt | safe }} [/INST]";

export const templateSource =
  "{" +
  `"prompt": "${llama2ChatPrompt}"` +
  '{% if temperature %}, "temperature": {{ temperature }}{% endif %}' +
  '{% if top_p %}, "top_p": {{ top_p }}{% endif %}' +
  '{% if max_gen_len %}, "max_gen_len": {{ max_gen_len }}{% endif %}' +
  "}";

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
