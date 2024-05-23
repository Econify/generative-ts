import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../../typeDefs";
import { Template } from "../../utils/template";

const templateSource = `{
  "inputs": "{{ prompt | safe }}"
  {% if parameters %}
  , "parameters": {
    {% set comma = false %}
    {% if parameters.top_k %}"top_k": {{ parameters.top_k }}{% set comma = true %}{% endif %}
    {% if parameters.top_p %}{% if comma %}, {% endif %}"top_p": {{ parameters.top_p }}{% set comma = true %}{% endif %}
    {% if parameters.temperature %}{% if comma %}, {% endif %}"temperature": {{ parameters.temperature }}{% set comma = true %}{% endif %}
    {% if parameters.repetition_penalty %}{% if comma %}, {% endif %}"repetition_penalty": {{ parameters.repetition_penalty }}{% set comma = true %}{% endif %}
    {% if parameters.max_new_tokens %}{% if comma %}, {% endif %}"max_new_tokens": {{ parameters.max_new_tokens }}{% set comma = true %}{% endif %}
    {% if parameters.max_time %}{% if comma %}, {% endif %}"max_time": {{ parameters.max_time }}{% set comma = true %}{% endif %}
    {% if parameters.return_full_text %}{% if comma %}, {% endif %}"return_full_text": {{ parameters.return_full_text }}{% set comma = true %}{% endif %}
    {% if parameters.num_return_sequences %}{% if comma %}, {% endif %}"num_return_sequences": {{ parameters.num_return_sequences }}{% set comma = true %}{% endif %}
    {% if parameters.do_sample %}{% if comma %}, {% endif %}"do_sample": {{ parameters.do_sample }}{% endif %}
  }
  {% endif %}
  {% if options %}
  , "options": {
    {% set comma = false %}
    {% if options.use_cache %}"use_cache": {{ options.use_cache }}{% set comma = true %}{% endif %}
    {% if options.wait_for_model %}{% if comma %}, {% endif %}"wait_for_model": {{ options.wait_for_model }}{% endif %}
  }
  {% endif %}
}`;

export interface HuggingfaceTextGenerationOptions extends ModelRequestOptions {
  parameters?: {
    top_k?: number;
    top_p?: number;
    temperature?: number;
    repetition_penalty?: number;
    max_new_tokens?: number;
    max_time?: number;
    return_full_text?: boolean;
    num_return_sequences?: number;
    do_sample?: boolean;
  };
  options?: {
    use_cache?: boolean;
    wait_for_model?: boolean;
  };
}

export const HuggingfaceTextGenerationTemplate =
  new Template<HuggingfaceTextGenerationOptions>(templateSource);

const HuggingfaceTextGenerationResponseCodec = t.array(
  t.type({
    generated_text: t.string,
  }),
);

export type HuggingfaceTextGenerationResponse = TypeOf<
  typeof HuggingfaceTextGenerationResponseCodec
>;

export function isHuggingfaceTextGenerationResponse(
  response: unknown,
): response is HuggingfaceTextGenerationResponse {
  return !isLeft(HuggingfaceTextGenerationResponseCodec.decode(response));
}

export const HuggingfaceTextGenerationApi: ModelApi<
  HuggingfaceTextGenerationOptions,
  HuggingfaceTextGenerationResponse
> = {
  requestTemplate: HuggingfaceTextGenerationTemplate,
  responseGuard: isHuggingfaceTextGenerationResponse,
};
