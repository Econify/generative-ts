import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../typeDefs";

import { Template } from "../utils/template";

const templateSource = `{
  "prompt": "{{ prompt | safe }}"
  {% if temperature %}
    , "temperature": {{ temperature }}
  {% endif %}
  {% if topP %}
    , "topP": {{ topP }}
  {% endif %}
  {% if maxTokens %}
    , "maxTokens": {{ maxTokens }}
  {% endif %}
  {% if stopSequences %}
    , "stopSequences": [{{ stopSequences | join(', ') | safe }}]
  {% endif %}
  {% if countPenalty %}
    , "countPenalty": {
      "scale": {{ countPenalty.scale }}
      {% if countPenalty.applyToWhitespaces %}
        , "applyToWhitespaces": {{ countPenalty.applyToWhitespaces }}
      {% endif %}
      {% if countPenalty.applyToPunctuations %}
        , "applyToPunctuations": {{ countPenalty.applyToPunctuations }}
      {% endif %}
      {% if countPenalty.applyToNumbers %}
        , "applyToNumbers": {{ countPenalty.applyToNumbers }}
      {% endif %}
      {% if countPenalty.applyToStopwords %}
        , "applyToStopwords": {{ countPenalty.applyToStopwords }}
      {% endif %}
      {% if countPenalty.applyToEmojis %}
        , "applyToEmojis": {{ countPenalty.applyToEmojis }}
      {% endif %}
    }
  {% endif %}
  {% if presencePenalty %}
    , "presencePenalty": {
      "scale": {{ presencePenalty.scale }}
      {% if presencePenalty.applyToWhitespaces %}
      , "applyToWhitespaces": {{ presencePenalty.applyToWhitespaces }}
      {% endif %}
      {% if presencePenalty.applyToPunctuations %}
        , "applyToPunctuations": {{ presencePenalty.applyToPunctuations }}
      {% endif %}
      {% if presencePenalty.applyToNumbers %}
        , "applyToNumbers": {{ presencePenalty.applyToNumbers }}
      {% endif %}
      {% if presencePenalty.applyToStopwords %}
        , "applyToStopwords": {{ presencePenalty.applyToStopwords }}
      {% endif %}
      {% if presencePenalty.applyToEmojis %}
        , "applyToEmojis": {{ presencePenalty.applyToEmojis }}
      {% endif %}
    }
  {% endif %}
  {% if frequencyPenalty %}
    , "frequencyPenalty": {
      "scale": {{ frequencyPenalty.scale }}
      {% if frequencyPenalty.applyToWhitespaces %}
      , "applyToWhitespaces": {{ frequencyPenalty.applyToWhitespaces }}
      {% endif %}
      {% if frequencyPenalty.applyToPunctuations %}
        , "applyToPunctuations": {{ frequencyPenalty.applyToPunctuations }}
      {% endif %}
      {% if frequencyPenalty.applyToNumbers %}
        , "applyToNumbers": {{ frequencyPenalty.applyToNumbers }}
      {% endif %}
      {% if frequencyPenalty.applyToStopwords %}
        , "applyToStopwords": {{ frequencyPenalty.applyToStopwords }}
      {% endif %}
      {% if frequencyPenalty.applyToEmojis %}
        , "applyToEmojis": {{ frequencyPenalty.applyToEmojis }}
      {% endif %}
    }
  {% endif %}
}`;

interface PenaltyOptions {
  scale: number;
  applyToWhitespaces?: boolean;
  applyToPunctuations?: boolean;
  applyToNumbers?: boolean;
  applyToStopwords?: boolean;
  applyToEmojis?: boolean;
}

export interface Ai21Jurassic2Options extends ModelRequestOptions {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stopSequences?: string[];
  countPenalty?: PenaltyOptions;
  presencePenalty?: PenaltyOptions;
  frequencyPenalty?: PenaltyOptions;
}

export const Ai21Jurassic2Template = new Template<Ai21Jurassic2Options>(
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

export type Ai21Jurassic2Response = TypeOf<typeof Ai21Jurassic2ResponseCodec>;

export function isAi21Jurassic2Response(
  response: unknown,
): response is Ai21Jurassic2Response {
  return !isLeft(Ai21Jurassic2ResponseCodec.decode(response));
}

export const Ai21Jurassic2Api: ModelApi<
  Ai21Jurassic2Options,
  Ai21Jurassic2Response
> = {
  requestTemplate: Ai21Jurassic2Template,
  responseGuard: isAi21Jurassic2Response,
};
