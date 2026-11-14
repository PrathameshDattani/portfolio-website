import type { Achievement } from "./types";

/** {{ACHIEVEMENTS[]}}: mark up to three as `featured` for the podium. */
export const achievements: Achievement[] = [
  {
    title: "Winner, Sample Hackathon",
    event: "Sample Hackathon",
    position: "P1",
    date: "2024-03",
    description: "Sample description: built a real-time assistant in 36 hours.",
    link: "https://example.com",
    featured: true,
  },
  {
    title: "Runner-up, Placeholder Code Sprint",
    event: "Placeholder Code Sprint",
    position: "P2",
    date: "2023-11",
    description: "Sample description: second place out of 120 teams.",
    featured: true,
  },
  {
    title: "Third place, Example Datathon",
    event: "Example Datathon",
    position: "P3",
    date: "2023-07",
    description: "Sample description: a forecasting challenge.",
    featured: true,
  },
  {
    title: "Sample Cloud Certification",
    event: "Sample Certification",
    position: "Finisher",
    date: "2024-09",
    link: "https://example.com/cert",
  },
  {
    title: "Sample Merit Scholarship",
    event: "Sample Scholarship",
    position: "Finisher",
    date: "2022-08",
    description: "Sample description: awarded to the top 1% of the cohort.",
  },
];
