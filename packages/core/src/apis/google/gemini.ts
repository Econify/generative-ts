import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

import { composite } from "../_utils/ioTsHelpers";

import type { FewShotRequestOptions } from "../shared/fewShot";

const templateSource = `{
  <% let comma = false; %>
  "contents": [
    <% (typeof examplePairs !== 'undefined' ? examplePairs : []).forEach((pair, index) => { %>
      <%- comma ? ',' : '' %>
      <% comma = true; %>
      {
        "role": "user",
        "parts": [
          { "text": "<%= pair.user %>" }
        ]
      },
      {
        "role": "model",
        "parts": [
          { "text": "<%= pair.assistant %>" }
        ]
      }
    <% }) %>
    <% (typeof contents !== 'undefined' ? contents : []).forEach((contentItem, index) => { %>
      <%- comma ? ',' : '' %>
      <% comma = true; %>
      {
        "parts": [
          <% contentItem.parts.forEach((part, index) => { %>
            {
              <% let part_comma = false; %>
              <% if (typeof part.text !== 'undefined') { %>
                "text": "<%= part.text %>"
                <% part_comma = true; %>
              <% } %>
              <% if (typeof part.function_call !== 'undefined') { %>
                <%- part_comma ? ',' : '' %>
                "function_call": { 
                  "name": "<%= part.function_call.name %>", 
                  "args": <%- JSON.stringify(part.function_call.args) %> 
                }
                <% part_comma = true; %>
              <% } %>
              <% if (typeof part.function_response !== 'undefined') { %>
                <%- part_comma ? ',' : '' %>
                "function_response": { 
                  "name": "<%= part.function_response.name %>", 
                  "response": <%- JSON.stringify(part.function_response.response) %> 
                }
                <% part_comma = true; %>
              <% } %>
            }
            <%- index < contentItem.parts.length - 1 ? ',' : '' %>
          <% }) %>
        ]
        <% if (typeof contentItem.role !== 'undefined') { %>
          , "role": "<%= contentItem.role %>"
        <% } %>
      }
    <% }) %>
    <% if (typeof contents == 'undefined' || contents.length == 0 || contents[contents.length - 1].role !== 'user') { %>
      <%- comma ? ',' : '' %>
      {
        "role": "user",
        "parts": [
          { "text": "<%= prompt %>" }
        ]
      }
    <% } %>
  ]
  <% if (typeof tools !== 'undefined') { %>
    , "tools": [
      <% tools.forEach((tool, index) => { %>
        {
          "function_declarations": [
            <% tool.function_declarations.forEach((declaration, dindex) => { %>
              {
                "name": "<%= declaration.name %>"
                <% if (typeof declaration.description !== 'undefined') { %>
                  , "description": "<%= declaration.description %>"
                <% } %>
                <% if (typeof declaration.parameters !== 'undefined') { %>
                  , "parameters": <%- JSON.stringify(declaration.parameters) %>
                <% } %>
                <% if (typeof declaration.response !== 'undefined') { %>
                  , "response": <%- JSON.stringify(declaration.response) %>
                <% } %>
              }
              <%- dindex < tool.function_declarations.length - 1 ? ',' : '' %>
            <% }) %>
          ]
        }
      <% }) %>
    ]
  <% } %>
  <% if (typeof tools_config !== 'undefined') { %>
    , "tools_config": {
      <% if (typeof tools_config.mode !== 'undefined') { %>
        "mode": "<%= tools_config.mode %>"
      <% } %>
      <% if (typeof tools_config.allowed_function_names !== 'undefined') { %>
        , "allowed_function_names": <%- JSON.stringify(tools_config.allowed_function_names) %>
      <% } %>
    }
  <% } %>
  <% if (typeof system_instruction !== 'undefined' || typeof system !== 'undefined') { %>
    , "system_instruction": {
      "parts": [
        <% if (typeof system !== 'undefined') { %>
          {
            "text": "<%= system %>"
          }
          <%- typeof system_instruction !== 'undefined' ? ',' : '' %>
        <% } %>
        <% (typeof system_instruction !== 'undefined' ? system_instruction.parts : []).forEach((part, index) => { %>
          {
            <% if (typeof part.text !== 'undefined') { %>
            "text": "<%= part.text %>"
            <% } %>
          }
          <%- index < system_instruction.parts.length - 1 ? ',' : '' %>
        <% }) %>
      ]
    }
  <% } %>
  <% if (typeof safety_settings !== 'undefined') { %>
    <% comma = false; %>
    , "safety_settings": {
      <% if (typeof safety_settings.category !== 'undefined') { %>
        "category": "<%= safety_settings.category %>"
        <% comma = true; %>
      <% } %>
      <% if (typeof safety_settings.threshold !== 'undefined') { %>
        <%- comma ? ',' : '' %>
        "threshold": "<%= safety_settings.threshold %>"
        <% comma = true; %>
      <% } %>
      <% if (typeof safety_settings.max_influential_terms !== 'undefined') { %>
        <%- comma ? ',' : '' %>
        "max_influential_terms": <%= safety_settings.max_influential_terms %>
        <% comma = true; %>
      <% } %>
      <% if (typeof safety_settings.method !== 'undefined') { %>
        <%- comma ? ',' : '' %>
        "method": "<%= safety_settings.method %>"
        <% comma = true; %>
      <% } %>
    }
  <% } %>
  <% if (typeof generation_config !== 'undefined') { %>
    <% comma = false; %>
    , "generation_config": {
      <% if (typeof generation_config.temperature !== 'undefined') { %>
        "temperature": <%= generation_config.temperature %>
        <% comma = true; %>
      <% } %>
      <% if (typeof generation_config.top_p !== 'undefined') { %>
        <%- comma ? ',' : '' %>
        "top_p": <%= generation_config.top_p %>
        <% comma = true; %>
      <% } %>
      <% if (typeof generation_config.top_k !== 'undefined') { %>
        <%- comma ? ',' : '' %>
        "top_k": <%= generation_config.top_k %>
        <% comma = true; %>
      <% } %>
      <% if (typeof generation_config.candidate_count !== 'undefined') { %>
        <%- comma ? ',' : '' %>
        "candidate_count": <%= generation_config.candidate_count %>
        <% comma = true; %>
      <% } %>
      <% if (typeof generation_config.max_output_tokens !== 'undefined') { %>
        <%- comma ? ',' : '' %>
        "max_output_tokens": <%= generation_config.max_output_tokens %>
        <% comma = true; %>
      <% } %>
      <% if (typeof generation_config.stop_sequences !== 'undefined') { %>
        <%- comma ? ',' : '' %>
        "stop_sequences": <%- JSON.stringify(generation_config.stop_sequences) %>
        <% comma = true; %>
      <% } %>
      <% if (typeof generation_config.presence_penalty !== 'undefined') { %>
        <%- comma ? ',' : '' %>
        "presence_penalty": <%= generation_config.presence_penalty %>
        <% comma = true; %>
      <% } %>
      <% if (typeof generation_config.frequency_penalty !== 'undefined') { %>
        <%- comma ? ',' : '' %>
        "frequency_penalty": <%= generation_config.frequency_penalty %>
        <% comma = true; %>
      <% } %>
      <% if (typeof generation_config.response_mime_type !== 'undefined') { %>
        <%- comma ? ',' : '' %>
        "response_mime_type": "<%= generation_config.response_mime_type %>"
        <% comma = true; %>
      <% } %>
    }
  <% } %>
}`;

