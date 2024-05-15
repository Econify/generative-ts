import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../typeDefs";

import { Template } from "../utils/template";

export const templateSource = `{
  "inputText": "{{ prompt | safe }}"
  {% if temperature or topP or maxTokenCount or stopSequences %}
  , "textGenerationConfig": {
    {% set comma = false %}
    {% if temperature %}
      "temperature": {{ temperature }}
      {% set comma = true %}
    {% endif %}
    {% if topP %}
      {% if comma %},{% endif %} "topP": {{ topP }}
      {% set comma = true %}
    {% endif %}
    {% if maxTokenCount %}
      {% if comma %},{% endif %} "maxTokenCount": {{ maxTokenCount }}
      {% set comma = true %}
    {% endif %}
    {% if stopSequences %}
      {% if comma %},{% endif %} "stopSequences": [{{ stopSequences | join(', ') }}]
    {% endif %}
  }
  {% endif %}
}`;

export interface AmazonTitanTextOptions extends ModelRequestOptions {
  temperature?: number; // float [0, 1.0]
  topP?: number; // float [1.00E-45, 1.0]
  maxTokenCount?: number; // int [0, 8000]
  stopSequences?: string[]; // must be one of: "|" | "User:"
}

export const AmazonTitanTextTemplate = new Template<AmazonTitanTextOptions>(
  templateSource,
);

const AmazonTitanTextResponseCodec = t.type({
  results: t.array(
    t.type({
      outputText: t.string,
      // TODO...
    }),
  ),
});

export type AmazonTitanTextResponse = TypeOf<
  typeof AmazonTitanTextResponseCodec
>;

export function isAmazonTitanTextResponse(
  response: unknown,
): response is AmazonTitanTextResponse {
  return !isLeft(AmazonTitanTextResponseCodec.decode(response));
}

export const AmazonTitanTextApi: ModelApi<
  AmazonTitanTextOptions,
  AmazonTitanTextResponse
> = {
  requestTemplate: AmazonTitanTextTemplate,
  responseGuard: isAmazonTitanTextResponse,
};
