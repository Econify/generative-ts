import type { ModelRequestOptions } from "@typeDefs";

/**
 * @category Huggingface
 * @category Requests
 */
export interface HfInferenceApiOptions extends ModelRequestOptions {
  options?: {
    use_cache?: boolean;
    wait_for_model?: boolean;
  };
}
