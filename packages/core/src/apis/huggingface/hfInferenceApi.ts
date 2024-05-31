import type { ModelRequestOptions } from "@typeDefs";

/**
 * @category Requests
 */
export interface HfInferenceApiOptions extends ModelRequestOptions {
  options?: {
    use_cache?: boolean;
    wait_for_model?: boolean;
  };
}
