import type { Achievement } from "./types";

/** Awards and certifications. Mark podium finishes as `featured` for the top of /podium. */
export const achievements: Achievement[] = [
  {
    title: "First runner-up, Nirmaan 2026",
    event: "Nirmaan 2026",
    position: "P2",
    date: "2026",
    description: "Project-showcasing competition organised by DJ Init.AI.",
    featured: true,
  },
  {
    title: "Finalist, Hackniche 4.0",
    event: "Hackniche 4.0",
    position: "Finisher",
    description: "National-level hackathon organised by GDG DJSCE and DJS Synapse.",
  },
  {
    title: "Foundations of Neural Networks",
    event: "Johns Hopkins University",
    position: "Finisher",
    description: "Certification (Coursera).",
    link: "https://coursera.org/share/74cead918712e5f1579a310cf1b330e1",
  },
  {
    title: "AWS Academy Graduate: Cloud Architecting",
    event: "AWS Academy",
    position: "Finisher",
    description: "Certification (Credly badge).",
    link: "https://www.credly.com/badges/265ec966-c03c-4e51-9ec4-1a29d4508d2c/public_url",
  },
  {
    title: "IBM RAG and Agentic AI Professional Certificate",
    event: "IBM",
    position: "Finisher",
    description: "Professional certificate (Coursera).",
    link: "https://coursera.org/share/b564c0151ac4a7814a40eccccb242b79",
  },
];
