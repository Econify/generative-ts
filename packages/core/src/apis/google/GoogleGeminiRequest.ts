import type { ModelRequestOptions } from "@typeDefs";

import type { FewShotRequestOptions, ToolUseRequestOptions } from "../shared";

interface FunctionCall {
  name: string;
  args: Record<string, unknown>;
}

interface FunctionResponse {
  name: string;
  response: Record<string, unknown>;
}

interface Part {
  text?: string;
  functionCall?: FunctionCall; // TODO deal with casing disparity
  function_response?: FunctionResponse;
}

export interface PartWithFunctionCall extends Part {
  // TODO name "Gemini" if exported
  functionCall: FunctionCall;
}

export interface PartWithFunctionResponse extends Part {
  // TODO name "Gemini" if exported
  function_response: FunctionResponse;
}

interface GoogleGeminiContentItem {
  role?: "user" | "model";
  parts: Part[];
}

export interface GoogleGeminiSchema {
  type: "STRING" | "INTEGER" | "BOOLEAN" | "NUMBER" | "ARRAY" | "OBJECT";
  description?: string;
  enum?: string[];
  items?: GoogleGeminiSchema[];
  properties?: {
    [key: string]: GoogleGeminiSchema;
  };
  required?: string[];
  nullable?: boolean;
}

export interface GoogleGeminiToolsOptions {
  tools?: {
    function_declarations: {
      name: string;
      description?: string;
      parameters?: GoogleGeminiSchema;
      response?: GoogleGeminiSchema;
    }[];
  }[];
}

/**
 * @category Google Gemini
 * @category Requests
 */
export interface GoogleGeminiOptions
  extends ModelRequestOptions,
    FewShotRequestOptions,
    ToolUseRequestOptions,
    GoogleGeminiToolsOptions {
  contents?: GoogleGeminiContentItem | GoogleGeminiContentItem[];
  system_instruction?: GoogleGeminiContentItem;
  tools_config?: {
    mode?: "AUTO" | "NONE" | "ANY";
    allowed_function_names?: string[];
  };
  safety_settings?: {
    category?: string;
    threshold?: string;
    max_influential_terms?: number;
    method?: string;
  };
  generation_config?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    candidate_count?: number;
    max_output_tokens?: number;
    stop_sequences?: string[];
    presence_penalty?: number;
    frequency_penalty?: number;
    response_mime_type?: "text/plain" | "application/json";
  };
}
