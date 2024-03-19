import { Extension } from "@/types/extension";

type Input<T> = {
  id: string;
  userId: string | null;
  username: string | null;
  image: string | null;
  extension: Extension;
} & T;

type GroupedComponent<T> = {
  id: string;
  creator: {
    id: string | null;
    name: string | null;
    image: string | null;
  };
  extensions: { extension: Extension }[];
} & Omit<T, "userId" | "username" | "image" | "extension" | "id">;

export const toGroupComponent = <T>(
  input: Input<T>[]
): GroupedComponent<T>[] => {
  const grouped = input.reduce(
    (acc, cur) => {
      const { id, userId, username, image, extension, ...rest } = cur;
      const find = acc[id];

      if (find) {
        find.extensions.push({ extension });

        return acc;
      }
      acc[id] = {
        id,
        creator: {
          id: userId,
          name: username,
          image,
        },
        extensions: [{ extension }],
        ...rest,
      };

      return acc;
    },
    {} as Record<string, GroupedComponent<T>>
  );

  return Object.values(grouped);
};
