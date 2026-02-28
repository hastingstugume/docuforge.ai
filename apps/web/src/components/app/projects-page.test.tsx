import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProjectsPage } from "@/components/app/projects-page";

function renderProjectsPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ProjectsPage />
    </QueryClientProvider>,
  );
}

describe("ProjectsPage", () => {
  it("renders seeded projects from API hooks", async () => {
    renderProjectsPage();

    expect(await screen.findByRole("heading", { name: "Nexus API Gateway" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "CloudScale Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("6 Total")).toBeInTheDocument();
  });

  it("filters projects and supports resetting empty state", async () => {
    renderProjectsPage();

    await screen.findByRole("heading", { name: "Nexus API Gateway" });
    const [statusSelect] = screen.getAllByRole("combobox");

    fireEvent.change(statusSelect, { target: { value: "archived" } });
    expect(await screen.findByRole("heading", { name: "Legacy Migration Docs" })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "Nexus API Gateway" })).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Filter projects by name, tags, or technology...");
    fireEvent.change(searchInput, { target: { value: "does-not-exist" } });

    expect(await screen.findByText("No projects found")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset Filters" }));

    expect(await screen.findByRole("heading", { name: "Nexus API Gateway" })).toBeInTheDocument();
  });

  it("links create CTAs to the new project route", async () => {
    renderProjectsPage();

    await screen.findByRole("heading", { name: "Nexus API Gateway" });

    const topCta = screen.getByRole("link", { name: "New Project" });
    expect(topCta).toHaveAttribute("href", "/dashboard/new");

    const createCardCta = screen.getByRole("link", { name: /Create New Project/i });
    expect(createCardCta).toHaveAttribute("href", "/dashboard/new");
  });

  it("deletes a project from card actions", async () => {
    renderProjectsPage();

    await screen.findByRole("heading", { name: "Nexus API Gateway" });
    fireEvent.click(screen.getByLabelText("Project actions for Nexus API Gateway"));
    fireEvent.click(screen.getByRole("button", { name: "Delete project Nexus API Gateway" }));
    expect(screen.getByRole("heading", { name: "Delete Project" })).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: "Confirm Delete" });
    expect(confirmButton).toBeDisabled();

    const confirmationInput = screen.getByLabelText("Confirm project name");
    fireEvent.change(confirmationInput, { target: { value: "Nexus API Gateway" } });
    expect(confirmButton).not.toBeDisabled();
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "Nexus API Gateway" })).not.toBeInTheDocument();
    });
    expect(screen.getByText("5 Total")).toBeInTheDocument();
  });
});
