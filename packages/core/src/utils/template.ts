import { compile, Template as NunjucksTemplate } from "nunjucks";

import type { Template as ITemplate } from "../typeDefs";

export class Template<TVars extends object> implements ITemplate<TVars> {
  private template: NunjucksTemplate;

  public readonly source: string;

  constructor(templateSource: string) {
    this.source = templateSource;

    this.template = compile(templateSource);
  }

  render(context: TVars): string {
    return this.template.render(context);
  }
}
