import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

import { composite } from "../_utils/ioTsHelpers";

import type { FewShotRequestOptions } from "../shared/fewShot";

const templateSource = `{
  "contents": [
    <% (typeof examplePairs !== 'undefined' ? examplePairs : []).forEach(pair => { %>
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
    },
    <% }) %>
    <% (typeof contents !== 'undefined' ? contents : []).forEach(contentItem => { %>
    {
      "parts": [
        <% contentItem.parts.forEach((part, index) => { %>
        {
          <% if (typeof part.text !== 'undefined') { %>"text": "<%= part.text %>"<% } %>
        }<% if (index < contentItem.parts.length - 1) { %>,<% } %>
        <% }) %>
      ]
      <% if (typeof contentItem.role !== 'undefined') { %>, "role": "<%= contentItem.role %>"<% } %>
    },
    <% }) %>
    {
      "role": "user",
      "parts": [
        { "text": "<%= prompt %>" }
      ]
    }
  ]
  <% if (typeof system_instruction !== 'undefined' || typeof system !== 'undefined') { %>
    , "system_instruction": {
      "parts": [
        <% if (typeof system !== 'undefined') { %>
        {
          "text": "<%= system %>"
        }<% if (typeof system_instruction !== 'undefined') { %>,<% } %>
        <% } %>
        <% if (typeof system_instruction !== 'undefined') { %>
          <% system_instruction.parts.forEach((part, index) => { %>
          {
            <% if (typeof part.text !== 'undefined') { %>"text": "<%= part.text %>"<% } %>
          }<% if (index < system_instruction.parts.length - 1) { %>,<% } %>
          <% }) %>
        <% } %>
      ]
    }
  <% } %>
  <% if (typeof safety_settings !== 'undefined') { %>
    , "safety_settings": {
      <% if (typeof safety_settings.category !== 'undefined') { %>"category": "<%= safety_settings.category %>"<% } %>
      <% if (typeof safety_settings.threshold !== 'undefined') { %>, "threshold": "<%= safety_settings.threshold %>"<% } %>
      <% if (typeof safety_settings.max_influential_terms !== 'undefined') { %>, "max_influential_terms": <%= safety_settings.max_influential_terms %><% } %>
      <% if (typeof safety_settings.method !== 'undefined') { %>, "method": "<%= safety_settings.method %>"<% } %>
    }
  <% } %>
  <% if (typeof generation_config !== 'undefined') { %>
    , "generation_config": {
      <% if (typeof generation_config.temperature !== 'undefined') { %>"temperature": <%= generation_config.temperature %><% } %>
      <% if (typeof generation_config.top_p !== 'undefined') { %>, "top_p": <%= generation_config.top_p %><% } %>
      <% if (typeof generation_config.top_k !== 'undefined') { %>, "top_k": <%= generation_config.top_k %><% } %>
      <% if (typeof generation_config.candidate_count !== 'undefined') { %>, "candidate_count": <%= generation_config.candidate_count %><% } %>
      <% if (typeof generation_config.max_output_tokens !== 'undefined') { %>, "max_output_tokens": <%= generation_config.max_output_tokens %><% } %>
      <% if (typeof generation_config.stop_sequences !== 'undefined') { %>, "stop_sequences": <%- JSON.stringify(generation_config.stop_sequences) %><% } %>
      <% if (typeof generation_config.presence_penalty !== 'undefined') { %>, "presence_penalty": <%= generation_config.presence_penalty %><% } %>
      <% if (typeof generation_config.frequency_penalty !== 'undefined') { %>, "frequency_penalty": <%= generation_config.frequency_penalty %><% } %>
      <% if (typeof generation_config.response_mime_type !== 'undefined') { %>, "response_mime_type": "<%= generation_config.response_mime_type %>"<% } %>
    }
  <% } %>
}`;

interface Content {
  role?: "user" | "model";
  parts: {
    text?: string;
    // inline_data
    // file_data
    // function_call
    // function_response
    // video_metadata
  }[];
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
  // tools
  // tool_config
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
            parts: t.array(t.type({ text: t.string })),
            role: t.string,
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
    // usageMetadata
  }),
  // config
  // headers
  // request
  // status
  // statusText
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
