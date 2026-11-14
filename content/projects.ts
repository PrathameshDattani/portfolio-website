import type { Project } from "./types";

/** {{PROJECTS[]}}: sample entries. Replace with your own. `round` sets the order. */
export const projects: Project[] = [
  {
    slug: "sample-project-alpha",
    round: 1,
    name: "Sample Project Alpha",
    category: ["AI/ML", "Backend"],
    summary: "A sample retrieval-augmented assistant that answers questions over private docs.",
    problem:
      "Sample problem statement: teams were losing hours searching scattered documentation across tools.",
    solution:
      "Sample solution: an ingestion pipeline plus a retrieval API with a lightweight chat front end.",
    result: "Sample result: answers in under a second, with cited sources.",
    role: "Lead engineer",
    start: "2025-01",
    end: "2025-04",
    status: "shipped",
    featured: true,
    stack: {
      engine: ["Python", "FastAPI", "PostgreSQL"],
      aero: ["Next.js", "Tailwind CSS"],
      electronics: ["LLM APIs", "pgvector", "Docker"],
    },
    metrics: [
      { label: "P95 latency", value: 820, unit: "ms", max: 2000 },
      { label: "Answer accuracy", value: 91, unit: "%", max: 100 },
      { label: "Weekly users", value: 340, max: 500 },
    ],
    links: { github: "https://github.com/example/alpha", live: "https://example.com" },
    circuitSeed: 7,
    learnings: [
      "Sample learning: evaluate retrieval quality before tuning prompts.",
      "Sample learning: caching embeddings cut costs dramatically.",
    ],
  },
  {
    slug: "sample-project-beta",
    round: 2,
    name: "Sample Project Beta",
    category: ["Backend", "DevOps"],
    summary: "A sample event-driven pipeline that processes telemetry streams in real time.",
    problem: "Sample problem: batch jobs delivered insights hours too late.",
    solution: "Sample solution: a streaming architecture with idempotent consumers and autoscaling.",
    result: "Sample result: end-to-end latency dropped from hours to seconds.",
    role: "Backend engineer",
    start: "2024-08",
    end: "2024-12",
    status: "finished",
    featured: true,
    stack: {
      engine: ["Go", "Kafka", "Redis"],
      aero: ["React"],
      electronics: ["Kubernetes", "Terraform", "Grafana"],
    },
    metrics: [
      { label: "Events / sec", value: 12, unit: "k", max: 20 },
      { label: "Uptime", value: 99.9, unit: "%", max: 100 },
    ],
    links: { github: "https://github.com/example/beta" },
    circuitSeed: 21,
    learnings: ["Sample learning: back-pressure is a feature, not a bug."],
  },
  {
    slug: "sample-project-gamma",
    round: 3,
    name: "Sample Project Gamma",
    category: ["Research", "AI/ML"],
    summary: "A sample research prototype exploring efficient on-device inference.",
    problem: "Sample problem: models were too large to run on edge hardware.",
    solution: "Sample solution: quantisation and distillation with a custom benchmark harness.",
    result: "Sample result: a 4× smaller model with minimal accuracy loss.",
    role: "Researcher",
    start: "2025-05",
    status: "in-progress",
    featured: true,
    stack: { engine: ["Python", "PyTorch"], electronics: ["ONNX", "CUDA"] },
    metrics: [
      { label: "Size reduction", value: 4, unit: "×", max: 5 },
      { label: "Accuracy retained", value: 97, unit: "%", max: 100 },
    ],
    links: { paper: "https://example.com/paper" },
    circuitSeed: 42,
    learnings: ["Sample learning: measure on the real device early."],
  },
  {
    slug: "sample-project-delta",
    round: 4,
    name: "Sample Project Delta",
    category: ["Frontend"],
    summary: "A sample design system and component library used across several apps.",
    problem: "Sample problem: inconsistent UI and duplicated components across products.",
    solution: "Sample solution: tokens, accessible primitives and visual regression tests.",
    result: "Sample result: new screens built twice as fast.",
    role: "Frontend engineer",
    start: "2024-02",
    end: "2024-06",
    status: "finished",
    stack: { aero: ["React", "TypeScript", "Storybook"], electronics: ["GitHub Actions"] },
    links: { github: "https://github.com/example/delta" },
    circuitSeed: 88,
    learnings: ["Sample learning: accessibility is cheapest at the primitive level."],
  },
];

export const sortedProjects = [...projects].sort((a, b) => a.round - b.round);
export const featuredProjects = sortedProjects.filter((p) => p.featured).slice(0, 3);
export const projectCategories = Array.from(new Set(projects.flatMap((p) => p.category))).sort();
