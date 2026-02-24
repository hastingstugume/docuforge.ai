"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Github, Lock, Mail, User } from "lucide-react";
import type { LoginInput, SignupInput } from "@docuforge/shared";
import { login, signup } from "@/lib/api/auth";
import { loginInputSchema, signupInputSchema } from "@/lib/validation/auth";

type AuthMode = "login" | "signup";

type FormState = {
  fullName: string;
  email: string;
  password: string;
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ fullName: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fieldErrors = useMemo(() => {
    const schema = mode === "login" ? loginInputSchema : signupInputSchema;
    const payload =
      mode === "login"
        ? ({ email: form.email, password: form.password } satisfies LoginInput)
        : ({ fullName: form.fullName, email: form.email, password: form.password } satisfies SignupInput);

    const result = schema.safeParse(payload);
    if (result.success) {
      return {} as Record<string, string>;
    }

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues as Array<{ path: Array<string | number>; message: string }>) {
      const key = String(issue.path[0]);
      if (!errors[key]) {
        errors[key] = issue.message;
      }
    }
    return errors;
  }, [form, mode]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setErrorMessage(null);

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup({ fullName: form.fullName, email: form.email, password: form.password });
      }
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to authenticate.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-form w-full max-w-[460px] xl:max-w-[500px]">
      <h2 className="auth-form-title text-3xl font-black tracking-tight text-[#202737] xl:text-4xl">
        {mode === "login" ? "Welcome back" : "Create account"}
      </h2>
      <p className="auth-form-subtitle mt-2 text-[15px] text-[#7A859A] xl:text-[17px]">
        {mode === "login"
          ? "Enter your credentials to access your workspace"
          : "Create your account to access your workspace"}
      </p>

      <form className="auth-form-fields mt-4 space-y-3" onSubmit={onSubmit} noValidate>
        {mode === "signup" ? (
          <Field
            label="Full name"
            icon={<User className="h-4 w-4" />}
            value={form.fullName}
            error={submitted ? fieldErrors.fullName : undefined}
            onChange={(value) => setForm((prev) => ({ ...prev, fullName: value }))}
            placeholder="Ada Lovelace"
            autoComplete="name"
          />
        ) : null}

        <Field
          label="Email address"
          icon={<Mail className="h-4 w-4" />}
          value={form.email}
          error={submitted ? fieldErrors.email : undefined}
          onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
          placeholder="name@company.com"
          autoComplete="email"
          type="email"
        />

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-semibold text-[#495166]">Password</label>
            {mode === "login" ? (
              <a href="#" className="text-sm font-semibold text-[#2E68E8] hover:underline">Forgot password?</a>
            ) : null}
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A95A9]">
              <Lock className="h-4 w-4" />
            </span>
            <input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="h-10 w-full rounded-md border border-[#D7DEE9] bg-white pl-9 pr-3 text-sm text-[#1E2638] outline-none transition focus:border-[#2E68E8] focus:ring-2 focus:ring-[#2E68E8]/20 xl:h-11"
              aria-invalid={Boolean(submitted && fieldErrors.password)}
              aria-describedby={submitted && fieldErrors.password ? "password-error" : undefined}
            />
          </div>
          {submitted && fieldErrors.password ? (
            <p id="password-error" className="mt-1 text-xs text-[#C93434]">{fieldErrors.password}</p>
          ) : null}
        </div>

        {errorMessage ? <p className="text-sm text-[#C93434]">{errorMessage}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#2E68E8] px-4 text-sm font-semibold text-white transition hover:bg-[#2559d1] disabled:cursor-not-allowed disabled:opacity-70 xl:h-11"
        >
          {isSubmitting ? "Please wait..." : mode === "login" ? "Sign in to Dashboard" : "Create account"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="auth-divider my-4 flex items-center gap-3 xl:my-5">
        <div className="h-px flex-1 bg-[#DCE3EE]" />
        <p className="text-xs font-semibold uppercase text-[#8A94A9]">Or continue with</p>
        <div className="h-px flex-1 bg-[#DCE3EE]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#D7DEE9] bg-white text-sm font-semibold text-[#3A4357] xl:h-11"
        >
          <Github className="h-4 w-4" />
          GitHub
        </button>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#D7DEE9] bg-white text-sm font-semibold text-[#3A4357] xl:h-11"
        >
          <span className="text-base font-black">G</span>
          Google
        </button>
      </div>

      <p className="auth-switch mt-4 text-center text-sm text-[#667188] xl:mt-5">
        {mode === "login" ? "Don\'t have an account? " : "Already have an account? "}
        <Link href={mode === "login" ? "/signup" : "/login"} className="font-semibold text-[#2E68E8] hover:underline">
          {mode === "login" ? "Create account" : "Sign in"}
        </Link>
      </p>

      <div className="auth-links mt-5 flex items-center justify-center gap-5 text-sm text-[#8E98AC] xl:mt-6">
        <a href="#" className="hover:text-[#59647b]">Privacy Policy</a>
        <a href="#" className="hover:text-[#59647b]">Terms of Service</a>
        <a href="#" className="hover:text-[#59647b]">Status</a>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  error?: string;
};

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  type = "text",
  error,
}: FieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-[#495166]">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A95A9]">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-10 w-full rounded-md border border-[#D7DEE9] bg-white pl-9 pr-3 text-sm text-[#1E2638] outline-none transition placeholder:text-[#98A4B7] focus:border-[#2E68E8] focus:ring-2 focus:ring-[#2E68E8]/20 xl:h-11"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error ? <p id={`${id}-error`} className="mt-1 text-xs text-[#C93434]">{error}</p> : null}
    </div>
  );
}
