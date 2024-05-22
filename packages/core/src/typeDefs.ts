export interface Template<TVars> {
  source: string;
  render(context: TVars): string;
}

export type ModelId = string;

export interface ModelRequestOptions {
  modelId: ModelId;
  prompt: string;
}

export interface ModelApi<
  TRequestOptions extends ModelRequestOptions = ModelRequestOptions,
  TResponse = unknown,
> {
  requestTemplate: Template<TRequestOptions>;
  responseGuard: (response: unknown) => response is TResponse;
}

export interface ModelProvider<
  TRequestOptions extends ModelRequestOptions = ModelRequestOptions,
  TResponse = unknown,
> {
  sendRequest(options: TRequestOptions): Promise<TResponse>;
}

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
