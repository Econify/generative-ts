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

import { AwsAuthConfig } from "./authConfig";

interface AwsBedrockModelProviderConfig extends BaseModelProviderConfig {
  auth?: AwsAuthConfig;
  region: string;
}

// TODO eliminate this class and just use a custom auth strategy with HttpModelProvider
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
    client,
    auth,
    region,
  }: {
    api: ModelApi<TRequestOptions, TResponse>;
    modelId: ModelId;
    client?: HttpClient<THttpClientOptions>;
    auth?: AwsAuthConfig;
    region: string;
  }) {
    super({
      api,
      client: client as HttpClient<THttpClientOptions>,
      config: {
        modelId,
        auth,
        region,
      },
      endpoint: {
        getEndpoint(
          options: TRequestOptions,
          config: AwsBedrockModelProviderConfig,
        ) {
          return [
            `https://bedrock-runtime.${config.region}.amazonaws.com`,
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
    const { auth, region } = this.config;
    const { modelId } = options;

    const host = `bedrock-runtime.${region}.amazonaws.com`;

    const credentials = auth
      ? {
          accessKeyId: auth.AWS_ACCESS_KEY_ID,
          secretAccessKey: auth.AWS_SECRET_ACCESS_KEY,
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
