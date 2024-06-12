import type { HttpClient } from "@generative-ts/core";

import { GoogleGeminiApi, HttpModelProvider } from "@generative-ts/core";

import type { VertexAiAuthConfig } from "./VertexAiAuthConfig";
import { getCustomClient } from "./getCustomClient";

/**
 *
 * Creates a Google Cloud VertexAI {@link ModelProvider} with the {@link GoogleGeminiApi}.
 *
 * ```ts
 * import { createVertexAiModelProvider } from "@packages/google-vertex-ai";
 *
 * const gemini = await createVertexAiModelProvider({
 *   modelId: "gemini-1.0-pro", // VertexAI defined model ID
 *   // you can explicitly pass auth here, otherwise by default it is read from process.env
 * });
 *
 * const response = await gemini.sendRequest({
 *   prompt: "Brief History of NY Mets:",
 *   // all other Gemini options available here
 * });
 *
 * console.log(response.data.candidates[0]);
 * ```
 *
 * ### Provider Setup and Notes
 *
 * Enable {@link https://console.cloud.google.com/vertex-ai | VertexAI} in your Google Cloud Console. Note: VertexAI is currently only available in certain regions.
 *
 * By default, this provider uses Google Cloud Application Default Credentials, meaning auth credentials will be found automatically based on the application environment. This is the preferred method of authentication if your app is running in Google Cloud.
 *
 * Please follow instructions in {@link https://cloud.google.com/docs/authentication/provide-credentials-adc#how-to | "Set up Application Default Credentials"} to set up ADC credentials.
 *
 * If you pass in a custom client, Application Default Credentials will **NOT** be used, and auth logic will be left to the custom client. See {@link https://www.npmjs.com/package/google-auth-library | google-auth-library} for possible strategies about different ways to authenticate.
 *
 * If you do not pass a {@link VertexAiAuthConfig} to `auth`, the values will be read from the environment as `GCLOUD_LOCATION` and `GCLOUD_PROJECT_ID`.
 *
 * ### Model Parameters
 *
 * - {@link https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference | Gemini Inference API}
 *
 * ### Model IDs
 *
 * - {@link https://cloud.google.com/vertex-ai/generative-ai/docs/learn/model-versioning#gemini-model-versions | Gemini Models}
 *
 * @see {@link https://cloud.google.com/docs/authentication/provide-credentials-adc#how-to | "Set up Application Default Credentials"}
 * @see {@link https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference | Gemini Inference API}
 * @see {@link https://cloud.google.com/vertex-ai/generative-ai/docs/learn/model-versioning#gemini-model-versions | Gemini Models}
 *
 * @category Providers
 * @category Provider: GCloud VertexAI
 *
 * @param {Object} params
 * @param {string} params.modelId - The model ID as defined by Google Cloud VertexAI.
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, a client implementing Google Cloud Application Default Credentials will be used.
 * @param {VertexAiAuthConfig} [params.auth] - Authorization configuration for VertexAI. If not supplied, it will be loaded from the environment.
 * @returns {HttpModelProvider} The VertexAI Model Provider
 * @throws {Error} If no auth is passed and GCLOUD_LOCATION or GCLOUD_PROJECT_ID are not found in process.env
 *
 * @example Usage
 * ```ts
 * import { createVertexAiModelProvider } from "@packages/google-vertex-ai";
 *
 * const gemini = await createVertexAiModelProvider({
 *   modelId: "gemini-1.0-pro", // VertexAI defined model ID
 *   // you can explicitly pass auth here, otherwise by default it is read from process.env
 * });
 *
 * const response = await gemini.sendRequest({
 *   prompt: "Brief History of NY Mets:",
 *   // all other Gemini options available here
 * });
 *
 * console.log(response.data.candidates[0]);
 * ```
 */
export async function createVertexAiModelProvider({
  modelId,
  client: _client,
  auth,
}: {
  modelId: string;
  client?: HttpClient;
  auth?: VertexAiAuthConfig;
}) {
  const { GCLOUD_LOCATION, GCLOUD_PROJECT_ID } = auth ?? process.env;

  if (!GCLOUD_LOCATION || !GCLOUD_PROJECT_ID) {
    throw new Error(
      "Error when creating VertexAI ModelProvider: Authorization not found. GCLOUD_LOCATION and GCLOUD_PROJECT_ID must be passed explicitly in `auth` or set in the environment.",
    );
  }

  // TODO OpenAI? `https://${LOCATION}-aiplatform.googleapis.com/v1beta1/projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/openapi`;

  const endpoint = [
    `https://${GCLOUD_LOCATION}-aiplatform.googleapis.com/v1`,
    `/projects/${GCLOUD_PROJECT_ID}`,
    `/locations/${GCLOUD_LOCATION}`,
    `/publishers/google`,
    `/models/${modelId}`,
    ":generateContent",
  ].join("");

  let client = _client;

  if (!client) {
    client = await getCustomClient();
  }

  return new HttpModelProvider({
    api: GoogleGeminiApi,
    config: {
      modelId,
    },
    endpoint,
    client,
  });
}
