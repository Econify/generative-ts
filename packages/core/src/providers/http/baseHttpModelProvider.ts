import type { HttpClient, ModelApi, ModelRequestOptions } from "../../typeDefs";

import { getClient } from "../../utils/httpClient";

import {
  BaseModelProvider,
  BaseModelProviderConfig,
} from "../baseModelProvider";

export abstract class BaseHttpModelProvider<
  TRequestOptions extends ModelRequestOptions,
  TResponse = unknown,
  TConfig extends BaseModelProviderConfig = BaseModelProviderConfig,
> extends BaseModelProvider<TRequestOptions, TResponse, TConfig> {
  public readonly client: HttpClient;

  constructor({
    api,
    config,
    client,
  }: {
    api: ModelApi<TRequestOptions, TResponse>;
    config: TConfig;
    client?: HttpClient;
  }) {
    super({
      api,
      config,
    });

    try {
      this.client = client ?? getClient();
    } catch (_e: unknown) {
      const e = _e as Error;
      throw new Error(
        `Error during ModelProvider initialization when attempting to load built-in HttpClient: ${e.message}. To avoid loading the built-in HttpClient, pass a custom HttpClient implementation as \`client\` to the ModelProvider constructor.`,
      );
    }
  }
}
