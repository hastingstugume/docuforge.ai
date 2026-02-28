import { setupServer } from "msw/node";
import { handlers } from "@/lib/msw/handlers";

export const server = setupServer(...handlers);
