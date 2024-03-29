type GroupedPopularCategory = {
  name: string;
  description: string | null;
  count: number;
  components: {
    previewUrl: string;
    id: string;
  };
};

type Input<T> = {
  categories: {
    name: string;
    description: string | null;
    count: number;
  }[];
  components: ({
    categoryName: string;
    previewUrl: string;
    id: string;
  } & T)[];
};

export const toGroupPopularCategories = <T>(
  input: Input<T>
): GroupedPopularCategory[] => {
  const grouped = input.categories.reduce(
    (acc, cur) => {
      const { name, description, count } = cur;
      const find = acc[name];

      if (find) return acc;

      const components = input.components.filter(
        (component) => component.categoryName === name
      )[0];

      acc[name] = {
        name,
        description,
        count,
        components,
      };

      return acc;
    },
    {} as Record<string, GroupedPopularCategory>
  );

  return Object.values(grouped);
};
