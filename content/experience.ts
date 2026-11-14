import type { Experience } from "./types";

/** {{EXPERIENCE[]}}: newest first. `color` is an original livery colour for each team. */
export const experience: Experience[] = [
  {
    company: "Sample Corp",
    role: "Software Engineer",
    seat: "Race Driver",
    start: "2025-06",
    location: "Remote",
    color: "#3B82F6",
    results: [
      "Sample result: led the migration of a core service, cutting p95 latency by 40%.",
      "Sample result: shipped an internal tool used daily by 50+ engineers.",
      "Sample result: mentored two interns through their first production releases.",
    ],
    stack: ["TypeScript", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    company: "Placeholder Systems",
    role: "Software Engineering Intern",
    seat: "Test & Reserve Driver",
    start: "2024-05",
    end: "2024-08",
    location: "Sample City",
    color: "#22C55E",
    results: [
      "Sample result: built a monitoring dashboard adopted by the on-call team.",
      "Sample result: automated a manual release checklist, saving hours every week.",
    ],
    stack: ["Python", "React", "Docker"],
  },
  {
    company: "Example Labs",
    role: "Research Intern",
    seat: "Engineer",
    start: "2023-06",
    end: "2023-08",
    color: "#A855F7",
    results: ["Sample result: benchmarked three model-compression techniques."],
    stack: ["PyTorch", "Jupyter"],
  },
];
