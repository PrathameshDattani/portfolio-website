"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useFlag } from "@/components/f1/FlagBanner";
import { contactSchema, SUBJECTS, type ContactInput } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const COOLDOWN_KEY = "pitwall-last-sent";
const COOLDOWN_MS = 60_000;
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT || "/api/contact";

type FieldState = "idle" | "active" | "valid" | "error";

const STATE_COLOR: Record<FieldState, string> = {
  idle: "var(--asphalt-600)",
  active: "var(--sector-purple)",
  valid: "var(--sector-green)",
  error: "var(--flag-red)",
};

const STATE_TEXT: Record<FieldState, string> = {
  idle: "",
  active: "Live",
  valid: "Personal best",
  error: "Check",
};

function Field({
  id,
  sector,
  label,
  state,
  error,
  children,
}: {
  id: string;
  sector: string;
  label: string;
  state: FieldState;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="group relative">
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="flex items-center gap-2.5">
          <span className="font-mono text-[11px] font-bold text-tyre-grey tabular">{sector}</span>
          <span className="font-display text-sm font-bold tracking-[0.1em] uppercase">{label}</span>
        </label>
        <span className="label-mono text-[10px] transition-colors duration-300" style={{ color: STATE_COLOR[state] }} aria-hidden>
          {STATE_TEXT[state]}
        </span>
      </div>
      <div className="relative">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 z-10 w-[3px] rounded-l-[4px] transition-colors duration-300"
          style={{ background: STATE_COLOR[state] }}
        />
        {children}
      </div>
      {error && (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-2 text-sm text-[#fca5a5]"
          role="alert"
        >
          <span aria-hidden className="h-2.5 w-3 rounded-[1px] bg-flag-red" />
          {error}
        </motion.p>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-[4px] border border-asphalt-700 bg-asphalt-950/70 py-3 pr-4 pl-5 text-[15px] text-kerb placeholder:text-tyre-grey/60 transition-[border-color,background-color] duration-300 outline-none hover:border-asphalt-600 focus:border-purple/70 focus:bg-asphalt-950";

export function ContactForm({ shortName }: { shortName: string }) {
  const showFlag = useFlag();
  const [focused, setFocused] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, dirtyFields, touchedFields, isSubmitted },
    watch,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", subject: "Box box", message: "", website: "" },
  });

  const message = watch("message") ?? "";

  const stateOf = (name: keyof ContactInput): FieldState => {
    if (errors[name] && (touchedFields[name] || isSubmitted)) return "error";
    if (focused === name) return "active";
    if (dirtyFields[name] && !errors[name]) return "valid";
    return "idle";
  };

  const onSubmit = async (data: ContactInput) => {
    if (data.website) return; // bot
    try {
      const last = Number(localStorage.getItem(COOLDOWN_KEY) ?? 0);
      if (Date.now() - last < COOLDOWN_MS) {
        showFlag({ type: "yellow", title: "Yellow flag", message: "Message just sent. Give it a minute before the next one." });
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
      showFlag({ type: "red", title: "Red flag: transmission failed", message: "Please try again, or use one of the radio channels." });
    }
  };

  const focusProps = (name: keyof ContactInput) => ({
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
  });

  const nameReg = register("name");
  const emailReg = register("email");
  const msgReg = register("message");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" sector="S1" label="Name" state={stateOf("name")} error={errors.name?.message}>
          <input
            id="name"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputCls}
            {...nameReg}
            onFocus={focusProps("name").onFocus}
            onBlur={(e) => {
              nameReg.onBlur(e);
              setFocused(null);
            }}
          />
        </Field>
        <Field id="email" sector="S2" label="Email" state={stateOf("email")} error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputCls}
            {...emailReg}
            onFocus={focusProps("email").onFocus}
            onBlur={(e) => {
              emailReg.onBlur(e);
              setFocused(null);
            }}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-3 flex items-center gap-2.5">
          <span className="font-mono text-[11px] font-bold text-tyre-grey tabular">S3</span>
          <span className="font-display text-sm font-bold tracking-[0.1em] uppercase">Channel</span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SUBJECTS.map((s) => (
            <label key={s} className="relative cursor-pointer">
              <input type="radio" value={s} className="peer sr-only" {...register("subject")} />
              <span className="flex h-11 items-center justify-center rounded-[4px] border border-asphalt-700 bg-asphalt-950/70 px-3 text-center font-display text-[13px] font-bold tracking-[0.08em] text-kerb/75 uppercase transition-all duration-300 peer-checked:border-livery peer-checked:bg-livery-soft peer-checked:text-kerb peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-livery-ink hover:border-asphalt-600 hover:text-kerb">
                {s}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="message" sector="S4" label="Message" state={stateOf("message")} error={errors.message?.message}>
        <textarea
          id="message"
          rows={6}
          placeholder="What are we racing towards?"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : "message-count"}
          className={cn(inputCls, "resize-y")}
          {...msgReg}
          onFocus={focusProps("message").onFocus}
          onBlur={(e) => {
            msgReg.onBlur(e);
            setFocused(null);
          }}
        />
        <span id="message-count" className="label-mono pointer-events-none absolute right-3 bottom-3 text-[10px] text-tyre-grey tabular">
          {message.length}/2000
        </span>
      </Field>

      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-tyre-grey">Purple: editing · Green: looks good · Red: needs a fix</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-drs group relative inline-flex h-12 items-center rounded-[4px] bg-livery px-7 font-display text-[15px] font-bold tracking-[0.08em] text-white uppercase shadow-[0_10px_40px_-12px_var(--livery-glow)] disabled:opacity-70"
        >
          <span className="unskew-speed flex items-center gap-2.5">
            {isSubmitting ? (
              <>
                Transmitting <Loader2 size={16} className="animate-spin" aria-hidden />
              </>
            ) : (
              <>
                Send radio message <Send size={16} className="btn-arrow" aria-hidden />
              </>
            )}
          </span>
          <span aria-hidden className="drs-flap absolute -top-2.5 right-3 rounded-[2px] bg-drs px-1.5 py-[3px] font-mono text-[9px] leading-none font-bold tracking-[0.15em] text-asphalt-950">
            DRS
          </span>
        </button>
      </div>
    </form>
  );
}
