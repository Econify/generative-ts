import type { HttpClient } from "../../typeDefs";

import { CohereGenerateApi } from "../../apis/cohere";

import { BearerTokenAuthStrategy } from "../http/strategies";

import { createHttpModelProvider } from "../http";

import { CohereAuthConfig, loadAuthConfig } from "./loadAuthConfig";

export function createCohereLegacyModelProvider({
  modelId,
  client,
  auth,
}: {
  modelId: string;
  client?: HttpClient;
  auth?: CohereAuthConfig;
}) {
  const { COHERE_API_KEY } = auth ?? loadAuthConfig();

  // TODO throw error if no key ("auth must be passed or COHERE_API_KEY must be set in process.env")

  return createHttpModelProvider({
    api: CohereGenerateApi,
    modelId,
    client,
    endpoint: "https://api.cohere.ai/v1/generate",
    auth: new BearerTokenAuthStrategy(COHERE_API_KEY),
  });
}