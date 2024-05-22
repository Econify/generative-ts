export interface HuggingfaceAuthConfig {
  HUGGINGFACE_API_TOKEN: string;
}

export function loadAuthConfig(): HuggingfaceAuthConfig {
  const { HUGGINGFACE_API_TOKEN } = process.env;

  if (!HUGGINGFACE_API_TOKEN) {
    throw new Error(
      "Huggingface API token (HUGGINGFACE_API_TOKEN) not found in process.env",
    );
  }

  return { HUGGINGFACE_API_TOKEN };
}
