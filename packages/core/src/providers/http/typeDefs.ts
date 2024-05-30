import type {
  Body,
  Endpoint,
  Headers,
  ModelRequestOptions,
} from "../../typeDefs";

export interface EndpointStrategy<
  TRequestOptions extends ModelRequestOptions = ModelRequestOptions,
  TModelProviderConfig = unknown,
> {
  getEndpoint(
    options: TRequestOptions,
    config: TModelProviderConfig,
  ): Promise<Endpoint> | Endpoint;
}

export interface HeadersStrategy<
  TRequestOptions extends ModelRequestOptions = ModelRequestOptions,
  TModelProviderConfig = unknown,
> {
  getHeaders(
    options: TRequestOptions,
    config: TModelProviderConfig,
  ): Promise<Headers> | Headers;
}

export interface AuthStrategy<
  TRequestOptions extends ModelRequestOptions = ModelRequestOptions,
  TModelProviderConfig = unknown,
> {
  applyAuth(params: {
    options: TRequestOptions;
    config: TModelProviderConfig;
    endpoint: Endpoint;
    body: Body;
    headers: Headers;
  }):
    | Promise<{
        endpoint: Endpoint;
        body: Body;
        headers: Headers;
      }>
    | {
        endpoint: Endpoint;
        body: Body;
        headers: Headers;
      };
}

export function isEndpointStrategy(obj: unknown): obj is EndpointStrategy {
  return (obj as EndpointStrategy)?.getEndpoint instanceof Function;
}

export function isHeadersStrategy(obj: unknown): obj is HeadersStrategy {
  return (obj as HeadersStrategy)?.getHeaders instanceof Function;
}
