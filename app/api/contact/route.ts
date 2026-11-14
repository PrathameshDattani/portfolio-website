import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

/**
 * Built-in contact endpoint, used when NEXT_PUBLIC_CONTACT_FORM_ENDPOINT is not set.
 * It validates, rate-limits and logs the message. Wire it up to an email provider
 * (e.g. Resend) where marked below, or point the env var at Formspree instead.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many messages. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Validation failed" }, { status: 422 });
  }
  if (parsed.data.website) {
    // honeypot tripped: pretend success
    return NextResponse.json({ ok: true });
  }

  // TODO(owner): deliver the message, e.g. with Resend:
  // await resend.emails.send({ from, to, subject: `[Pit Wall] ${parsed.data.subject}`, text: parsed.data.message })
  console.info("[pit-wall] message received", {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    length: parsed.data.message.length,
  });

  return NextResponse.json({ ok: true });
}
