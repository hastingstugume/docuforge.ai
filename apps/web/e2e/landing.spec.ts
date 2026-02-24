import { expect, test } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Technical\s+documentation\s+redefined\./i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Features" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Get Started Free" })).toBeVisible();
});
