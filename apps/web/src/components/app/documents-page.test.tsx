import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DocumentsPage } from "@/components/app/documents-page";

function renderDocumentsPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <DocumentsPage />
    </QueryClientProvider>,
  );
}

describe("DocumentsPage", () => {
  it("renders documents from API hooks", async () => {
    renderDocumentsPage();

    expect(await screen.findByText("API Reference v2.0")).toBeInTheDocument();
    expect(await screen.findByText("System Architecture Design")).toBeInTheDocument();
    expect(screen.getByText(/Showing 1-5 of 5 documents/)).toBeInTheDocument();
  });

  it("filters documents by search and status", async () => {
    renderDocumentsPage();
    await screen.findByText("API Reference v2.0");

    const searchInput = screen.getByPlaceholderText("Search by title, summary, or content...");
    fireEvent.change(searchInput, { target: { value: "security" } });

    expect(await screen.findByText("Security & Compliance Audit")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("API Reference v2.0")).not.toBeInTheDocument();
    });

    const statusSelect = screen.getByRole("combobox", { name: "All Status" });
    fireEvent.change(statusSelect, { target: { value: "published" } });
    expect(await screen.findByText("No documents found.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear Filters" }));
    expect(await screen.findByText("API Reference v2.0")).toBeInTheDocument();
  });
});
