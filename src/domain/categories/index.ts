type GroupedCategory = {
  name: string;
  description: string | null;
  count: number;
  componentId: string;
  previewUrl: string;
  creator: {
    id: string | null;
    name: string | null;
    image: string | null;
  } | null;
};

type Input = {
  category: {
    name: string;
    description: string | null;
    count: number;
  };
  components: {
    categoryName: string;
    previewUrl: string;
    id: string;
    image: string | null;
    creatorId: string | null;
    creatorName: string | null;
  }[];
};

export const toGroupCategories = (input: Input): GroupedCategory => {
  const { category, components } = input;

  const first = components[0];

  const { creatorId, creatorName, image } = first;

  return {
    name: category.name,
    description: category.description,
    count: category.count,
    componentId: first.id,
    previewUrl: first.previewUrl,
    creator: creatorId ? { id: creatorId, name: creatorName, image } : null,
  };
};
