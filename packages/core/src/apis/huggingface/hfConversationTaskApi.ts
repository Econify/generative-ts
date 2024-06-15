/* eslint-disable camelcase */
import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

import { HfInferenceApiOptions } from "./hfInferenceApi";

/**
 * @category Requests
 * @category Huggingface Conversational Task
 */
export interface HfConversationalTaskOptions extends HfInferenceApiOptions {
  past_user_inputs?: string[];
  generated_responses?: string[];
  parameters?: {
    top_k?: number;
    top_p?: number;
    min_length?: number;
    max_length?: number;
    temperature?: number;
    repetition_penalty?: number;
    max_time?: number;
  };
}

/**
 * @category Templates
 * @category Huggingface Conversational Task
 */
export const HfConversationalTaskTemplate = new FnTemplate(
  ({
    prompt,
    past_user_inputs,
    generated_responses,
    parameters,
    options,
  }: HfConversationalTaskOptions) => {
    const rewritten = {
      inputs: prompt,
    };

    const result = {
      ...rewritten,
      past_user_inputs,
      generated_responses,
      parameters,
      options,
    };

    return JSON.stringify(result, null, 2);
  },
);

const HfConversationalTaskResponseCodec = t.array(
  t.type({
    generated_text: t.string,
  }),
);

/**
 *
 * @category Responses
 * @category Huggingface Conversational Task
 */
export interface HfConversationalTaskResponse
  extends TypeOf<typeof HfConversationalTaskResponseCodec> {}

export function isHfConversationalTaskResponse(
  response: unknown,
): response is HfConversationalTaskResponse {
  return !isLeft(HfConversationalTaskResponseCodec.decode(response));
}

export interface HfConversationalTaskApi
  extends ModelApi<HfConversationalTaskOptions, HfConversationalTaskResponse> {}

/**
 *
 * ## Reference
 * [Huggingface Conversational Task](https://huggingface.co/docs/api-inference/detailed_parameters?code=curl#conversational-task)
 *
 * ## Providers using this API
 * - {@link createHuggingfaceInferenceModelProvider | Huggingface Inference API}
 *
 * @category APIs
 * @category Provider: Huggingface
 * @category Huggingface Conversational Task
 */
export const HfConversationalTaskApi: HfConversationalTaskApi = {
  requestTemplate: HfConversationalTaskTemplate,
  responseGuard: isHfConversationalTaskResponse,
};
