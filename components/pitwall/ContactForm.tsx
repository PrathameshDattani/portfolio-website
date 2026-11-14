"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useFlag } from "@/components/f1/FlagBanner";
import { Magnetic } from "@/components/motion/Magnetic";
import { contactSchema, SUBJECTS, type ContactInput } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const COOLDOWN_KEY = "pitwall-last-sent";
const COOLDOWN_MS = 60_000;
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT || "/api/contact";

type FieldState = "idle" | "active" | "valid" | "error";
/* timing-screen colours: purple = live, green = good, red = needs a fix */
const LINE: Record<FieldState, string> = {
  idle: "var(--line-strong)",
  active: "var(--purple)",
  valid: "var(--green)",
  error: "var(--red)",
};

function Field({ id, n, label, state, error, children }: { id: string; n: string; label: string; state: FieldState; error?: string; children: ReactNode }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] text-muted tabular">{n}</span>
        <span className="eyebrow !text-fg">{label}</span>
      </label>
      {children}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-line-strong" />
      <motion.span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left"
        animate={{ scaleX: state === "idle" ? 0 : 1, backgroundColor: LINE[state] }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      {error && (
        <motion.p id={`${id}-error`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="alert" className="absolute -bottom-7 left-0 text-sm text-[#fca5a5]">
          {error}
        </motion.p>
      )}
    </div>
  );
}

const inputCls =
  "mt-3 block w-full bg-transparent pb-4 text-[clamp(20px,2vw,28px)] tracking-[-0.02em] text-fg placeholder:text-fg/25 outline-none";

export function ContactForm({ shortName }: { shortName: string }) {
  const showFlag = useFlag();
  const [focused, setFocused] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, dirtyFields, touchedFields, isSubmitted },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", subject: "Box box", message: "", website: "" },
  });
  const subject = watch("subject");
  const message = watch("message") ?? "";

  const stateOf = (name: keyof ContactInput): FieldState => {
    if (errors[name] && (touchedFields[name] || isSubmitted)) return "error";
    if (focused === name) return "active";
    if (dirtyFields[name] && !errors[name]) return "valid";
    return "idle";
  };

  const onSubmit = async (data: ContactInput) => {
    if (data.website) return;
    try {
      if (Date.now() - Number(localStorage.getItem(COOLDOWN_KEY) ?? 0) < COOLDOWN_MS) {
        showFlag({ type: "yellow", title: "Message just sent", message: "Give it a minute before the next one." });
        return;
      }
    } catch {}
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      try {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      } catch {}
      reset();
      showFlag({ type: "green", title: "Copy that, message received.", message: `${shortName} will be back on the radio soon.` });
    } catch {
      showFlag({ type: "red", title: "Transmission failed", message: "Please try again, or email directly." });
    }
  };

  const bind = (name: "name" | "email" | "message") => {
    const r = register(name);
    return {
      ...r,
      onFocus: () => setFocused(name),
      onBlur: (e: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => {
        r.onBlur(e);
        setFocused(null);
      },
      "aria-invalid": !!errors[name],
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-14">
      <fieldset>
        <legend className="eyebrow mb-5 !text-fg">Channel</legend>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <label key={s} className="relative cursor-pointer">
              <input type="radio" value={s} className="peer sr-only" {...register("subject")} />
              <span
                className={cn(
                  "flex h-11 items-center rounded-full border px-5 text-sm transition-colors duration-300 peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-livery-ink",
                  subject === s ? "border-fg bg-fg text-ink-950" : "border-line-strong text-fg/80 hover:border-fg/50 hover:text-fg",
                )}
              >
                {s}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-14 md:grid-cols-2">
        <Field id="name" n="01" label="Name" state={stateOf("name")} error={errors.name?.message}>
          <input id="name" autoComplete="name" placeholder="Your name" className={inputCls} {...bind("name")} />
        </Field>
        <Field id="email" n="02" label="Email" state={stateOf("email")} error={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" placeholder="you@company.com" className={inputCls} {...bind("email")} />
        </Field>
      </div>

      <Field id="message" n="03" label="Message" state={stateOf("message")} error={errors.message?.message}>
        <textarea id="message" rows={4} placeholder="What are we racing towards?" className={cn(inputCls, "resize-none")} {...bind("message")} />
        <span className="pointer-events-none absolute right-0 bottom-4 font-mono text-[11px] text-muted tabular" aria-hidden>
          {message.length}/2000
        </span>
      </Field>

      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
        <p className="text-xs text-muted">Purple: editing · Green: looks good · Red: needs a fix</p>
        <Magnetic strength={0.25}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-fg pr-2 pl-7 text-[15px] font-medium text-ink-950 disabled:opacity-70"
          >
            <span aria-hidden className="absolute inset-0 translate-y-full rounded-full bg-livery transition-transform duration-500 ease-out group-hover:translate-y-0" />
            <span className="roll relative group-hover:text-white">
              <span>{isSubmitting ? "Transmitting" : "Send radio message"}</span>
              <span aria-hidden>{isSubmitting ? "Transmitting" : "Send radio message"}</span>
            </span>
            <span aria-hidden className="relative flex size-10 items-center justify-center rounded-full bg-ink-950 text-fg transition-transform duration-500 ease-out group-hover:rotate-45">
              {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : <ArrowUpRight size={17} />}
            </span>
          </button>
        </Magnetic>
      </div>
    </form>
  );
}
