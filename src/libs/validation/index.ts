import { BaseSchema, Input, parse, safeParse } from "valibot";

export function validate<T extends BaseSchema>(
  target: unknown,
  schema: T
): asserts target is Input<T> {
  parse(schema, target);
}

export const safeValidate = <T extends BaseSchema>(
  target: unknown,
  schema: T
) => {
  return safeParse<T>(schema, target);
};
