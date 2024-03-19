import { number, object, optional, toMaxValue, toMinValue } from "valibot";

export const paginationSchema = object({
  limit: optional(number([toMaxValue(50), toMinValue(1)])),
  offset: optional(number([toMinValue(0)])),
});

export const transformPagination = (limit?: string, offset?: string) => {
  return {
    limit: limit ? Number(limit) || 20 : 20,
    offset: offset ? Number(offset) : 0,
  };
};
