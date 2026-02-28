let isWorkerStarted = false;

export function isMockingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_API_MOCKING === "enabled";
}

export async function initializeMocking(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  if (!isMockingEnabled() || isWorkerStarted) {
    return;
  }

  const { worker } = await import("@/lib/msw/browser");
  await worker.start({
    onUnhandledRequest: "bypass",
  });
  isWorkerStarted = true;
}
