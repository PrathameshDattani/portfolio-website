import type { Skill, SkillZone, Tyre } from "./types";

/** {{SKILLS[]}}: grouped by car `zone`. The tyre legend lives below. */
export const skills: Skill[] = [
  { name: "TypeScript", zone: "power-unit", tyre: "soft", proficiency: 92, years: 4 },
  { name: "Python", zone: "power-unit", tyre: "soft", proficiency: 88, years: 5 },
  { name: "Go", zone: "power-unit", tyre: "medium", proficiency: 70, years: 2 },
  { name: "Rust", zone: "power-unit", tyre: "inter", proficiency: 40, years: 1 },
  { name: "React", zone: "aero", tyre: "soft", proficiency: 90, years: 4 },
  { name: "Next.js", zone: "aero", tyre: "soft", proficiency: 86, years: 3 },
  { name: "Tailwind CSS", zone: "aero", tyre: "medium", proficiency: 80, years: 3 },
  { name: "Framer Motion", zone: "aero", tyre: "medium", proficiency: 72, years: 2 },
  { name: "Node.js", zone: "chassis", tyre: "soft", proficiency: 85, years: 4 },
  { name: "FastAPI", zone: "chassis", tyre: "medium", proficiency: 78, years: 2 },
  { name: "GraphQL", zone: "chassis", tyre: "hard", proficiency: 62, years: 2 },
  { name: "LLM APIs", zone: "electronics", tyre: "medium", proficiency: 78, years: 2 },
  { name: "PyTorch", zone: "electronics", tyre: "hard", proficiency: 65, years: 2 },
  { name: "AI agents", zone: "electronics", tyre: "wet", proficiency: 55, years: 1 },
  { name: "Docker", zone: "pit-crew", tyre: "soft", proficiency: 84, years: 3 },
  { name: "Kubernetes", zone: "pit-crew", tyre: "inter", proficiency: 50, years: 1 },
  { name: "AWS", zone: "pit-crew", tyre: "medium", proficiency: 70, years: 2 },
  { name: "GitHub Actions", zone: "pit-crew", tyre: "medium", proficiency: 76, years: 3 },
  { name: "PostgreSQL", zone: "telemetry", tyre: "soft", proficiency: 82, years: 4 },
  { name: "Redis", zone: "telemetry", tyre: "medium", proficiency: 70, years: 2 },
  { name: "pgvector", zone: "telemetry", tyre: "inter", proficiency: 58, years: 1 },
];

export const zoneMeta: Record<SkillZone, { title: string; plain: string; description: string }> = {
  "power-unit": {
    title: "Power Unit",
    plain: "Languages",
    description: "The engine that drives everything: core programming languages.",
  },
  aero: {
    title: "Aerodynamics",
    plain: "Frontend",
    description: "What the world sees and feels: interfaces, motion and polish.",
  },
  chassis: {
    title: "Chassis",
    plain: "Backend & APIs",
    description: "The structure everything bolts onto: services and APIs.",
  },
  electronics: {
    title: "Electronics / ECU",
    plain: "AI/ML & agents",
    description: "The brain of the car: models, inference and agents.",
  },
  "pit-crew": {
    title: "Pit Crew Tools",
    plain: "DevOps & cloud",
    description: "Fast, repeatable stops: CI/CD, containers and cloud.",
  },
  telemetry: {
    title: "Data & Telemetry",
    plain: "Databases & vector stores",
    description: "Every signal captured: storage, caching and retrieval.",
  },
};

export const zoneOrder: SkillZone[] = [
  "power-unit",
  "aero",
  "chassis",
  "electronics",
  "pit-crew",
  "telemetry",
];

export const tyreMeta: Record<Tyre, { letter: string; label: string; meaning: string }> = {
  soft: { letter: "S", label: "Soft", meaning: "Expert, daily driver" },
  medium: { letter: "M", label: "Medium", meaning: "Strong" },
  hard: { letter: "H", label: "Hard", meaning: "Solid fundamentals" },
  inter: { letter: "I", label: "Inter", meaning: "Currently learning" },
  wet: { letter: "W", label: "Wet", meaning: "Experimental" },
};
