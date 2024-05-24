import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../typeDefs";

import { Template } from "../utils/template";

// TODO LLama2 ChatML!

const templateSource = `{
  "prompt": "<%= prompt %>"
  <% if (typeof max_tokens !== 'undefined') { %>, "max_tokens": <%= max_tokens %><% } %>
  <% if (typeof stop !== 'undefined') { %>, "stop": [<%= stop.join(', ') %>]<% } %>
  <% if (typeof temperature !== 'undefined') { %>, "temperature": <%= temperature %><% } %>
  <% if (typeof top_p !== 'undefined') { %>, "top_p": <%= top_p %><% } %>
  <% if (typeof top_k !== 'undefined') { %>, "top_k": <%= top_k %><% } %>  
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
