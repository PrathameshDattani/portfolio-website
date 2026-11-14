import type { Skill, SkillZone, Tyre } from "./types";

/**
 * Skills from the resume, grouped by car `zone`.
 * `proficiency` (0–100) and `tyre` are self-ratings: adjust them to taste.
 * Zones with no skills (e.g. Aerodynamics / frontend) are hidden automatically.
 */
export const skills: Skill[] = [
  // Power unit: languages
  { name: "Python", zone: "power-unit", tyre: "soft", proficiency: 93 },
  { name: "SQL", zone: "power-unit", tyre: "medium", proficiency: 80 },
  { name: "Java", zone: "power-unit", tyre: "hard", proficiency: 70 },
  { name: "C / C++", zone: "power-unit", tyre: "hard", proficiency: 66 },

  // Chassis: backend & APIs
  { name: "FastAPI", zone: "chassis", tyre: "soft", proficiency: 90 },
  { name: "Microservices", zone: "chassis", tyre: "medium", proficiency: 80 },
  { name: "Postman", zone: "chassis", tyre: "medium", proficiency: 78 },

  // Electronics: AI/ML & agents
  { name: "PyTorch", zone: "electronics", tyre: "soft", proficiency: 86 },
  { name: "Scikit-learn", zone: "electronics", tyre: "soft", proficiency: 88 },
  { name: "Hugging Face", zone: "electronics", tyre: "medium", proficiency: 82 },
  { name: "TensorFlow", zone: "electronics", tyre: "medium", proficiency: 72 },
  { name: "LangChain", zone: "electronics", tyre: "medium", proficiency: 76 },
  { name: "CrewAI", zone: "electronics", tyre: "inter", proficiency: 64 },
  { name: "OpenCV", zone: "electronics", tyre: "medium", proficiency: 70 },
  { name: "SHAP", zone: "electronics", tyre: "hard", proficiency: 64 },
  { name: "Pandas / NumPy", zone: "electronics", tyre: "soft", proficiency: 90 },

  // Pit crew: DevOps & cloud
  { name: "Docker", zone: "pit-crew", tyre: "soft", proficiency: 86 },
  { name: "Google Cloud (GCP)", zone: "pit-crew", tyre: "medium", proficiency: 80 },
  { name: "AWS", zone: "pit-crew", tyre: "medium", proficiency: 72 },
  { name: "Kubernetes", zone: "pit-crew", tyre: "inter", proficiency: 60 },
  { name: "GitHub Actions / CI/CD", zone: "pit-crew", tyre: "medium", proficiency: 76 },
  { name: "Git & GitHub", zone: "pit-crew", tyre: "soft", proficiency: 88 },
  { name: "Linux", zone: "pit-crew", tyre: "medium", proficiency: 76 },

  // Data & telemetry: databases & storage
  { name: "MongoDB", zone: "telemetry", tyre: "soft", proficiency: 84 },
  { name: "MySQL", zone: "telemetry", tyre: "medium", proficiency: 80 },
  { name: "SQLite", zone: "telemetry", tyre: "medium", proficiency: 78 },
  { name: "Vector databases", zone: "telemetry", tyre: "medium", proficiency: 74 },
  { name: "Neo4j", zone: "telemetry", tyre: "inter", proficiency: 60 },
  { name: "Google Cloud Storage", zone: "telemetry", tyre: "medium", proficiency: 72 },
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
    plain: "Databases & storage",
    description: "Every signal captured: storage, retrieval and vectors.",
  },
};

export const zoneOrder: SkillZone[] = ["power-unit", "electronics", "chassis", "pit-crew", "telemetry", "aero"];

export const tyreMeta: Record<Tyre, { letter: string; label: string; meaning: string }> = {
  soft: { letter: "S", label: "Soft", meaning: "Expert, daily driver" },
  medium: { letter: "M", label: "Medium", meaning: "Strong" },
  hard: { letter: "H", label: "Hard", meaning: "Solid fundamentals" },
  inter: { letter: "I", label: "Inter", meaning: "Currently learning" },
  wet: { letter: "W", label: "Wet", meaning: "Experimental" },
};
