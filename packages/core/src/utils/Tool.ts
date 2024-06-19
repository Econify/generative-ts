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

export const a = new Tool(
  "get_current_weather",
  "Get the current weather for a given location",
  {
    city: {
      description: "The city name",
      type: "STR",
      required: true,
    },
    state: {
      description: "The state name",
      type: "STR",
      required: true,
    },
    zipcode: {
      description: "An optional zipcode",
      type: "NUM",
      required: false,
    },
  },
  // should work:
  ({ city, state, zipcode }) => {
    console.log("Invoking get_current_weather tool...", {
      city,
      state,
      zipcode,
    });
    return {
      temperature: "70",
    };
  },
);

a.invoke({ city: "San Francisco", state: "CA" });
a.invoke({ city: "San Francisco", state: "CA", zipcode: 94105 });

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
