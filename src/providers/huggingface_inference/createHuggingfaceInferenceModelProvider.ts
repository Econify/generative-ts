import type { HttpClient, ModelApi, ModelRequestOptions } from "../../typeDefs";

import { BearerTokenAuthStrategy } from "../http/strategies";

import { createHttpModelProvider } from "../http";

import { HuggingfaceAuthConfig, loadAuthConfig } from "./loadAuthConfig";

export function createHuggingfaceInferenceModelProvider<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
>({
  api,
  modelId,
  client,
  auth,
}: {
  api: ModelApi<TRequestOptions, TResponse>;
  modelId: string;
  client?: HttpClient;
  auth?: HuggingfaceAuthConfig;
}) {
  const { HUGGINGFACE_API_TOKEN } = auth ?? loadAuthConfig();

  if (!HUGGINGFACE_API_TOKEN) {
    throw new Error(
      "Error when creating Huggingface ModelProvider: Huggingface API token (HUGGINGFACE_API_TOKEN) not found in process.env. Please either pass `HUGGINGFACE_API_TOKEN` explicitly in `auth` or set it in the environment.",
    );
  }

  return createHttpModelProvider({
    api,
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
