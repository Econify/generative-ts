import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../../typeDefs";
import { Template } from "../../utils/template";

const templateSource = `{
  "prompt": "<%= prompt %>"
  <% if (typeof temperature !== 'undefined') { %>, "temperature": <%= temperature %><% } %>
  <% if (typeof top_p !== 'undefined') { %>, "top_p": <%= top_p %><% } %>
  <% if (typeof max_gen_len !== 'undefined') { %>, "max_gen_len": <%= max_gen_len %><% } %>
}`;

export interface LlamaOptions extends ModelRequestOptions {
  temperature?: number;
  top_p?: number;
  max_gen_len?: number;
}

export const LlamaTemplate = new Template<LlamaOptions>(templateSource);

const LlamaResponseCodec = t.type({
  generation: t.string,
  prompt_token_count: t.number,
  generation_token_count: t.number,
  stop_reason: t.string,
});

export type LlamaResponse = TypeOf<typeof LlamaResponseCodec>;

export function isLlamaResponse(response: unknown): response is LlamaResponse {
  return !isLeft(LlamaResponseCodec.decode(response));
}

export const LlamaApi: ModelApi<LlamaOptions, LlamaResponse> = {
  requestTemplate: LlamaTemplate,
  responseGuard: isLlamaResponse,
};
