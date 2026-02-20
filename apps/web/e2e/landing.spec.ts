import { expect, test } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Technical documentation redefined." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Problem" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Get Started Free" })).toBeVisible();
});
