import aws4 from "aws4";

import type {
  HttpClient,
  ModelApi,
  ModelId,
  ModelRequestOptions,
} from "@typeDefs";

import { HttpClientOptions } from "../../utils/httpClient";

import { BaseModelProviderConfig } from "../baseModelProvider";

import { HttpModelProvider } from "../http";

import { AwsBedrockAuthConfig } from "./AwsBedrockAuthConfig";

type AwsBedrockModelProviderConfig = BaseModelProviderConfig & {
  auth: AwsBedrockAuthConfig;
};

// Could use custom auth strategy with HttpModelProvider instead of this class...
export class AwsBedrockModelProvider<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
  THttpClientOptions = HttpClientOptions,
> extends HttpModelProvider<
  TRequestOptions,
  TResponse,
  THttpClientOptions,
  AwsBedrockModelProviderConfig
> {
  constructor({
    api,
    modelId,
    auth,
    client,
  }: {
    api: ModelApi<TRequestOptions, TResponse>;
    modelId: ModelId;
    client?: HttpClient<THttpClientOptions>;
    auth: AwsBedrockAuthConfig;
  }) {
    super({
      api,
      config: {
        modelId,
        auth,
      },
      client: client as HttpClient<THttpClientOptions>,
      endpoint: {
        getEndpoint(
          options: TRequestOptions,
          config: AwsBedrockModelProviderConfig,
        ) {
          return [
            `https://bedrock-runtime.${config.auth.AWS_REGION}.amazonaws.com`,
            `/model/${options.modelId}`,
            "/invoke",
          ].join("");
        },
      },
    });
  }

  async dispatchRequest(
    options: TRequestOptions,
    clientOptions: THttpClientOptions,
  ) {
    const { modelId } = options;

    const {
      auth: {
        AWS_ACCESS_KEY_ID: accessKeyId,
        AWS_SECRET_ACCESS_KEY: secretAccessKey,
        AWS_REGION: region,
      },
    } = this.config;

    const host = `bedrock-runtime.${region}.amazonaws.com`;

    const credentials =
      accessKeyId && secretAccessKey
        ? {
            accessKeyId,
            secretAccessKey,
          }
        : undefined;

    const body = this.getBody(options);

    const { headers: signedHeaders } = aws4.sign(
      {
        method: "POST",
        host,
        region,
        service: "bedrock",
        path: `/model/${modelId}/invoke`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // X-Amzn-Bedrock-GuardrailIdentifier
          // X-Amzn-Bedrock-GuardrailVersion
          // X-Amzn-Bedrock-Trace
        },
        body,
      },
      credentials,
    );

    if (!signedHeaders) {
      throw new Error("Failed to sign AWS Bedrock request");
    }

    const headers = {
      "Content-Type": signedHeaders["Content-Type"] as string,
      Accept: signedHeaders.Accept as string,
      Authorization: signedHeaders.Authorization as string,
      "X-Amz-Date": signedHeaders["X-Amz-Date"] as string,
    };

    const endpoint = await this.getEndpoint(options);

    return this.client.fetch(endpoint, {
      method: "POST",
      body,
      headers,
      ...clientOptions,
    });
  }
}
