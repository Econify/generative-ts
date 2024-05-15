export interface OpenAiAuthConfig {
  OPENAI_API_KEY: string;
}

export function loadAuthConfig(): OpenAiAuthConfig {
  const { OPENAI_API_KEY } = process.env;

  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key (OPENAI_API_KEY) not found in process.env");
  }

  return { OPENAI_API_KEY };
}
