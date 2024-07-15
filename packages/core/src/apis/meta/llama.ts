import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

const LlamaResponseCodec = t.type({
  generation: t.string,
  prompt_token_count: t.number,
  generation_token_count: t.number,
  stop_reason: t.string,
});

/**
 * @category Llama2
 * @category Llama3
 * @category Responses
 */
export interface LlamaResponse extends TypeOf<typeof LlamaResponseCodec> {}

export function isLlamaResponse(response: unknown): response is LlamaResponse {
  return !isLeft(LlamaResponseCodec.decode(response));
}
