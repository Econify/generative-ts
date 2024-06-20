import { ToolDescriptor, ToolParam, ToolParameterTypes } from "@typeDefs";

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

export class Tool<TParamMap extends ToolParamMap, TReturns = unknown> {
  private invokeFn: (
    args: ConvertParamMapToArgs<TParamMap>,
  ) => TReturns | Promise<TReturns>;

  public descriptor: ToolDescriptor<ConvertParamMapToArgs<TParamMap>, TReturns>;

  constructor(
    name: string,
    description: string,
    paramMap: TParamMap,
    invokeFn: (
      args: ConvertParamMapToArgs<TParamMap>,
    ) => TReturns | Promise<TReturns>,
  ) {
    this.descriptor = {
      name,
      description,
      parameters: this.createParameters(paramMap),
      invocations: [],
    };
    this.invokeFn = invokeFn;
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

  public addInvocation(args: ConvertParamMapToArgs<TParamMap>) {
    this.descriptor.invocations.push({
      arguments: args,
      resolved: false,
    });
  }

  public hasUnresolved(): boolean {
    return this.descriptor.invocations.some(
      (invocation) => !invocation.resolved,
    );
  }

  public async resolveAll(): Promise<Array<TReturns>> {
    const invocations = await Promise.all(
      this.descriptor.invocations.map(async (invocation) => {
        if (invocation.resolved) {
          return invocation;
        }
        const returned = await this.invokeFn(invocation.arguments);
        return {
          ...invocation,
          returned,
          resolved: true,
        };
      }),
    );

    this.descriptor.invocations = invocations;

    return invocations.map(({ returned }) => returned);
  }
}

// return {
//   ...invocation,
//   returned,
//   resolved: true,
// };

// export const a = new Tool(
//   "get_current_weather",
//   "Get the current weather for a given location",
//   {
//     city: {
//       description: "The city name",
//       type: "STR",
//       required: true,
//     },
//     state: {
//       description: "The state name",
//       type: "STR",
//       required: true,
//     },
//     zipcode: {
//       description: "An optional zipcode",
//       type: "NUM",
//       required: false,
//     },
//   },
//   // should work:
//   ({ city, state, zipcode }) => {
//     console.log("Invoking get_current_weather tool...", {
//       city,
//       state,
//       zipcode,
//     });
//     return {
//       temperature: "70",
//     };
//   },
// );

// good:
// a.invoke({ city: "San Francisco", state: "CA" });
// a.invoke({ city: "San Francisco", state: "CA", zipcode: 94105 });

// bad:
// a.invoke({ city: "San Francisco" });
// a.invoke({ city: "San Francisco", state: "CA", zipcode: 94105, xxx: "yyy" });
// a.invoke({ city: "San Francisco", state: 123 });

// export const x1 = new Tool(
//   "get_current_weather",
//   "Get the current weather for a given location",
//   {
//     city: {
//       description: "The city name",
//       type: "STR",
//       required: true,
//     },
//     state: {
//       description: "The state name",
//       type: "STR",
//       required: true,
//     },
//     zipcode: {
//       description: "An optional zipcode",
//       type: "NUM",
//       required: false,
//     },
//   },
//   // should break, prop not defined:
//   ({ city, state, zipcode, xxx }) => {
//     console.log("Invoking get_current_weather tool...", {
//       city,
//       state,
//       zipcode,
//       xxx,
//     });
//     return {
//       temperature: "70",
//     };
//   },
// );
