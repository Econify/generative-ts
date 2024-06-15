import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

import { HfInferenceApiOptions } from "./hfInferenceApi";

/**
 * @category Requests
 * @category Huggingface Text Generation Task
 */
export interface HfTextGenerationTaskOptions extends HfInferenceApiOptions {
  parameters?: {
    top_k?: number;
    top_p?: number;
    temperature?: number;
    repetition_penalty?: number;
    max_new_tokens?: number;
    max_time?: number;
    return_full_text?: boolean;
    num_return_sequences?: number;
    do_sample?: boolean;
  };
}

/**
 * @category Templates
 * @category Huggingface Text Generation Task
 */
export const HfTextGenerationTaskTemplate = new FnTemplate(
  ({ prompt, parameters, options }: HfTextGenerationTaskOptions) => {
    const rewritten = {
      inputs: prompt,
    };

    return JSON.stringify(
      {
        ...rewritten,
        parameters,
        options,
      },
      null,
      2,
    );
  },
);

const HfTextGenerationTaskResponseCodec = t.array(
  t.type({
    generated_text: t.string,
  }),
);

/**
 * @category Responses
 * @category Huggingface Text Generation Task
 */
export interface HfTextGenerationTaskResponse
  extends TypeOf<typeof HfTextGenerationTaskResponseCodec> {}

export function isHfTextGenerationTaskResponse(
  response: unknown,
): response is HfTextGenerationTaskResponse {
  return !isLeft(HfTextGenerationTaskResponseCodec.decode(response));
}

export interface HfTextGenerationTaskApi
  extends ModelApi<HfTextGenerationTaskOptions, HfTextGenerationTaskResponse> {}

/**
 *
 * ## Reference
 * [Huggingface Text Generation Task](https://huggingface.co/docs/api-inference/detailed_parameters?code=curl#text-generation-task)
 *
 * ## Providers using this API
 * - {@link createHuggingfaceInferenceModelProvider | Huggingface Inference API}
 *
 * @category APIs
 * @category Provider: Huggingface
 * @category Huggingface Text Generation Task
 */
export const HfTextGenerationTaskApi: HfTextGenerationTaskApi = {
  requestTemplate: HfTextGenerationTaskTemplate,
  responseGuard: isHfTextGenerationTaskResponse,
};
