export interface GroqAuthConfig {
  GROQ_API_KEY: string;
}

export function loadAuthConfig(): GroqAuthConfig {
  const { GROQ_API_KEY } = process.env;

  if (!GROQ_API_KEY) {
    throw new Error("Groq API key (GROQ_API_KEY) not found in process.env");
  }

  return { GROQ_API_KEY };
}
