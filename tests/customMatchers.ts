declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchApiSnapshot(): R;
    }
  }
}

type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  /* eslint-disable-next-line no-use-before-define */
  | SerializableObject
  /* eslint-disable-next-line no-use-before-define */
  | SerializableArray;

interface SerializableObject {
  [key: string]: Serializable;
}
interface SerializableArray extends Array<Serializable> {}

const isObject = (value: unknown): value is SerializableObject => {
  return value !== undefined && value !== null && typeof value === "object";
};

export const serializeApiStructure = (value: unknown): Serializable => {
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return [serializeApiStructure(value[0])]; // value.map((item) => serializeStructure(item));
  }
  if (isObject(value)) {
    const result: SerializableObject = {};
    Object.keys(value).forEach((key) => {
      result[key] = serializeApiStructure(value[key]);
    });
    return result;
  }
  return typeof value;
};

expect.extend({
  toMatchApiSnapshot(received: unknown) {
    const serialized = serializeApiStructure(received);

    try {
      expect(serialized).toMatchSnapshot();
      return {
        pass: true,
        message: () =>
          `expected ${received as string} not to match API structure, but it did.`,
      };
    } catch (error) {
      return {
        pass: false,
        message: () =>
          `expected ${received as string} to match API structure, but it did not. ${error as string}`,
      };
    }
  },
});
