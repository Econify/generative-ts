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

import { AwsBedrockAuthConfig } from "./AwsBedrockAuthConfig";

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
 *   // If your code is running in an AWS Environment (eg, Lambda) authorization will happen automatically. Otherwise, explicitly pass in `auth`
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
 * ### Authorization
 *
 * If your code is running in an AWS Environment (eg, Lambda) authorization should happen automatically. Otherwise, explicitly pass in `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to `auth`.
 *
 * Region is also specified in `auth` as `AWS_REGION`. If not passed, it will be read from process.env.
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
 * @param {AwsBedrockAuthConfig} [params.auth] - Authentication configuration for AWS. Pass `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` here if not running in an AWS environment. Pass `AWS_REGION` here if not set in process.env.
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
}: {
  api: TAwsBedrockApi;
  modelId: ModelId;
  client?: HttpClient<THttpClientOptions>;
  auth?: AwsBedrockAuthConfig;
}) {
  const { AWS_REGION } = auth ?? process.env;

  if (!AWS_REGION) {
    throw new Error(
      "Error in createAwsBedrockModelProvider: AWS_REGION must either be passed in the `auth` object or set in the local process.env",
    );
  }

  return new AwsBedrockModelProvider({
    api: api as ModelApi<
      InferRequestOptions<TAwsBedrockApi>,
      InferResponse<TAwsBedrockApi>
    >,
    modelId,
    client,
    auth: {
      ...auth,
      AWS_REGION,
    },
  });
}
