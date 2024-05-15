import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../typeDefs";

import { Template } from "../utils/template";

export const templateSource = `{
  "prompt": "{{ prompt | safe }}"
  {% if max_tokens %}
    , "max_tokens": {{ max_tokens }}
  {% endif %}
  {% if stop %}
    , "stop": [{{ stop | join(', ') | safe }}]
  {% endif %}
  {% if temperature %}
    , "temperature": {{ temperature }}
  {% endif %}
  {% if top_p %}
    , "top_p": {{ top_p }}
  {% endif %}
  {% if top_k %}
    , "top_k": {{ top_k }}
  {% endif %}
}`;

export interface MistralOptions extends ModelRequestOptions {
  max_tokens?: number;
  stop?: string[];
  temperature?: number;
  top_p?: number;
  top_k?: number;
}

export const MistralTemplate = new Template<MistralOptions>(templateSource);

const MistralResponseCodec = t.type({
  outputs: t.array(
    t.type({
      text: t.string,
      stop_reason: t.string,
    }),
  ),
});

export type MistralResponse = TypeOf<typeof MistralResponseCodec>;

export function isMistralResponse(
  response: unknown,
): response is MistralResponse {
  return !isLeft(MistralResponseCodec.decode(response));
}

export const MistralApi: ModelApi<MistralOptions, MistralResponse> = {
  requestTemplate: MistralTemplate,
  responseGuard: isMistralResponse,
};
