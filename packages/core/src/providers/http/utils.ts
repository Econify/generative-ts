export function escape<T>(obj: object) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
      return {
        ...acc,
        [key]: value.replace(/\n/g, "\\n"),
      };
    }
    return {
      ...acc,
      [key]: value as unknown,
    };
  }, {} as T);
}
