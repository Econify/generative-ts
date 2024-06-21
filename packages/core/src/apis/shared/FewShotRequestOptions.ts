/**
 * @category Core Interfaces
 */
export interface FewShotRequestOptions {
  $prompt: string;
  system?: string;
  examplePairs?: { user: string; assistant: string }[];
}
