import { Template } from "../../utils/template";

import type { ModelRequestOptions } from "../../typeDefs";

export interface FewShotRequestOptions {
  system?: string;
  examplePairs?: { user: string; assistant: string }[];
}

const templateSource = `{
  {{ system | safe }}

  EXAMPLES:

  {% for pair in examplePairs %}
  User:
  {{ pair.user | safe }}
  Assistant:
  {{ pair.assistant | safe }}
  {% endfor %}

  User:
  {{ prompt | safe }}
  Assistant:
}`;

export interface BasicFewShotRequestOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {}

export const FewShotTemplate = new Template<BasicFewShotRequestOptions>(
  templateSource,
);
