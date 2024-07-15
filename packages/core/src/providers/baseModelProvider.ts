import type {
  MakeOptional,
  ModelApi,
  ModelId,
  ModelProvider,
  ModelRequestOptions,
} from "@typeDefs";

export interface BaseModelProviderConfig {
  modelId: ModelId;
}

/**
 * @category Core Implementations
 */
export abstract class BaseModelProvider<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
  TModelProviderConfig extends
    BaseModelProviderConfig = BaseModelProviderConfig,
  TMetaOptions = unknown,
> implements ModelProvider<TRequestOptions, TResponse>
{
  public readonly api: ModelApi<TRequestOptions, TResponse>;

  public readonly config: TModelProviderConfig;

  public readonly history: {
    options: TRequestOptions;
    meta: TMetaOptions | undefined;
    response: TResponse | undefined;
  }[] = [];

  constructor({
    api,
    config,
  }: {
    api: ModelApi<TRequestOptions, TResponse>;
    config: TModelProviderConfig;
  }) {
    this.api = api;
    this.config = config;
  }

  protected abstract dispatchRequest(
    options: TRequestOptions,
    meta?: TMetaOptions,
  ): Promise<unknown>;

  async sendRequest(
    options: MakeOptional<TRequestOptions, "modelId">,
    meta?: TMetaOptions,
  ): Promise<TResponse> {
    // tsc doesn't automatically deduce that merging the spread of options with modelId satisfies TRequestOptions
    // logically we know it does, so this typecasting is necessary and safe:
    const fullOptions = {
      ...options,
      modelId: options.modelId ?? this.config.modelId,
    } as TRequestOptions;

    const data = await this.dispatchRequest(fullOptions, meta);

    if (!this.api.responseGuard(data)) {
      this.history.push({
        options: fullOptions,
        meta,
        response: undefined,
      });

      // TODO get error message describing why the response was rejected:
      throw new Error("Unexpected response from model provider");
    }

    this.history.push({
      options: fullOptions,
      meta,
      response: data,
    });

    return data;
  }
}
