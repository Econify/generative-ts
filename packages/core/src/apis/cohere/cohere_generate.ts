import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../../typeDefs";

import { Template } from "../../utils/template";

const templateSource = `{
  "prompt": "{{ prompt | safe }}"
  {% if temperature %}
    , "temperature": {{ temperature }}
  {% endif %}
  {% if p %}
    , "p": {{ p }}
  {% endif %}
  {% if k %}
    , "k": {{ k }}
  {% endif %}
  {% if max_tokens %}
    , "max_tokens": {{ max_tokens }}
  {% endif %}
  {% if stop_sequences %}
    , "stop_sequences": [{{ stop_sequences | join(', ') }}]
  {% endif %}
  {% if return_likelihoods %}
    , "return_likelihoods": "{{ return_likelihoods }}"
  {% endif %}
  {% if stream %}
    , "stream": {{ stream }}
  {% endif %}
  {% if num_generations %}
    , "num_generations": {{ num_generations }}
  {% endif %}
  {% if logit_bias %}
    , "logit_bias": {{ logit_bias | dump | safe }}
  {% endif %}
  {% if truncate %}
    , "truncate": "{{ truncate }}"
  {% endif %}
}`;

export interface CohereGenerateOptions extends ModelRequestOptions {
  num_generations?: number;
  stream?: boolean;
  max_tokens?: number;
  truncate?: "NONE" | "START" | "END";
  temperature?: number;
  // seed ?
  // preset ?
  // end_sequences ?
  stop_sequences?: string[];
  k?: number;
  p?: number;
  // frequency_penalty ?
  // presence_penalty ?
  return_likelihoods?: "GENERATION" | "ALL" | "NONE";
  logit_bias?: { [token_id: number]: number }; // on bedrock but not cohere /generate?
}

export const CohereGenerateTemplate = new Template<CohereGenerateOptions>(
  templateSource,
);

const CohereGenerateResponseCodec = t.type({
  id: t.string,
  prompt: t.string,
  generations: t.array(
    t.type({
      id: t.string,
      text: t.string,
      finish_reason: t.string, // COMPLETE | MAX_TOKENS | ERROR | ERROR_TOXIC
      // index ?
      // likelihood ?
      // token_likelihoods ?
    }),
  ),
});

export type CohereGenerateResponse = TypeOf<typeof CohereGenerateResponseCodec>;

export function isCohereGenerateResponse(
  response: unknown,
): response is CohereGenerateResponse {
  return !isLeft(CohereGenerateResponseCodec.decode(response));
}

export const CohereGenerateApi: ModelApi<
  CohereGenerateOptions,
  CohereGenerateResponse
> = {
  requestTemplate: CohereGenerateTemplate,
  responseGuard: isCohereGenerateResponse,
};
