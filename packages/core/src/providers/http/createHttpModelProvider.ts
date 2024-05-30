import type {
  Endpoint,
  Headers,
  HttpClient,
  ModelApi,
  ModelRequestOptions,
} from "@typeDefs";

import {
  AuthStrategy,
  EndpointStrategy,
  HeadersStrategy,
  isEndpointStrategy,
  isHeadersStrategy,
} from "./typeDefs";

import {
  NoAuthStrategy,
  StaticEndpointStrategy,
  StaticHeadersStrategy,
} from "./strategies";

import { HttpModelProvider } from "./httpModelProvider";

type CreateHttpModelProviderParams<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
> = {
  api: ModelApi<TRequestOptions, TResponse>;
  modelId: string;
  client?: HttpClient;
  endpoint: Endpoint | EndpointStrategy;
  headers?: Headers | HeadersStrategy;
  auth?: AuthStrategy;
};

/**
 * @category Model Providers
 */
export function createHttpModelProvider<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
>(
  params: CreateHttpModelProviderParams<TRequestOptions, TResponse>,
): HttpModelProvider<TRequestOptions, TResponse> {
  const { api, modelId, client } = params;

  const endpointStrategy = !isEndpointStrategy(params.endpoint)
    ? new StaticEndpointStrategy(params.endpoint)
    : params.endpoint;

  const headersStrategy = !isHeadersStrategy(params.headers)
    ? new StaticHeadersStrategy(
        params.headers ?? { "Content-Type": "application/json" },
      )
    : params.headers;

  const authStrategy = params.auth ?? new NoAuthStrategy();

  return new HttpModelProvider({
    api,
    modelId,
    client,
    endpoint: endpointStrategy,
    headers: headersStrategy,
    auth: authStrategy,
  });
}
