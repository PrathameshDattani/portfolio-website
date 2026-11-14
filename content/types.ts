/**
 * Content schemas. Every piece of personal data on the site comes from files in /content
 * that conform to these types. Components never hardcode personal data.
 */

export type Stat = {
  /** Plain-language label, e.g. "Projects shipped" */
  label: string;
  value: string | number;
  /** Motorsport label shown alongside, e.g. "Starts" */
  f1Label?: string;
  /** Optional suffix rendered after a numeric value, e.g. "+" */
  suffix?: string;
};

export type Profile = {
  fullName: string;
  shortName: string;
  driverNumber: number;
  roleTitle: string;
  teamName: string;
  location: string;
  /** Flag emoji for the home circuit */
  locationFlag: string;
  /** IANA timezone, e.g. "Asia/Kolkata". Powers the Pit Wall local clock. */
  timezone: string;
  tagline: string;
  bioShort: string;
  bioLong: string;
  stats: Stat[];
  /** Larger "Driver Stats" table on /driver */
  driverStats: Stat[];
  interests: string[];
  careerHighlights: { year: string; title: string; detail?: string }[];
  availability: "open" | "limited" | "closed";
  availabilityNote: string;
  responseTime: string;
  profileImage?: string;
  resumeUrl: string;
};

export type Socials = {
  email: string;
  github?: string;
  linkedin?: string;
  x?: string;
  other?: { label: string; href: string }[];
};

export type ProjectStatus = "finished" | "in-progress" | "shipped";

export type Project = {
  slug: string;
  round: number;
  name: string;
  category: string[];
  summary: string;
  problem: string;
  solution: string;
  result: string;
  role: string;
  start: string;
  end?: string;
  status: ProjectStatus;
  featured?: boolean;
  stack: { engine?: string[]; aero?: string[]; electronics?: string[] };
  metrics?: { label: string; value: number; unit?: string; max?: number }[];
  links?: { github?: string; live?: string; paper?: string; demo?: string };
  media?: { src: string; alt: string; type: "image" | "video" }[];
  archDiagram?: string;
  /** Deterministic seed for the procedurally generated, original circuit shape */
  circuitSeed?: number;
  learnings?: string[];
};

export type Experience = {
  company: string;
  role: string;
  seat: "Race Driver" | "Test & Reserve Driver" | "Engineer";
  start: string;
  end?: string;
  location?: string;
  /** Original livery colour for this team entry */
  color: string;
  results: string[];
  stack: string[];
};

export type Education = {
  institution: string;
  degree: string;
  start: string;
  end?: string;
  score?: string;
  notes?: string[];
};

export type SkillZone = "power-unit" | "aero" | "chassis" | "electronics" | "pit-crew" | "telemetry";
export type Tyre = "soft" | "medium" | "hard" | "inter" | "wet";

export type Skill = {
  name: string;
  zone: SkillZone;
  tyre: Tyre;
  /** 0 to 100 */
  proficiency: number;
  years?: number;
};

export type Achievement = {
  title: string;
  event: string;
  position?: "P1" | "P2" | "P3" | "Finisher";
  date: string;
  description?: string;
  link?: string;
  featured?: boolean;
};

export type Publication = {
  title: string;
  venue: string;
  date: string;
  authors?: string;
  link?: string;
};
