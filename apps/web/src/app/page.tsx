import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F4F6FA]">
      <Container>
        <Section className="py-20">
          <PageHeader
            title="DocuForge UI Baseline"
            subtitle="Day 1 foundation with Tailwind tokens + shadcn-style primitives."
            actions={<Button>Primary Button</Button>}
          />
        </Section>
      </Container>
    </main>
  );
}
