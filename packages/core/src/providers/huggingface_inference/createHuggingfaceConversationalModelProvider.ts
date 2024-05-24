import type { HttpClient } from "../../typeDefs";

import { HfConversationalTaskApi } from "../../apis/huggingface";

import { createHuggingfaceInferenceModelProvider } from "./createHuggingfaceInferenceModelProvider";

import { HuggingfaceAuthConfig } from "./loadAuthConfig";

export function createHuggingfaceConversationalModelProvider({
  modelId,
  client,
  auth,
}: {
  modelId: string;
  client?: HttpClient;
  auth?: HuggingfaceAuthConfig;
}) {
  return createHuggingfaceInferenceModelProvider({
    api: HfConversationalTaskApi,
    modelId,
    client,
    auth,
  });
}
