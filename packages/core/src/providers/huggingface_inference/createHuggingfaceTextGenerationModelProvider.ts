import type { HttpClient } from "@typeDefs";

import { HfTextGenerationTaskApi } from "../../apis/huggingface";

import { createHuggingfaceInferenceModelProvider } from "./createHuggingfaceInferenceModelProvider";

import { HuggingfaceAuthConfig } from "./loadAuthConfig";

/**
 * @category Model Providers
 */
export function createHuggingfaceTextGenerationModelProvider({
  modelId,
  client,
  auth,
}: {
  modelId: string;
  client?: HttpClient;
  auth?: HuggingfaceAuthConfig;
}) {
  return createHuggingfaceInferenceModelProvider({
    api: HfTextGenerationTaskApi,
    modelId,
    client,
    auth,
  });
}
