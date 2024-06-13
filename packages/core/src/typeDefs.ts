/**
 * @category Core Interfaces
 */
export interface Template<TVars> {
  source: string;
  render(context: TVars): string;
}

/**
 * @category Core Interfaces
 */
export type ModelId = string;

/**
 * @category Core Interfaces
 */
export interface ModelRequestOptions {
  modelId: ModelId;
  prompt: string;
}

/**
 * @category Core Interfaces
 */
export interface ModelApi<
  TRequestOptions extends ModelRequestOptions = ModelRequestOptions,
  TResponse = unknown,
> {
  name?: string;
  requestTemplate: Template<TRequestOptions>;
  responseGuard: (response: unknown) => response is TResponse;
}

/**
 * @category Core Interfaces
 */
export interface ModelProvider<
  TRequestOptions extends ModelRequestOptions = ModelRequestOptions,
  TResponse = unknown,
> {
  sendRequest(options: TRequestOptions): Promise<TResponse>;
}

export type Endpoint = string;
export type Method = "POST";
export type Body = string;
export type Headers = Record<string, string | ReadonlyArray<string>>;

export interface HttpClientRequest {
  method: Method;
  body: Body;
  headers: Headers;
}

/**
 * HttpClient client interface, basically a simplified fetch()
 *
 * @category Core Interfaces
 */
export interface HttpClient<TCustomHttpClientRequestOptions = unknown> {
  fetch(
    endpoint: Endpoint,
    request: HttpClientRequest & TCustomHttpClientRequestOptions,
  ): Promise<unknown>;
}

// export interface HttpClient<TOptions = unknown> {
//   post(
//     endpoint: Endpoint,
//     body: Body,
//     headers: Headers,
//     options?: TOptions,
//   ): Promise<unknown>;
// }

// Makes props in K optional in T.
// The resulting type is "looser," so does NOT satisfy T, but if you add all props from K to an object of the resulting type, you logically satisfy T
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// Used by ModelProvider factory functions:
export type InferRequestOptions<T> =
  T extends ModelApi<infer U, unknown> ? U : never;
export type InferResponse<T> =
  T extends ModelApi<ModelRequestOptions, infer V> ? V : never;
export type InferHttpClientOptions<T> =
  T extends HttpClient<infer U> ? U : never;
