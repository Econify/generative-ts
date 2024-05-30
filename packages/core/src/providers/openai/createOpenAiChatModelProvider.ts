import type { HttpClient } from "@typeDefs";

import { OpenAiChatApi } from "../../apis/openai";

import { BearerTokenAuthStrategy } from "../http/strategies";

import { HttpModelProvider } from "../http";

import { loadAuthConfig, OpenAiAuthConfig } from "./loadAuthConfig";

/**
 * @category Model Providers
 */
export function createOpenAiChatModelProvider({
  modelId,
  client,
  auth,
}: {
  modelId: string;
  client?: HttpClient;
  auth?: OpenAiAuthConfig;
}) {
  const { OPENAI_API_KEY } = auth ?? loadAuthConfig();

  // TODO throw error if no key ("auth must be passed or OPENAI_API_KEY must be set in process.env")

  return new HttpModelProvider({
    api: OpenAiChatApi,
    modelId,
    client,
    endpoint: "https://api.openai.com/v1/chat/completions",
    auth: new BearerTokenAuthStrategy(OPENAI_API_KEY),
  });
}
