import { expect, test } from "@playwright/test";
import { ROUTES } from "./routes";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("lights-out", "1"));
});

for (const route of ROUTES) {
  test(`${route} returns 200, has one h1 and no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}

test("unknown route shows the DNF page", async ({ page }) => {
  const res = await page.goto("/this-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("DNF");
});

test("start lights play once and can be skipped with Escape", async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto("/");
  const skip = page.getByRole("button", { name: /skip intro/i });
  await expect(skip).toBeVisible({ timeout: 20_000 });
  await page.keyboard.press("Escape");
  await expect(skip).toBeHidden();
  await page.reload();
  await expect(page.getByRole("button", { name: /skip intro/i })).toHaveCount(0);
  await ctx.close();
});

test("contact form validates and submits", async ({ page }) => {
  await page.goto("/pit-wall");
  await page.getByRole("button", { name: /send radio message/i }).click();
  await expect(page.getByText(/name needs at least/i)).toBeVisible();
  await page.getByLabel("Name").fill("Test Driver");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Message").fill("This is a smoke test message.");
  await page.getByRole("button", { name: /send radio message/i }).click();
  await expect(page.getByText(/copy that, message received/i)).toBeVisible();
});
