import type {
  Body,
  Endpoint,
  Headers,
  HttpClient,
  ModelApi,
  ModelId,
  ModelRequestOptions,
} from "@typeDefs";

import type {
  AuthStrategy,
  EndpointStrategy,
  HeadersStrategy,
} from "./typeDefs";

import { BaseHttpModelProvider } from "./baseHttpModelProvider";

interface HttpModelProviderConstructorParams<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
> {
  api: ModelApi<TRequestOptions, TResponse>;
  modelId: ModelId;
  client?: HttpClient;
  endpoint: EndpointStrategy;
  headers: HeadersStrategy;
  auth: AuthStrategy;
}

/**
 * @category Core Implementations
 */
export class HttpModelProvider<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
> extends BaseHttpModelProvider<TRequestOptions, TResponse> {
  private endpoint: EndpointStrategy<TRequestOptions, typeof this.config>;

  private headers: HeadersStrategy<TRequestOptions, typeof this.config>;

  private auth: AuthStrategy<TRequestOptions, typeof this.config>;

  constructor({
    api,
    modelId,
    client,
    endpoint,
    headers,
    auth,
  }: HttpModelProviderConstructorParams<TRequestOptions, TResponse>) {
    super({
      api,
      config: {
        modelId,
      },
      client,
    });
    this.endpoint = endpoint;
    this.headers = headers;
    this.auth = auth;
  }

  protected getEndpoint(options: TRequestOptions) {
    return this.endpoint.getEndpoint(options, this.config);
  }

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

  protected getHeaders(options: TRequestOptions) {
    return this.headers.getHeaders(options, this.config);
  }

  protected applyAuth(
    options: TRequestOptions,
    endpoint: Endpoint,
    body: Body,
    headers: Headers,
  ) {
    return this.auth.applyAuth({
      options,
      config: this.config,
      endpoint,
      body,
      headers,
    });
  }

  protected async dispatchRequest(options: TRequestOptions) {
    const [endpoint, body, headers] = await Promise.all([
      this.getEndpoint(options),
      this.getBody(options),
      this.getHeaders(options),
    ]);

    const {
      endpoint: finalEndpoint,
      body: finalBody,
      headers: finalHeaders,
    } = await this.applyAuth(options, endpoint, body, headers);

    // TODO HTTP Method...

    return this.client.post(finalEndpoint, finalBody, finalHeaders);
  }
}
