import { setupWorker } from "msw/browser";
import { handlers } from "@/lib/msw/handlers";

export const worker = setupWorker(...handlers);
