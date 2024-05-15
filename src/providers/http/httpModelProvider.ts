import type { HttpClient, ModelApi, ModelRequestOptions } from "../../typeDefs";

import { AuthStrategy, EndpointStrategy, HeadersStrategy } from "./typeDefs";

import { BaseHttpModelProvider } from "./baseHttpModelProvider";

interface HttpModelProviderConstructorParams<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
> {
  api: ModelApi<TRequestOptions, TResponse>;
  modelId: string;
  client?: HttpClient;
  endpoint: EndpointStrategy;
  headers: HeadersStrategy;
  auth: AuthStrategy;
}

export class HttpModelProvider<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
> extends BaseHttpModelProvider<TRequestOptions, TResponse> {
  private endpoint: EndpointStrategy;

  private headers: HeadersStrategy;

  private auth: AuthStrategy;

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
    return this.api.requestTemplate.render(options);
  }

  protected getHeaders(options: TRequestOptions) {
    return this.headers.getHeaders(options, this.config);
  }

  protected applyAuth(
    options: TRequestOptions,
    endpoint: string,
    body: string,
    headers: Record<string, string>,
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
