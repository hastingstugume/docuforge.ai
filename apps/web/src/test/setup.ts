import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { resetMockData } from "@/lib/msw/handlers";
import { server } from "@/lib/msw/server";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  resetMockData();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
