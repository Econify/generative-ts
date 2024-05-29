import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../typeDefs";

import { EjsTemplate } from "../utils/ejsTemplate";

const templateSource = `{
  "prompt": "<%= prompt %>"
  <% if (typeof temperature !== 'undefined') { %>
    , "temperature": <%= temperature %>
  <% } %>
  <% if (typeof topP !== 'undefined') { %>
    , "topP": <%= topP %>
  <% } %>
  <% if (typeof maxTokens !== 'undefined') { %>
    , "maxTokens": <%= maxTokens %>
  <% } %>
  <% if (typeof stopSequences !== 'undefined') { %>
    , "stopSequences": [<%= stopSequences.join(', ') %>]
  <% } %>
  <% if (typeof countPenalty !== 'undefined') { %>
    , "countPenalty": {
      "scale": <%= countPenalty.scale %>
      <% if (typeof countPenalty.applyToWhitespaces !== 'undefined') { %>
        , "applyToWhitespaces": <%= countPenalty.applyToWhitespaces %>
      <% } %>
      <% if (typeof countPenalty.applyToPunctuations !== 'undefined') { %>
        , "applyToPunctuations": <%= countPenalty.applyToPunctuations %>
      <% } %>
      <% if (typeof countPenalty.applyToNumbers !== 'undefined') { %>
        , "applyToNumbers": <%= countPenalty.applyToNumbers %>
      <% } %>
      <% if (typeof countPenalty.applyToStopwords !== 'undefined') { %>
        , "applyToStopwords": <%= countPenalty.applyToStopwords %>
      <% } %>
      <% if (typeof countPenalty.applyToEmojis !== 'undefined') { %>
        , "applyToEmojis": <%= countPenalty.applyToEmojis %>
      <% } %>
    }
  <% } %>
  <% if (typeof presencePenalty !== 'undefined') { %>
    , "presencePenalty": {
      "scale": <%= presencePenalty.scale %>
      <% if (typeof presencePenalty.applyToWhitespaces !== 'undefined') { %>
        , "applyToWhitespaces": <%= presencePenalty.applyToWhitespaces %>
      <% } %>
      <% if (typeof presencePenalty.applyToPunctuations !== 'undefined') { %>
        , "applyToPunctuations": <%= presencePenalty.applyToPunctuations %>
      <% } %>
      <% if (typeof presencePenalty.applyToNumbers !== 'undefined') { %>
        , "applyToNumbers": <%= presencePenalty.applyToNumbers %>
      <% } %>
      <% if (typeof presencePenalty.applyToStopwords !== 'undefined') { %>
        , "applyToStopwords": <%= presencePenalty.applyToStopwords %>
      <% } %>
      <% if (typeof presencePenalty.applyToEmojis !== 'undefined') { %>
        , "applyToEmojis": <%= presencePenalty.applyToEmojis %>
      <% } %>
    }
  <% } %>
  <% if (typeof frequencyPenalty !== 'undefined') { %>
    , "frequencyPenalty": {
      "scale": <%= frequencyPenalty.scale %>
      <% if (typeof frequencyPenalty.applyToWhitespaces !== 'undefined') { %>
        , "applyToWhitespaces": <%= frequencyPenalty.applyToWhitespaces %>
      <% } %>
      <% if (typeof frequencyPenalty.applyToPunctuations !== 'undefined') { %>
        , "applyToPunctuations": <%= frequencyPenalty.applyToPunctuations %>
      <% } %>
      <% if (typeof frequencyPenalty.applyToNumbers !== 'undefined') { %>
        , "applyToNumbers": <%= frequencyPenalty.applyToNumbers %>
      <% } %>
      <% if (typeof frequencyPenalty.applyToStopwords !== 'undefined') { %>
        , "applyToStopwords": <%= frequencyPenalty.applyToStopwords %>
      <% } %>
      <% if (typeof frequencyPenalty.applyToEmojis !== 'undefined') { %>
        , "applyToEmojis": <%= frequencyPenalty.applyToEmojis %>
      <% } %>
    }
  <% } %>
}`;

interface PenaltyOptions {
  scale: number;
  applyToWhitespaces?: boolean;
  applyToPunctuations?: boolean;
  applyToNumbers?: boolean;
  applyToStopwords?: boolean;
  applyToEmojis?: boolean;
}

/**
 * @category Ai21 Jurassic 2
 * @category Requests
 */
export interface Ai21Jurassic2Options extends ModelRequestOptions {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stopSequences?: string[];
  countPenalty?: PenaltyOptions;
  presencePenalty?: PenaltyOptions;
  frequencyPenalty?: PenaltyOptions;
}

/**
 * @category Ai21 Jurassic 2
 * @category Templates
 */
export const Ai21Jurassic2Template = new EjsTemplate<Ai21Jurassic2Options>(
  templateSource,
);

const Ai21Jurassic2ResponseCodec = t.type({
  id: t.number,
  // prompt: t.type({
  //   text: t.string,
  //   tokens: t.array(
  //     t.type({
  //       generatedToken: t.type({
  //         token: t.string,
  //         logprob: t.number,
  //         raw_logprob: t.number,
  //       }),
  //       topTokens: t.string,
  //       textRange: t.type({
  //         start: t.number,
  //         end: t.number,
  //       }),
  //     }),
  //   ),
  //   finishReason: t.type({
  //     reason: t.string,
  //     length: t.number,
  //   }),
  // }),
  completions: t.array(
    t.type({
      data: t.type({
        text: t.string,
        // tokens: t.array(
        //   t.type({
        //     generatedToken: t.type({
        //       token: t.string,
        //       logprob: t.number,
        //       raw_logprob: t.number,
        //     }),
        //     topTokens: t.string,
        //     textRange: t.type({
        //       start: t.number,
        //       end: t.number,
        //     }),
        //   }),
        // ),
      }),
      // finishReason: t.type({
      //   reason: t.string,
      //   length: t.number,
      // }),
    }),
  ),
});

/**
 * @category Ai21 Jurassic 2
 * @category Responses
 */
export interface Ai21Jurassic2Response
  extends TypeOf<typeof Ai21Jurassic2ResponseCodec> {}

export function isAi21Jurassic2Response(
  response: unknown,
): response is Ai21Jurassic2Response {
  return !isLeft(Ai21Jurassic2ResponseCodec.decode(response));
}

/**
 * Ai21 Jurrassic 2 (https://docs.ai21.com/reference/j2-complete-api-ref)
 *
 * @category Ai21 Jurassic 2
 * @category APIs
 * @type {ModelApi<Ai21Jurassic2Options, Ai21Jurassic2Response>}
 */
export const Ai21Jurassic2Api: ModelApi<
  Ai21Jurassic2Options,
  Ai21Jurassic2Response
> = {
  requestTemplate: Ai21Jurassic2Template,
  responseGuard: isAi21Jurassic2Response,
};
