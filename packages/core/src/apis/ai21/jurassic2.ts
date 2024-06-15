import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

import { nullable } from "../_utils/ioTsHelpers";

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
  numResults?: number;
  maxTokens?: number;
  minTokens?: number;
  temperature?: number;
  topP?: number;
  topKReturn?: number;
  stopSequences?: string[];
  countPenalty?: PenaltyOptions;
  presencePenalty?: PenaltyOptions;
  frequencyPenalty?: PenaltyOptions;
}

/**
 * @category Ai21 Jurassic 2
 * @category Templates
 */
export const Ai21Jurassic2Template = new FnTemplate(
  ({
    prompt,
    numResults,
    maxTokens,
    minTokens,
    temperature,
    topP,
    topKReturn,
    stopSequences,
    countPenalty,
    presencePenalty,
    frequencyPenalty,
  }: Ai21Jurassic2Options) => {
    return JSON.stringify(
      {
        prompt,
        numResults,
        maxTokens,
        minTokens,
        temperature,
        topP,
        topKReturn,
        stopSequences,
        countPenalty,
        presencePenalty,
        frequencyPenalty,
      },
      null,
      2,
    );
  },
);

const Ai21Jurassic2ResponseCodec = t.type({
  id: t.number,
  prompt: t.type({
    text: t.string,
    tokens: t.array(
      t.type({
        generatedToken: t.type({
          token: t.string,
          logprob: t.number,
          raw_logprob: t.number,
        }),
        topTokens: nullable(
          t.union([
            t.string,
            t.array(
              t.type({
                token: t.string,
                logprob: t.number,
                raw_logprob: t.number,
              }),
            ),
          ]),
        ),
        textRange: t.type({
          start: t.number,
          end: t.number,
        }),
      }),
    ),
  }),
  completions: t.array(
    t.type({
      data: t.type({
        text: t.string,
        tokens: t.array(
          t.type({
            generatedToken: t.type({
              token: t.string,
              logprob: t.number,
              raw_logprob: t.number,
            }),
            topTokens: nullable(
              t.union([
                t.string,
                t.array(
                  t.type({
                    token: t.string,
                    logprob: t.number,
                    raw_logprob: t.number,
                  }),
                ),
              ]),
            ),
            textRange: t.type({
              start: t.number,
              end: t.number,
            }),
          }),
        ),
      }),
      finishReason: t.intersection([
        t.type({
          reason: t.string,
        }),
        t.partial({
          length: t.number,
        }),
      ]),
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

export interface Ai21Jurassic2Api
  extends ModelApi<Ai21Jurassic2Options, Ai21Jurassic2Response> {}

/**
 *
 * ## Reference
 * [Ai21 Jurrassic 2](https://docs.ai21.com/reference/j2-complete-ref)
 *
 * ## Providers using this API
 * - {@link createAwsBedrockModelProvider | AWS Bedrock}
 *
 * @category APIs
 * @category Ai21 Jurassic 2
 * @category Provider: AWS Bedrock
 *
 */
export const Ai21Jurassic2Api: Ai21Jurassic2Api = {
  requestTemplate: Ai21Jurassic2Template,
  responseGuard: isAi21Jurassic2Response,
};
