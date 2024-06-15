/* eslint-disable camelcase */
import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

/**
 * @category Requests
 * @category Cohere Generate
 */
export interface CohereGenerateOptions extends ModelRequestOptions {
  num_generations?: number;
  stream?: boolean;
  max_tokens?: number;
  truncate?: "NONE" | "START" | "END";
  temperature?: number;
  seed?: number;
  preset?: string;
  end_sequences?: string[];
  stop_sequences?: string[];
  k?: number;
  p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  return_likelihoods?: "GENERATION" | "ALL" | "NONE";
  logit_bias?: { [token_id: number]: number }; // on bedrock but not cohere /generate?
}

/**
 * @category Templates
 * @category Cohere Generate
 */
export const CohereGenerateTemplate = new FnTemplate(
  ({
    prompt,
    num_generations,
    stream,
    max_tokens,
    truncate,
    temperature,
    seed,
    preset,
    end_sequences,
    stop_sequences,
    k,
    p,
    frequency_penalty,
    presence_penalty,
    return_likelihoods,
    logit_bias,
  }: CohereGenerateOptions) => {
    return JSON.stringify(
      {
        prompt,
        num_generations,
        stream,
        max_tokens,
        truncate,
        temperature,
        seed,
        preset,
        end_sequences,
        stop_sequences,
        k,
        p,
        frequency_penalty,
        presence_penalty,
        return_likelihoods,
        logit_bias,
      },
      null,
      2,
    );
  },
);

const CohereGenerateResponseCodec = t.intersection([
  t.type({
    id: t.string,
    prompt: t.string,
    generations: t.array(
      t.type({
        id: t.string,
        text: t.string,
        finish_reason: t.string,
      }),
    ),
  }),
  t.partial({
    meta: t.type({
      api_version: t.type({
        version: t.string,
      }),
      billed_units: t.type({
        input_tokens: t.number,
        output_tokens: t.number,
      }),
    }),
  }),
]);

/**
 * @category Responses
 * @category Cohere Generate
 */
export interface CohereGenerateResponse
  extends TypeOf<typeof CohereGenerateResponseCodec> {}

export function isCohereGenerateResponse(
  response: unknown,
): response is CohereGenerateResponse {
  return !isLeft(CohereGenerateResponseCodec.decode(response));
}

export interface CohereGenerateApi
  extends ModelApi<CohereGenerateOptions, CohereGenerateResponse> {}

/**
 *
 * ## Reference
 * [Cohere Generate](https://docs.cohere.com/reference/generate)
 *
 * ## Providers using this API
 * - {@link createCohereModelProvider | Cohere}
 * - {@link createAwsBedrockModelProvider | AWS Bedrock}
 *
 * @category APIs
 * @category Cohere Generate
 * @category Provider: AWS Bedrock
 * @category Provider: Cohere
 *
 */
export const CohereGenerateApi: CohereGenerateApi = {
  requestTemplate: CohereGenerateTemplate,
  responseGuard: isCohereGenerateResponse,
  name: "COHERE-GENERATE",
};
