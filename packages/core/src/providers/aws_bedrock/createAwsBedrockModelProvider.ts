import type {
  HttpClient,
  ModelApi,
  ModelId,
  ModelRequestOptions,
} from "@typeDefs";

import { AwsBedrockModelProvider } from "./AwsBedrockModelProvider";

import { AwsAuthConfig } from "./authConfig";

const DEFAULT_REGION = "us-east-1";

/**
 *
 * Creates an AWS Bedrock {@link ModelProvider} with the provided {@link ModelApi}.
 *
 * ```ts
 * import {
 *   AmazonTitanTextApi,
 *   createAwsBedrockModelProvider,
 * } from "generative-ts";
 *
 * const titanText = createAwsBedrockModelProvider({
 *   api: AmazonTitanTextApi,
 *   modelId: "amazon.titan-text-express-v1",
 * });
 *
 * const response = await titanText.sendRequest({ prompt: "Brief history of NY Mets:" });
 *
 * console.log(response.results[0]?.outputText);
 * ```
 *
 * ### Known Compatible APIs:
 * - {@link AmazonTitanTextApi}
 * - {@link CohereGenerateApi}
 * - {@link Llama3ChatApi}
 * - {@link MistralBedrockApi}
 * - {@link Ai21Jurassic2Api}
 *
 * @see {@link https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html | AWS Bedrock Model IDs}
 *
 * @category Providers
 * @category Provider: AWS Bedrock
 *
 * @param {Object} params
 * @param {ModelApi} params.api - The API instance to use for making requests.
 * @param {string} params.modelId - The model ID as defined by AWS Bedrock.
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, the built-in fetch-based implementation will be used.
 * @param {AwsAuthConfig} [params.auth] - Authentication configuration for AWS. If not supplied, credentials will be loaded from the environment.
 * @param {string} [params.region=us-east-1] - AWS region where the Bedrock model is deployed. Defaults to "us-east-1".
 * @returns {AwsBedrockModelProvider<TRequestOptions, TResponse>} The AWS Bedrock Model Provider with the specified {@link ModelApi}.
 * @throws {Error} If no auth is passed and AWS credentials are not found in process.env.
 *
 * @example Multiple APIs
 * ```ts
 * import {
 *   Ai21Jurassic2Api,
 *   AmazonTitanTextApi,
 *   CohereGenerateApi,
 *   createAwsBedrockModelProvider,
 *   Llama3ChatApi,
 *   MistralBedrockApi,
 * } from "generative-ts";
 *
 * const titanText = createAwsBedrockModelProvider({
 *   api: AmazonTitanTextApi,
 *   modelId: "amazon.titan-text-express-v1",
 * });
 *
 * const cohereCommand = createAwsBedrockModelProvider({
 *   api: CohereGenerateApi,
 *   modelId: "cohere.command-text-v14",
 * });
 *
 * const llama3 = createAwsBedrockModelProvider({
 *   api: Llama3ChatApi,
 *   modelId: "meta.llama3-8b-instruct-v1:0",
 * });
 *
 * const mistral = createAwsBedrockModelProvider({
 *   api: MistralBedrockApi,
 *   modelId: "mistral.mistral-7b-instruct-v0:2",
 * });
 *
 * const jurassic = createAwsBedrockModelProvider({
 *   api: Ai21Jurassic2Api,
 *   modelId: "ai21.j2-mid-v1",
 * });
 *
 * const params = { prompt: "Brief history of NY Mets:" };
 *
 * const responses = await Promise.all([
 *   titanText.sendRequest(params),
 *   cohereCommand.sendRequest(params),
 *   llama3.sendRequest(params),
 *   mistral.sendRequest(params),
 *   jurassic.sendRequest(params),
 * ]);
 * ```
 */
export function createAwsBedrockModelProvider<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
>({
  api,
  modelId,
  client,
  auth,
  region = DEFAULT_REGION,
}: {
  api: ModelApi<TRequestOptions, TResponse>;
  modelId: ModelId;
  client?: HttpClient;
  auth?: AwsAuthConfig;
  region?: string;
}) {
  return new AwsBedrockModelProvider({
    api,
    modelId,
    client,
    auth,
    region,
  });
}
