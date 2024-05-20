import type { HttpClient } from "../../typeDefs";

import { HuggingfaceTextGenerationApi } from "../../apis/huggingface";

import { createHuggingfaceInferenceModelProvider } from "./createHuggingfaceInferenceModelProvider";

import { HuggingfaceAuthConfig } from "./loadAuthConfig";

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
    api: HuggingfaceTextGenerationApi,
    modelId,
    client,
    auth,
  });
}
