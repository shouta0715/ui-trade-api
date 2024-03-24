import { MOCK_ENV } from "@/__test__";
import app from "@/index";
import { getRankingComponents } from "@/services/components/ranking";
import { createMockPopularComponent } from "@/services/components/ranking/fixtures";

describe("API RDB Test Trend", () => {
  describe("getTrendComponents", async () => {
    type Res = Awaited<ReturnType<typeof getRankingComponents>>;

    test("rankings ", async () => {
      await createMockPopularComponent({ draft: false, length: 10 });
      const url = `/components/rankings?limit=10&offset=0`;

      const res = await app.request(url.toString(), {}, MOCK_ENV);

      expect(res.status).toBe(200);
      const components = (await res.json()) as Res;

      expect(components.length).toBe(10);

      components.forEach((component, i) => {
        if (i === 0) return;

        const prevComponent = components[i - 1];

        const prevWeight = Number(prevComponent.count);
        const weight = Number(component.count);

        expect(weight).toBeLessThanOrEqual(prevWeight);
      });
    });
  });
});
