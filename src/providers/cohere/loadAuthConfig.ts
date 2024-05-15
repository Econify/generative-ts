export interface CohereAuthConfig {
  COHERE_API_KEY: string;
}

export function loadAuthConfig(): CohereAuthConfig {
  const { COHERE_API_KEY } = process.env;

  if (!COHERE_API_KEY) {
    throw new Error("Groq API key (COHERE_API_KEY) not found in process.env");
  }

  return { COHERE_API_KEY };
}
