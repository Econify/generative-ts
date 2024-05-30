import type { HttpClient } from "@typeDefs";

import { OpenAiChatApi } from "../../apis/openai";

import { HttpModelProvider } from "../http";

/**
 * @category Model Providers
 */
export function createLmStudioModelProvider({
  modelId,
  client,
  endpoint = "http://localhost:1234/v1/chat/completions",
}: {
  modelId: string;
  client?: HttpClient;
  endpoint?: string;
}) {
  return new HttpModelProvider({
    api: OpenAiChatApi,
    config: {
      modelId,
    },
    client,
    endpoint,
  });
}
