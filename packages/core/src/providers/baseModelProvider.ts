import type {
  MakeOptional,
  ModelApi,
  ModelId,
  ModelProvider,
  ModelRequestOptions,
} from "../typeDefs";

// TODO Rename "ModelProviderConfig"
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
> implements ModelProvider<TRequestOptions, TResponse>
{
  public readonly api: ModelApi<TRequestOptions, TResponse>;

  public readonly config: TModelProviderConfig;

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
  ): Promise<unknown>;

  async sendRequest(
    options: MakeOptional<TRequestOptions, "modelId">,
  ): Promise<TResponse> {
    // tsc doesn't automatically deduce that merging the spread of options with modelId satisfies TRequestOptions
    // logically we know it does, so this typecasting is necessary and safe:
    const requestOptions = {
      ...options,
      modelId: options.modelId ?? this.config.modelId,
    } as TRequestOptions;

    const data = await this.dispatchRequest(requestOptions);

    if (!this.api.responseGuard(data)) {
      // TODO get error message describing why the response was rejected:
      throw new Error("Unexpected response from model provider");
    }

    return data;
  }
}
