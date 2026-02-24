import type { ReactNode } from "react";
import { Circle, Shield, Sparkles, Workflow } from "lucide-react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="auth-shell grid min-h-dvh bg-[#F3F4F7] lg:h-dvh lg:grid-cols-2 lg:overflow-hidden">
      <section className="auth-left hidden bg-[#2F68E8] px-9 py-7 text-white lg:block xl:px-14 xl:py-9">
        <div className="mx-auto flex h-full w-full max-w-[680px] flex-col">
          <div className="auth-brand flex items-center gap-3">
            <Circle className="h-7 w-7 fill-white text-white xl:h-8 xl:w-8" />
            <p className="text-[23px] font-bold xl:text-[28px]">DocuForge AI</p>
          </div>

          <h1 className="auth-left-title mt-6 text-[50px] font-black leading-[1.03] tracking-[-0.03em] xl:mt-8 xl:text-[62px]">
            Generate professional
            <br />
            technical documentation
            <br />
            in minutes.
          </h1>

          <p className="auth-left-copy mt-4 max-w-[620px] text-[15px] leading-[1.48] text-[#D7E6FF] xl:mt-5 xl:text-[19px]">
            The AI-powered workspace designed for engineering teams to build, manage, and scale their technical specifications without the friction.
          </p>

          <div className="auth-features mt-5 space-y-4 xl:mt-6 xl:space-y-5">
            <Feature
              icon={<Sparkles className="h-4 w-4" />}
              title="Rapid Generation"
              description="Turn brief project contexts into detailed API specs and architectural diagrams instantly."
            />
            <Feature
              icon={<Shield className="h-4 w-4" />}
              title="Compliance Ready"
              description="Ensure all documentation meets ISO, SOC2, and internal engineering standards automatically."
            />
            <Feature
              icon={<Workflow className="h-4 w-4" />}
              title="Integrations Deep"
              description="Sync directly with GitHub, Jira, and Slack to keep documentation in lock-step with your code."
            />
          </div>

          <div className="auth-quote mt-auto border-t border-white/20 pt-4 xl:pt-6">
            <div className="auth-quote-row flex items-center gap-4">
              <div className="flex -space-x-2">
                <span className="h-8 w-8 rounded-full border-2 border-[#2F68E8] bg-[linear-gradient(140deg,#b08968,#e6ccb2)]" />
                <span className="h-8 w-8 rounded-full border-2 border-[#2F68E8] bg-[linear-gradient(140deg,#9d4edd,#f72585)]" />
                <span className="h-8 w-8 rounded-full border-2 border-[#2F68E8] bg-[linear-gradient(140deg,#ffd166,#ef476f)]" />
              </div>
              <p className="auth-quote-text text-[12px] text-[#D8E6FF] italic xl:text-[13px]">
                &ldquo;The most valuable tool in our technical stack this year.&rdquo; - Lead Architect at TechScale
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-right flex items-center justify-center bg-[#F3F4F7] px-6 py-5 lg:px-10 xl:px-12">
        {children}
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white xl:h-9 xl:w-9">
        {icon}
      </span>
      <div>
        <p className="auth-feature-title text-[16px] font-bold leading-none xl:text-[19px]">{title}</p>
        <p className="auth-feature-copy mt-1 max-w-[500px] text-[13px] leading-relaxed text-[#D7E6FF] xl:mt-1.5 xl:text-[15px]">{description}</p>
      </div>
    </div>
  );
}
