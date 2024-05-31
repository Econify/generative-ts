import { null as tNull, undefined as tUndefined, union } from "io-ts";

import type { Mixed } from "io-ts";

export function nullable(x: Mixed) {
  return union([x, tNull, tUndefined]);
}
