import { render } from "ejs";

import type { Template as ITemplate } from "../typeDefs";

export class Template<TVars extends object> implements ITemplate<TVars> {
  public readonly source: string;

  constructor(templateSource: string) {
    this.source = templateSource;
  }

  render(context: TVars): string {
    return render(this.source, context);
  }
}
