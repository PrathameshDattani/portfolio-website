import { Mail } from "lucide-react";
import type { ComponentType } from "react";
import { socials } from "@/content/socials";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/BrandIcons";

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
  icon: ComponentType<{ size?: number }> | null;
};

const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

/** All contact channels from content/socials.ts, in display order. */
export function socialLinks(): SocialLink[] {
  const links: SocialLink[] = [
    { label: "Email", href: `mailto:${socials.email}`, icon: Mail, handle: socials.email },
  ];
  if (socials.github) links.push({ label: "GitHub", href: socials.github, icon: GithubIcon, handle: strip(socials.github) });
  if (socials.linkedin)
    links.push({ label: "LinkedIn", href: socials.linkedin, icon: LinkedinIcon, handle: strip(socials.linkedin) });
  if (socials.x) links.push({ label: "X", href: socials.x, icon: XIcon, handle: strip(socials.x) });
  for (const o of socials.other ?? []) links.push({ label: o.label, href: o.href, icon: null, handle: strip(o.href) });
  return links;
}
