import type {
  HttpClient,
  InferRequestOptions,
  InferResponse,
  ModelApi,
  ModelId,
} from "@typeDefs";

import {
  Ai21Jurassic2Api,
  AmazonTitanTextApi,
  CohereGenerateApi,
  Llama2ChatApi,
  Llama3ChatApi,
  MistralBedrockApi,
} from "../../apis";

import type { HttpModelProvider, InferHttpClientOptions } from "../http";

import { AwsBedrockModelProvider } from "./AwsBedrockModelProvider";

import { AwsAuthConfig } from "./authConfig";

const DEFAULT_REGION = "us-east-1";

type AwsBedrockApi =
  | Ai21Jurassic2Api
  | AmazonTitanTextApi
  | CohereGenerateApi
  | Llama2ChatApi
  | Llama3ChatApi
  | MistralBedrockApi;

/**
 *
 * Creates an AWS Bedrock {@link ModelProvider} with the provided {@link ModelApi}.
 *
 * ```ts
 * import {
 *   AmazonTitanTextApi,
 *   createAwsBedrockModelProvider
 * } from "generative-ts";
 *
 * // Bedrock supports many different APIs and models. See below for full list.
 * const titanText = createAwsBedrockModelProvider({
 *   api: AmazonTitanTextApi,
 *   modelId: "amazon.titan-text-express-v1",
 *   // auth will be read from process.env and properly handled for the AWS environment on which the code is running
 * });
 *
 * const response = await titanText.sendRequest({
 *   prompt: "Brief history of NY Mets:"
 *   // all other options for the specified `api` available here
 * });
 *
 * console.log(response.results[0]?.outputText);
 * ```
 *
 * ### Compatible APIs
 * - {@link AmazonTitanTextApi}
 * - {@link CohereGenerateApi}
 * - {@link Llama2ChatApi}
 * - {@link Llama3ChatApi}
 * - {@link MistralBedrockApi}
 * - {@link Ai21Jurassic2Api}
 *
 * ### Provider Setup and Notes
 *
 * In the Bedrock service in the AWS Console, use "Request Model Access" to enable access to Bedrock models.
 *
 * If your code is running in an AWS Environment (eg, Lambda) authorization should happen automatically. Otherwise, you can explicitly pass in an {@link AwsAuthConfig} object to `auth`.
 *
 * ### Model Parameters
 *
 * - {@link https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters.html | AWS Bedrock Model Parameters}
 *
 * ### Model IDs
 *
 * - {@link https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html | AWS Bedrock Models}
 *
 * @see {@link https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters.html | AWS Bedrock Model Parameters}
 * @see {@link https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html | AWS Bedrock Models}
 *
 * @category Providers
 * @category Provider: AWS Bedrock
 *
 * @param {Object} params
 * @param {AwsBedrockApi} params.api - The API instance to use for making requests.
 * @param {string} params.modelId - The model ID as defined by AWS Bedrock.
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, the built-in fetch-based implementation will be used.
 * @param {AwsAuthConfig} [params.auth] - Authentication configuration for AWS. If not supplied, credentials will be loaded from the environment.
 * @param {string} [params.region=us-east-1] - AWS region where the Bedrock model is deployed. Defaults to "us-east-1".
 * @returns {AwsBedrockModelProvider} The AWS Bedrock Model Provider with the specified {@link ModelApi}.
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
  TAwsBedrockApi extends AwsBedrockApi,
  THttpClientOptions = InferHttpClientOptions<HttpModelProvider>,
>({
  api,
  modelId,
  client,
  auth,
  region = DEFAULT_REGION,
}: {
  api: TAwsBedrockApi;
  modelId: ModelId;
  client?: HttpClient<THttpClientOptions>;
  auth?: AwsAuthConfig;
  region?: string;
}) {
  return new AwsBedrockModelProvider({
    api: api as ModelApi<
      InferRequestOptions<TAwsBedrockApi>,
      InferResponse<TAwsBedrockApi>
    >,
    modelId,
    client,
    auth,
    region,
  });
}
