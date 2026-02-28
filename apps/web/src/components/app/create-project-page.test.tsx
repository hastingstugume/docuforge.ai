import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateProjectPage } from "@/components/app/create-project-page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

function renderCreateProjectPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <CreateProjectPage />
    </QueryClientProvider>,
  );
}

describe("CreateProjectPage", () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it("validates required fields before submit", async () => {
    renderCreateProjectPage();

    fireEvent.click(screen.getByRole("button", { name: /Create Project/i }));

    expect(await screen.findByText("Project name must be at least 2 characters.")).toBeInTheDocument();
    expect(
      screen.getByText("Project description must be at least 5 characters."),
    ).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("creates a project and redirects to overview", async () => {
    renderCreateProjectPage();

    fireEvent.change(screen.getByLabelText("Project Name"), { target: { value: "Nebula API Gateway" } });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: {
        value: "Core infrastructure documentation for the centralized API management and routing layer.",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Project/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledTimes(1);
    });

    const [route] = pushMock.mock.calls[0] as [string];
    expect(route).toMatch(/^\/dashboard\/.+/);
  });
});
