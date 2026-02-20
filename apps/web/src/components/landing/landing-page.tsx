import {
  ArrowRight,
  Check,
  ChevronRight,
  CirclePlay,
  Clock3,
  FileText,
  Gem,
  Heart,
  Orbit,
  Shield,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const features = [
  {
    title: "Guided Project Wizard",
    description:
      "Our AI engine walks you through structural blueprints, ensuring you never miss a critical section in your technical guides.",
    icon: WandSparkles,
  },
  {
    title: "Editable Structured Docs",
    description:
      "AI generates the heavy lifting; you refine the nuances. A powerful markdown-native editor with real-time AI suggestions.",
    icon: FileText,
  },
  {
    title: "Version Control",
    description:
      "Track every iteration. Roll back with one click or compare changes side-by-side using our built-in git-style versioning.",
    icon: Clock3,
  },
  {
    title: "Team Collaboration",
    description:
      "Live cursor editing, inline threads, and role-based permissions designed for technical writers and developers alike.",
    icon: Users,
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    suffix: "/mo",
    description: "Perfect for individual developers and side projects.",
    items: ["3 Projects", "Basic AI Generation", "Export to Markdown", "7 Day History", "Community Support"],
    cta: "Start Free",
  },
  {
    name: "Professional",
    price: "$29",
    suffix: "/mo",
    description: "Ideal for growing teams needing professional output.",
    items: [
      "Unlimited Projects",
      "Advanced AI Assistant",
      "PDF & DOCX Export",
      "Full Version Control",
      "API Documentation Sync",
      "Priority Support",
    ],
    cta: "Get Started",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Customized for massive organizations with compliance needs.",
    items: [
      "Single Sign-On (SSO)",
      "Custom LLM Training",
      "Advanced Security Audit",
      "SLA Guarantees",
      "Dedicated Account Manager",
      "Custom Branding",
    ],
    cta: "Contact Sales",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F3F5F9] text-[#171E2D]">
      <header className="border-b border-[#E7EBF2] bg-white/95">
        <Container className="flex h-14 items-center gap-6">
          <a href="#" className="flex items-center gap-2 text-sm font-extrabold text-[#1F6FEB]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#1F6FEB] text-[11px] text-white">◇</span>
            DocuForge AI
          </a>

          <nav aria-label="Main navigation" className="hidden items-center gap-7 text-[11px] font-medium text-[#5D6780] md:flex">
            <a className="transition-colors hover:text-[#1F6FEB]" href="#features">Features</a>
            <a className="transition-colors hover:text-[#1F6FEB]" href="#solutions">Solutions</a>
            <a className="transition-colors hover:text-[#1F6FEB]" href="#pricing">Pricing</a>
            <a className="transition-colors hover:text-[#1F6FEB]" href="#resources">Resources</a>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a
              href="/login"
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-[#2C3549] transition-colors hover:bg-[#F2F5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6FEB]/35"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="rounded-md bg-[#1F6FEB] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] transition hover:bg-[#1A60D3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6FEB]/35"
            >
              Sign up free
            </a>
          </div>
        </Container>
      </header>

      <Section className="pb-16 pt-12">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-[#E8F0FF] px-3 py-1 text-[11px] font-bold text-[#1F6FEB]">
              New: AI-Powered API Mapping
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] text-[#161D2C] md:text-6xl">
              Technical
              <br />
              documentation
              <br />
              <span className="italic text-[#1F6FEB]">redefined.</span>
            </h1>
            <p className="mt-5 max-w-[560px] text-lg leading-relaxed text-[#525E75]">
              Stop spending hours on manual updates. DocuForge AI automates your technical writing process from code to published docs in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/signup"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-[#1F6FEB] px-5 text-sm font-semibold text-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] transition hover:bg-[#1A60D3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6FEB]/35"
              >
                Get Started Free
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="/login"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-[#DCE3EE] bg-white px-5 text-sm font-semibold text-[#2D364B] transition hover:bg-[#F8FAFD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6FEB]/25"
              >
                <CirclePlay className="h-4 w-4" />
                See Demo
              </a>
            </div>
            <div className="mt-7 flex items-center gap-3 text-xs text-[#64708A]">
              <div className="flex -space-x-2">
                <span className="h-7 w-7 rounded-full border-2 border-white bg-[linear-gradient(140deg,#8ec0ff,#4d7ce8)]" />
                <span className="h-7 w-7 rounded-full border-2 border-white bg-[linear-gradient(140deg,#83b8ff,#356de3)]" />
                <span className="h-7 w-7 rounded-full border-2 border-white bg-[linear-gradient(140deg,#8fd2d1,#3d8b9a)]" />
              </div>
              Trusted by <span className="font-semibold text-[#1D263A]">2,500+</span> engineering teams worldwide.
            </div>
          </div>

            <div className="rounded-xl border border-[#DFE6F2] bg-white p-5 shadow-[0_22px_45px_-30px_rgba(24,42,86,0.45)]">
            <div className="mb-4 flex items-center justify-between rounded-md bg-[#F4F7FC] px-3 py-1.5 text-[10px] text-[#75829A]">
              <span className="h-2 w-2 rounded-full bg-[#F39AA4]" />
              <span>project-publish-docs / schemas.yaml</span>
              <span />
            </div>
            <div className="rounded-lg border border-[#E4EAF4] p-4">
              <div className="flex items-center justify-between text-xs">
                <p className="font-semibold text-[#1E273A]">API Endpoint Definition</p>
                <p className="font-medium text-[#6B7891]">Active Sync</p>
              </div>
              <p className="mt-1 text-[11px] text-[#76839A]">Automatic generation from source code</p>

              <div className="mt-4 rounded-md border border-[#E8EDF6] p-3">
                <div className="mb-2 inline-flex rounded bg-[#E8F0FF] p-1 text-[#1F6FEB]">
                  <WandSparkles className="h-3.5 w-3.5" />
                </div>
                <div className="h-5 rounded bg-[#F7F9FC]" />
              </div>

              <div className="mt-3 rounded-md border border-[#E8EDF6] p-3">
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="rounded border border-[#DFE7F3] px-2 py-0.5 font-semibold text-[#4A556E]">POST</span>
                  <span className="font-medium text-[#1F6FEB]">api/v1/auth/forge-token</span>
                </div>
                <div className="mt-3 h-1.5 rounded bg-[#EFF3F9]" />
                <div className="mt-2 h-1.5 w-2/3 rounded bg-[#EFF3F9]" />
              </div>

              <div className="mt-4 flex justify-end">
                <a
                  href="/signup"
                  className="rounded-md bg-[#1F6FEB] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#1A60D3]"
                >
                  Generate Structured Doc
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-[#E5EAF2] bg-white py-12">
        <Container>
          <p className="text-center text-[10px] font-semibold tracking-[0.15em] text-[#7A869D]">
            THE STANDARD FOR DOCUMENTATION AT MODERN ENTERPRISES
          </p>
          <div className="mt-6 flex items-center justify-center gap-8 text-[#B8BFCC]">
            <Gem className="h-4 w-4" />
            <Heart className="h-4 w-4" />
            <Orbit className="h-4 w-4" />
            <Sparkles className="h-4 w-4" />
            <Shield className="h-4 w-4" />
          </div>
        </Container>
      </Section>

      <Section id="features" className="py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full bg-[#E9F1FF] px-3 py-1 text-[10px] font-bold text-[#1F6FEB]">
              Core Capabilities
            </p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.03em] text-[#1A2130] md:text-5xl">
              Everything you need to ship world-class documentation.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#5A667E] md:text-lg">
              From initial draft to global distribution, DocuForge handles the heavy lifting of technical communication.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-lg border border-[#E3E9F3] bg-white p-5 shadow-[0_1px_0_0_rgba(11,23,51,0.02)]"
                >
                  <span className="inline-flex rounded-lg bg-[#EAF1FF] p-2 text-[#1F6FEB]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold leading-tight text-[#1D2536]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5C6880]">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section id="solutions" className="pt-0">
        <Container>
          <article className="rounded-lg border border-[#E3E9F3] bg-white p-7 shadow-[0_1px_0_0_rgba(11,23,51,0.02)]">
            <p className="text-xs font-bold tracking-wide text-[#1F6FEB]">MULTI-FORMAT EXPORTS</p>
            <div className="mt-3 grid items-center gap-8 md:grid-cols-[1.25fr_1fr]">
              <div>
                <h3 className="text-3xl font-extrabold leading-tight tracking-[-0.02em] text-[#1A2232] md:text-4xl">
                  Export to PDF, DOCX, and Markdown
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#59667E]">
                  One source of truth, infinite outputs. Automatically synchronize your exports to your cloud storage or CI/CD pipelines.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-[#3A465B]">
                  <span className="rounded border border-[#DDE5F1] bg-white px-2 py-1">Portable Document (.pdf)</span>
                  <span className="rounded border border-[#DDE5F1] bg-white px-2 py-1">MS Word (.docx)</span>
                  <span className="rounded border border-[#DDE5F1] bg-white px-2 py-1">GitHub Flavored (.md)</span>
                  <span className="rounded border border-[#DDE5F1] bg-white px-2 py-1">Web Ready (.html)</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-5 text-[#AEB7C7]">
                <FileText className="h-14 w-14" />
                <ArrowRight className="h-7 w-7" />
                <div className="space-y-2">
                  <div className="h-2 w-20 rounded bg-current/50" />
                  <div className="h-2 w-24 rounded bg-current/40" />
                  <div className="h-2 w-16 rounded bg-current/30" />
                </div>
              </div>
            </div>
          </article>
        </Container>
      </Section>

      <Section id="pricing" className="py-24">
        <Container>
          <h2 className="text-center text-4xl font-extrabold tracking-[-0.02em] text-[#1A2232]">Simple, transparent pricing</h2>
          <p className="mt-3 text-center text-base text-[#5A667D]">
            Documentation is for everyone. Choose the plan that fits your team&apos;s scale.
          </p>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={[
                  "relative rounded-lg border bg-white p-6",
                  plan.featured
                    ? "border-[#1F6FEB] bg-[#F3F7FF] shadow-[0_10px_24px_-18px_rgba(31,111,235,0.58)]"
                    : "border-[#E3E9F3]",
                ].join(" ")}
              >
                {plan.featured ? (
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1F6FEB] px-2.5 py-1 text-[10px] font-bold text-white">
                    Most Popular
                  </span>
                ) : null}

                <p className="text-center text-xs font-bold uppercase tracking-[0.13em] text-[#5D6880]">{plan.name}</p>
                <p className="mt-2 text-center text-5xl font-extrabold text-[#161E2E]">
                  {plan.price}
                  {plan.suffix ? <span className="text-base font-medium text-[#6E7A91]">{plan.suffix}</span> : null}
                </p>
                <p className="mt-3 text-center text-sm leading-relaxed text-[#5F6B82]">{plan.description}</p>

                <ul className="mt-6 space-y-2 text-sm text-[#46536A]">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 text-[#1F6FEB]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/signup"
                  className={[
                    "mt-6 inline-flex h-10 w-full items-center justify-center rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6FEB]/35",
                    plan.featured
                      ? "bg-[#1F6FEB] text-white hover:bg-[#1A60D3]"
                      : "border border-[#D9E1EE] bg-white text-[#242E43] hover:bg-[#F7FAFD]",
                  ].join(" ")}
                >
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>

          <p className="mt-6 text-center text-[11px] text-[#707C93]">
            All plans include a 14-day free trial of Professional features. No credit card required.
          </p>
        </Container>
      </Section>

      <Section className="bg-[#1F6FEB] py-20 text-white">
        <Container className="text-center">
          <h2 className="text-4xl font-extrabold tracking-[-0.02em] md:text-5xl">Ready to forge world-class documentation?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-[#DAE6FF] md:text-lg">
            Join the elite engineering teams who have automated their technical writing with DocuForge AI.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-[#1F6FEB] transition hover:bg-[#EEF4FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55"
            >
              Start Your Free Trial
            </a>
            <a
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-md border border-white px-6 text-sm font-semibold text-white transition hover:bg-[#2C77F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55"
            >
              Schedule a Demo
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#D8E4FE]">
            <span className="inline-flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> SOC2 Compliant</span>
            <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> 10x Faster Generation</span>
            <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5" /> No Lock-in Export</span>
          </div>
        </Container>
      </Section>

      <footer id="resources" className="border-t border-[#E2E8F2] bg-[#F8FAFD] py-12">
        <Container className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <a href="#" className="flex items-center gap-2 text-lg font-extrabold text-[#1F6FEB]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#1F6FEB] text-[11px] text-white">◇</span>
              DocuForge AI
            </a>
            <p className="mt-3 max-w-[250px] text-sm leading-relaxed text-[#5D6981]">
              The intelligent layer for technical teams. We automate the boring parts of writing so you can focus on building.
            </p>
            <div className="mt-4 flex gap-4 text-[#3D485E]">
              <Orbit className="h-4 w-4" />
              <Sparkles className="h-4 w-4" />
              <Gem className="h-4 w-4" />
            </div>
          </div>

          <FooterColumn title="Product" items={["Features", "Integrations", "Pricing", "Changelog"]} />
          <FooterColumn title="Company" items={["About Us", "Careers", "Customers", "Contact"]} />
          <FooterColumn title="Legal" items={["Privacy Policy", "Terms of Service", "Security", "GDPR"]} />
        </Container>

        <Container className="mt-10 border-t border-[#E0E6F1] pt-4 text-[11px] text-[#6C7891]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p>© 2026 DocuForge AI Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <p>Status: Operational</p>
              <p>Cookie Preferences</p>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.13em] text-[#2F3A4E]">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-[#5D6981]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
