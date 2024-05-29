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

/**
 * @category Core Interfaces
 */
export interface HttpClient {
  post(
    endpoint: string,
    body: string,
    headers: Record<string, string>,
  ): Promise<unknown>;
}

// Makes props in K optional in T.
// The resulting type is "looser," so does NOT satisfy T, but if you add all props from K to an object of the resulting type, you logically satisfy T
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
