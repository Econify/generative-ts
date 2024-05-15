import type { ModelRequestOptions } from "../../typeDefs";

export interface EndpointStrategy {
  getEndpoint<TRequestOptions extends ModelRequestOptions, TConfig>(
    options: TRequestOptions,
    config: TConfig,
  ): Promise<string> | string;
}

export interface HeadersStrategy {
  getHeaders<TRequestOptions extends ModelRequestOptions, TConfig>(
    options: TRequestOptions,
    config: TConfig,
  ): Promise<Record<string, string>> | Record<string, string>;
}

export interface AuthStrategy {
  applyAuth<TRequestOptions extends ModelRequestOptions, TConfig>(params: {
    options: TRequestOptions;
    config: TConfig;
    endpoint: string;
    body: string;
    headers: Record<string, string>;
  }):
    | Promise<{
        endpoint: string;
        body: string;
        headers: Record<string, string>;
      }>
    | {
        endpoint: string;
        body: string;
        headers: Record<string, string>;
      };
}

export function isEndpointStrategy(obj: unknown): obj is EndpointStrategy {
  return (obj as EndpointStrategy)?.getEndpoint instanceof Function;
}

export function isHeadersStrategy(obj: unknown): obj is HeadersStrategy {
  return (obj as HeadersStrategy)?.getHeaders instanceof Function;
}
