import type { HttpClient } from "../../typeDefs";

import { OpenAiChatApi } from "../../apis/openai";

import { createHttpModelProvider } from "../http";

export function createLmStudioModelProvider({
  modelId,
  client,
  endpoint = "http://localhost:1234/v1/chat/completions",
}: {
  modelId: string;
  client?: HttpClient;
  endpoint?: string;
}) {
  // TODO throw error if no key ("auth must be passed or GROQ_API_KEY must be set in process.env")

  return createHttpModelProvider({
    api: OpenAiChatApi,
    modelId,
    client,
    endpoint,
  });
}
