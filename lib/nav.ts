import { site } from "@/content/site";

export type NavItem = { href: string; label: string; plain: string };

export const navItems: NavItem[] = [
  { href: "/driver", label: "Driver", plain: "About" },
  { href: "/races", label: "Races", plain: "Projects" },
  { href: "/seasons", label: "Seasons", plain: "Experience" },
  { href: "/garage", label: "Garage", plain: "Skills" },
  { href: "/podium", label: "Podium", plain: "Achievements" },
  ...(site.enableBlog ? [{ href: "/paddock", label: "Paddock", plain: "Blog" }] : []),
  { href: "/pit-wall", label: "Pit Wall", plain: "Contact" },
];
