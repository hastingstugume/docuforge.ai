import { expect, test } from "@playwright/test";

test("login redirects to dashboard", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email address").fill("test@company.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in to Dashboard" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Welcome to DocuForge" })).toBeVisible();
});
