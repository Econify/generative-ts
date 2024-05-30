import type { ModelRequestOptions } from "../../typeDefs";

export type Endpoint = string;
export type Body = string;
export type Headers = Record<string, string | ReadonlyArray<string>>;

export interface EndpointStrategy {
  getEndpoint<TRequestOptions extends ModelRequestOptions, TConfig>(
    options: TRequestOptions,
    config: TConfig,
  ): Promise<Endpoint> | Endpoint;
}

export interface HeadersStrategy {
  getHeaders<TRequestOptions extends ModelRequestOptions, TConfig>(
    options: TRequestOptions,
    config: TConfig,
  ): Promise<Headers> | Headers;
}

export interface AuthStrategy {
  applyAuth<TRequestOptions extends ModelRequestOptions, TConfig>(params: {
    options: TRequestOptions;
    config: TConfig;
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
