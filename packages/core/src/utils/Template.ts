import type { Template } from "@typeDefs";

type RenderFn<TVars> = (context: TVars) => string;

/**
 * Implementation of the Template interface using a ts function
 *
 * @category Core Implementations
 */
export class FnTemplate<TVars extends object> implements Template<TVars> {
  public readonly source: RenderFn<TVars>;

  constructor(renderFn: RenderFn<TVars>) {
    this.source = renderFn;
  }

  render(context: TVars): string {
    return this.source(context);
  }
}
