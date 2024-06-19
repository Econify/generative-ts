type ToolParameterTypes = "STR" | "NUM" | "BOOL";

export type ToolParamMap = {
  [key: string]: {
    description: string;
    type: ToolParameterTypes;
    required: boolean;
  };
};

type ExtractArgumentType<T extends ToolParameterTypes> = T extends "STR"
  ? string
  : T extends "NUM"
    ? number
    : T extends "BOOL"
      ? boolean
      : never;

export type ConvertParamMapToArgs<TParamMap extends ToolParamMap> = {
  [K in keyof TParamMap as TParamMap[K]["required"] extends true
    ? K
    : never]: ExtractArgumentType<TParamMap[K]["type"]>;
} & {
  [K in keyof TParamMap as TParamMap[K]["required"] extends false | undefined
    ? K
    : never]?: ExtractArgumentType<TParamMap[K]["type"]>;
};

/*
 *  Ifaces
 */
interface ToolParam {
  name: string;
  description: string;
  type: ToolParameterTypes;
  required: boolean;
}

interface ToolInvocation<TArgs> {
  arguments: TArgs;
  returned?: unknown;
}

interface ToolDescriptor {
  name: string;
  description: string;
  parameters: ToolParam[];
  invocations: ToolInvocation<any>[];
}

export class Tool<TParamMap extends ToolParamMap, TReturns = unknown> {
  private invokeFn: (args: ConvertParamMapToArgs<TParamMap>) => TReturns;

  public descriptor: ToolDescriptor;

  constructor(
    name: string,
    description: string,
    paramMap: TParamMap,
    invokeFn: (args: ConvertParamMapToArgs<TParamMap>) => TReturns,
  ) {
    this.invokeFn = invokeFn;
    this.descriptor = {
      name,
      description,
      parameters: this.createParameters(paramMap),
      invocations: [],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private createParameters(paramMap: TParamMap): ToolParam[] {
    return Object.entries(paramMap).map(([name, paramInfo]) => ({
      name,
      description: paramInfo.description,
      type: paramInfo.type,
      required: paramInfo.required,
    }));
  }

  public invoke(args: ConvertParamMapToArgs<TParamMap>): TReturns {
    const returned = this.invokeFn(args);

    this.descriptor.invocations.push({
      arguments: args,
      returned,
    });

    return returned;
  }
}

/**
 * @category Core Interfaces
 */
export interface ToolUseRequestOptions {
  $tools?: ToolDescriptor[];
}
