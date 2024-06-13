import aws4 from "aws4";

import type {
  HttpClient,
  ModelApi,
  ModelId,
  ModelRequestOptions,
} from "@typeDefs";

import { BaseModelProviderConfig } from "../baseModelProvider";

import { BaseHttpModelProvider } from "../http";

import { AwsAuthConfig } from "./authConfig";

interface AwsBedrockModelProviderConfig extends BaseModelProviderConfig {
  auth?: AwsAuthConfig;
  region: string;
}

export class AwsBedrockModelProvider<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
> extends BaseHttpModelProvider<
  TRequestOptions,
  TResponse,
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
    client?: HttpClient;
    auth?: AwsAuthConfig;
    region: string;
  }) {
    super({
      api,
      client,
      config: {
        modelId,
        auth,
        region,
      },
    });
  }

  // TODO AwsBedrockModelProvider should inherit from HttpModelProvider
  protected getBody(options: TRequestOptions) {
    // TODO move this to "JsonBodyStrategy" (or something like that)
    const escapedOptions = Object.entries(options).reduce(
      (acc, [key, value]) => {
        if (typeof value === "string") {
          return {
            ...acc,
            [key]: value.replace(/\n/g, "\\n"),
          };
        }
        return {
          ...acc,
          [key]: value as unknown,
        };
      },
      {} as TRequestOptions,
    );

    return this.api.requestTemplate.render(escapedOptions);
  }

  async dispatchRequest(options: TRequestOptions) {
    const { auth, region } = this.config;
    const { modelId } = options;

    const host = `bedrock-runtime.${region}.amazonaws.com`;
    const endpoint = `https://${host}/model/${modelId}/invoke`;

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

    return this.client.fetch(endpoint, { method: "POST", body, headers });
  }
}
