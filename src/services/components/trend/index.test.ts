import { MOCK_ENV } from "@/__test__";
import app from "@/index";
import { getTrendComponents } from "@/services/components/trend";
import { createMockTrendComponent } from "@/services/components/trend/fixture";

describe("API RDB Test Trend", () => {
  describe("getTrendComponents", async () => {
    type Res = Awaited<ReturnType<typeof getTrendComponents>>;
    test("draft = true not get", async () => {
      await createMockTrendComponent({ draft: true });

      const res = await app.request("/components/trend", {}, MOCK_ENV);

      expect(res.status).toBe(200);

      const components = (await res.json()) as Res;

      expect(components.length).toBe(0);
    });

    test("draft = false get trend", async () => {
      const { category } = await createMockTrendComponent({
        draft: false,
        length: 10,
      });

      const res = await app.request(
        `/components/trend?category=${category.name}`,
        {},
        MOCK_ENV
      );

      expect(res.status).toBe(200);
      const components = (await res.json()) as Res;

      expect(components.length).toBe(10);

      components.forEach((component, i) => {
        if (i === 0) return;

        const prevComponent = components[i - 1];

        const prevWeight = Number(prevComponent.weight);
        const weight = Number(component.weight);

        expect(weight).toBeLessThanOrEqual(prevWeight);
      });
    });
  });
});
