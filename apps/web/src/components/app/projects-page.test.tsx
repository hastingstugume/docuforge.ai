import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProjectsPage } from "@/components/app/projects-page";

describe("ProjectsPage", () => {
  it("renders seeded projects from API hooks", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ProjectsPage />
      </QueryClientProvider>,
    );

    expect(await screen.findByRole("heading", { name: "Nexus API Gateway" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "CloudScale Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("6 Total")).toBeInTheDocument();
  });
});
