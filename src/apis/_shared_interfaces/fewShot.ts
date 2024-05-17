// import { Template } from "../../utils/template";

// import type { ModelRequestOptions } from "../../typeDefs";

// const templateSource = `{
//   {{ system | safe }}

//   EXAMPLES:

//   {% for pair in examplePairs %}
//   User:
//   {{ pair.user | safe }}
//   Assistant:
//   {{ pair.assistant | safe }}
//   {% endfor %}

//   User:
//   {{ prompt | safe }}
//   Assistant:
// }`;

export interface FewShotRequestOptions {
  system?: string;
  examplePairs?: { user: string; assistant: string }[];
}

// export const FewShotTemplate = new Template<
//   FewShotRequestOptions & ModelRequestOptions
// >(templateSource);
