import { MOCK_ENV } from "@/__test__";
import { toGroupComponentWithFiles } from "@/domain/components/to-group";
import app from "@/index";
import { getPreviewComponents } from "@/services/components/previews";
import { createMockComponent } from "@/services/components/previews/fixture";

describe("GET Component RDB Test / previews", async () => {
  describe("getPreviewComponent", async () => {
    type GetPreview = Awaited<ReturnType<typeof getPreviewComponents>>[0];
    type Res = ReturnType<typeof toGroupComponentWithFiles<GetPreview>>[0];
    test("success", async () => {
      const { components } = await createMockComponent({
        draft: false,
        length: 1,
      });

      const res = await app.request(
        `/components/${encodeURIComponent(components[0].id)}`,
        {},
        MOCK_ENV
      );

      expect(res.status).toBe(200);

      const component = (await res.json()) as Res;

      expect(component.id).toBe(components[0].id);
      expect(component.creator.id).toBe(components[0].creatorId);
      expect(component.creator.id).toBe(components[0].creatorId);
      expect(component.count).toBe(1);
      expect(component.files).toHaveLength(1);
      expect(component.categoryName).toBe(components[0].categoryName);
    });
  });
});
