import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ROUTES } from "./routes";

test.use({ reducedMotion: "reduce" });

for (const route of ROUTES) {
  test(`${route} has no serious axe violations`, async ({ page }) => {
    await page.goto(route);
    // reveal everything (in-view fades) and let it settle before measuring contrast
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 500) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(1200);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(
      serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`),
    ).toEqual([]);
  });
}
