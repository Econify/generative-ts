import {
  intersection,
  partial,
  null as tNull,
  undefined as tUndefined,
  type,
  union,
} from "io-ts";

import type { Mixed, Props } from "io-ts";

/**
 * Makes `x` nullable by adding it to a union type with `null` and `undefined`
 *
 * @param {Mixed} x - The type to make nullable.
 * @returns {Mixed} A union type of the provided type, `null`, and `undefined`.
 */
export function nullable(x: Mixed) {
  return union([x, tNull, tUndefined]);
}

/**
 * Creates a composite type from required and optional properties.
 *
 * @param {Object} params - The parameters object.
 * @param {Props} params.required - The required properties.
 * @param {Props} params.partial - The optional properties.
 * @returns {Mixed} An intersection type with required and optional properties.
 */
export function composite({
  required,
  partial: optional,
}: {
  required: Props;
  partial: Props;
}) {
  return intersection([type(required), partial(optional)]);
}
