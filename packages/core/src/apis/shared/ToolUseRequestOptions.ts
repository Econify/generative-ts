interface ToolParameter {
  name: string;
  description: string;
  type: "STR" | "INT" | "BOOL";
}

interface ToolDescription {
  name: string;
  description: string;
  parameters: ToolParameter[];
}

export interface ToolUseRequestOptions {
  $toolDescriptions?: ToolDescription[];
}
