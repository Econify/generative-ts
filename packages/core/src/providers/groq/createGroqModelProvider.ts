import type { HttpClient } from "@typeDefs";

import { OpenAiChatApi } from "../../apis/openai";

import { BearerTokenAuthStrategy } from "../http/strategies";

import { createHttpModelProvider } from "../http";

import { GroqAuthConfig, loadAuthConfig } from "./loadAuthConfig";

/**
 * @category Model Providers
 */
export function createGroqModelProvider({
  modelId,
  client,
  auth,
}: {
  modelId: string;
  client?: HttpClient;
  auth?: GroqAuthConfig;
}) {
  const { GROQ_API_KEY } = auth ?? loadAuthConfig();

  // TODO throw error if no key ("auth must be passed or GROQ_API_KEY must be set in process.env")

  return createHttpModelProvider({
    api: OpenAiChatApi,
    modelId,
    client,
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    auth: new BearerTokenAuthStrategy(GROQ_API_KEY),
  });
}
