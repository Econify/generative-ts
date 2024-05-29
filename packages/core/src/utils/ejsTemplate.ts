import { render } from "ejs";

import type { Template } from "../typeDefs";

/**
 * Implementation of the Template interface using the EJS templating engine, used by built-in APIs.
 *
 * @category Core Implementations
 */
export class EjsTemplate<TVars extends object> implements Template<TVars> {
  public readonly source: string;

  constructor(templateSource: string) {
    this.source = templateSource;
  }

  render(context: TVars): string {
    return render(this.source, context);
  }
}
