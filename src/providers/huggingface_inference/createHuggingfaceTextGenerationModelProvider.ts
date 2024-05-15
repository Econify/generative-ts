import type { HttpClient } from "../../typeDefs";

import { HuggingfaceTextGenerationApi } from "../../apis/huggingface";

import { BearerTokenAuthStrategy } from "../http/strategies";

import { createHttpModelProvider } from "../http";

import { HuggingfaceAuthConfig, loadAuthConfig } from "./loadAuthConfig";

export function createHuggingfaceTextGenerationModelProvider({
  modelId,
  client,
  auth,
}: {
  modelId: string;
  client?: HttpClient;
  auth?: HuggingfaceAuthConfig;
}) {
  const { HUGGINGFACE_API_TOKEN } = auth ?? loadAuthConfig();

  // TODO throw error if no token ("auth must be passed or HUGGINGFACE_API_TOKEN must be set in process.env")

  return createHttpModelProvider({
    api: HuggingfaceTextGenerationApi,
    modelId,
    client,
    endpoint: {
      getEndpoint({ modelId: mId }) {
        return `https://api-inference.huggingface.co/models/${mId}`;
      },
    },
    auth: new BearerTokenAuthStrategy(HUGGINGFACE_API_TOKEN),
  });
}
