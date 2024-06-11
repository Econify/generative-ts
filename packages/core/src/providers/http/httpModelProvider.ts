import type {
  Body,
  Endpoint,
  Headers,
  HttpClient,
  ModelApi,
  ModelRequestOptions,
} from "@typeDefs";

import type {
  AuthStrategy,
  EndpointStrategy,
  HeadersStrategy,
} from "./typeDefs";

import { isEndpointStrategy, isHeadersStrategy } from "./typeDefs";

import {
  NoAuthStrategy,
  StaticEndpointStrategy,
  StaticHeadersStrategy,
} from "./strategies";

import type { BaseModelProviderConfig } from "../baseModelProvider";

import { BaseHttpModelProvider } from "./baseHttpModelProvider";

/**
 * @category Core Implementations
 */
export class HttpModelProvider<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
  TModelProviderConfig extends
    BaseModelProviderConfig = BaseModelProviderConfig,
> extends BaseHttpModelProvider<
  TRequestOptions,
  TResponse,
  TModelProviderConfig
> {
  private endpoint: EndpointStrategy<TRequestOptions, TModelProviderConfig>;

  private headers: HeadersStrategy<TRequestOptions, TModelProviderConfig>;

  private auth: AuthStrategy<TRequestOptions, TModelProviderConfig>;

  constructor({
    api,
    config,
    endpoint,
    headers,
    auth,
    client,
  }: {
    api: ModelApi<TRequestOptions, TResponse>;
    config: TModelProviderConfig;
    endpoint: Endpoint | EndpointStrategy;
    headers?: Headers | HeadersStrategy;
    auth?: AuthStrategy;
    client?: HttpClient;
  }) {
    super({
      api,
      config,
      client,
    });

    this.endpoint = !isEndpointStrategy(endpoint)
      ? new StaticEndpointStrategy(endpoint)
      : endpoint;

    this.headers = !isHeadersStrategy(headers)
      ? new StaticHeadersStrategy(
          headers ?? {
            "Content-Type": "application/json",
          },
        )
      : headers;

    this.auth = auth ?? new NoAuthStrategy();
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
