import { Template } from "../../utils/template";

// import type { ModelRequestOptions } from "../../typeDefs";

const templateSource = `<% if (typeof system !== 'undefined') { %>
  INSTRUCTIONS:
  <%= system %>
  <% } %>

  <% (typeof examplePairs !== 'undefined' ? examplePairs : []).forEach(pair => {
  User:
  <%= pair.user %>
  Assistant:
  <%= pair.assistant %>
  }) %>

  User:
  <%= prompt %>
  Assistant:
`;

export interface FewShotRequestOptions {
  prompt: string;
  system?: string;
  examplePairs?: { user: string; assistant: string }[];
}

export const FewShotPromptTemplate = new Template<FewShotRequestOptions>(
  templateSource,
);
