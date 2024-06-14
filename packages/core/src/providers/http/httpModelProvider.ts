import type {
  Body,
  Endpoint,
  Headers,
  HttpClient,
  ModelApi,
  ModelRequestOptions,
} from "@typeDefs";

import { getClient, HttpClientOptions } from "../../utils/httpClient";

import { BaseModelProvider } from "../baseModelProvider";

import type { BaseModelProviderConfig } from "../baseModelProvider";

import { isEndpointStrategy, isHeadersStrategy } from "./typeDefs";

import type {
  AuthStrategy,
  EndpointStrategy,
  HeadersStrategy,
} from "./typeDefs";

import {
  NoAuthStrategy,
  StaticEndpointStrategy,
  StaticHeadersStrategy,
} from "./strategies";

import { escape } from "./utils";

/**
 * @category Core Implementations
 */
export class HttpModelProvider<
  TRequestOptions extends ModelRequestOptions = ModelRequestOptions,
  TResponse = unknown,
  THttpClientOptions = HttpClientOptions,
  TModelProviderConfig extends
    BaseModelProviderConfig = BaseModelProviderConfig,
> extends BaseModelProvider<
  TRequestOptions,
  TResponse,
  TModelProviderConfig,
  THttpClientOptions
> {
  public readonly client: HttpClient<THttpClientOptions>;

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
    client?: HttpClient<THttpClientOptions>;
  }) {
    super({
      api,
      config,
    });

    try {
      this.client = client ?? (getClient() as HttpClient<THttpClientOptions>);
    } catch (_e: unknown) {
      const e = _e as Error;
      throw new Error(
        [
          "Error initializing HttpModelProvider when attempting to load built-in HttpClient:",
          e.message,
          "To avoid loading built-in client, pass a custom HttpClient implementation as `client` to the HttpModelProvider constructor.",
        ].join(" "),
      );
    }

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
    const escapedOptions = escape<TRequestOptions>(options);

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

  protected async dispatchRequest(
    options: TRequestOptions,
    clientOptions: THttpClientOptions,
  ) {
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

    return this.client.fetch(finalEndpoint, {
      method: "POST",
      body: finalBody,
      headers: finalHeaders,
      ...clientOptions,
    });
  }
}

// utility type used by factory functions to infer the THttpClientOptions type
export type InferHttpClientOptions<T> =
  T extends HttpModelProvider<ModelRequestOptions, unknown, infer U>
    ? U
    : never;