interface Content {
  role?: "user" | "model";
  parts: {
    text?: string;
    function_call?: {
      name: string;
      args: Record<string, string>;
    };
    function_response?: {
      name: string;
      response: Record<string, string>;
    };
    // inline_data (not supported)
    // file_data (not supported)
    // video_metadata (not supported)
  }[];
}

interface Schema {
  /**
   * The type of the schema.
   */
  type: "STRING" | "INTEGER" | "BOOLEAN" | "NUMBER" | "ARRAY" | "OBJECT";

  /**
   * An optional description of the schema.
   */
  description?: string;

  /**
   * An optional list of possible values for the element of type STRING.
   */
  enum?: string[];

  /**
   * An optional schema definition for elements of type ARRAY.
   */
  items?: Schema[];

  /**
   * An optional schema definition for the properties of type OBJECT.
   */
  properties?: {
    [key: string]: Schema;
  };

  /**
   * An optional list of required properties for type OBJECT.
   */
  required?: string[];

  /**
   * An optional flag indicating whether the property is nullable.
   */
  nullable?: boolean;
}

/**
 * @category Google Gemini
 * @category Requests
 */
export interface GoogleGeminiOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {
  contents?: Content | Content[];
  system_instruction?: Content;
  tools?: {
    function_declarations: {
      name: string;
      description?: string;
      parameters?: Schema;
      response?: Schema;
    }[];
  }[];
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

/**
 * @category Google Gemini
 * @category Templates
 */
export const GoogleGeminiTemplate = new EjsTemplate<GoogleGeminiOptions>(
  templateSource,
);

const GoogleGeminiResponseCodec = t.type({
  data: t.type({
    candidates: t.array(
      composite({
        required: {
          finishReason: t.string,
        },
        partial: {
          content: t.type({
            role: t.string,
            parts: t.array(
              t.partial({
                text: t.string,
                functionCall: t.type({
                  name: t.string,
                  args: t.record(t.string, t.string),
                }),
              }),
            ),
          }),
          citationMetadata: t.type({
            citations: t.array(
              t.partial({
                uri: t.string,
                startIndex: t.number,
                endIndex: t.number,
              }),
            ),
          }),
          safetyRatings: t.array(
            t.type({
              category: t.string,
              probability: t.string,
              probabilityScore: t.number,
              severity: t.string,
              severityScore: t.number,
            }),
          ),
        },
      }),
    ),
    usageMetadata: t.type({
      candidatesTokenCount: t.number,
      promptTokenCount: t.number,
      totalTokenCount: t.number,
    }),
  }),
  headers: t.record(t.string, t.unknown),
  status: t.number,
  statusText: t.string,
  // config
  // request
});

/**
 * @category Google Gemini
 * @category Responses
 */
export interface GoogleGeminiResponse
  extends TypeOf<typeof GoogleGeminiResponseCodec> {}

export function isGoogleGeminiResponse(
  response: unknown,
): response is GoogleGeminiResponse {
  return !isLeft(GoogleGeminiResponseCodec.decode(response));
}

export interface GoogleGeminiApi
  extends ModelApi<GoogleGeminiOptions, GoogleGeminiResponse> {}

/**
 *
 * ## Reference
 * - {@link https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference | Gemini Inference API}
 * - {@link https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/function-calling | Gemini Function Calling API}
 *
 * ## Providers using this API
 * - {@link createVertexAiModelProvider | GCloud VertexAI}
 *
 * @category APIs
 * @category Google Gemini
 * @category Provider: GCloud VertexAI
 *
 */
export const GoogleGeminiApi: GoogleGeminiApi = {
  requestTemplate: GoogleGeminiTemplate,
  responseGuard: isGoogleGeminiResponse,
};
