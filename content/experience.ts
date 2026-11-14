import type { Experience } from "./types";

/** Newest first. `color` is an original livery colour for each team. */
export const experience: Experience[] = [
  {
    company: "Computer Society of India, DJSCE",
    role: "Mentor",
    seat: "Team Principal",
    start: "2026-08",
    location: "Mumbai, India",
    color: "#A855F7",
    results: [
      "Advised the executive committee on strategic planning and resource management for large-scale technical symposiums.",
      "Mentored junior members through technical workshops and hands-on project guidance in AI and backend systems.",
      "Established standardised operational frameworks and documentation, ensuring seamless handover to the incoming leadership team.",
    ],
    stack: ["Leadership", "Mentoring", "Event strategy"],
  },
  {
    company: "AIVision21",
    role: "AI Developer Intern",
    seat: "Test & Reserve Driver",
    start: "2026-01",
    end: "2026-04",
    location: "Mumbai, India",
    color: "#3B82F6",
    results: [
      "Developed and deployed an AI-integrated internal CRM over a growing 30,000+ record database, with hierarchical RBAC and AI-driven summarisation.",
      "Engineered a standalone asynchronous data-extraction agent running on 30+ edge devices, securely uploading 6,000+ records every week.",
      "Implemented automated pipelines and schedulers that apply AI models for real-time classification, categorisation and data management.",
      "Worked directly with management and 15+ stakeholders to gather requirements and shape architectural decisions.",
    ],
    stack: ["Python", "LLMs", "RBAC", "Async agents", "Schedulers"],
  },
  {
    company: "Computer Society of India, DJSCE",
    role: "Treasurer",
    seat: "Team Principal",
    start: "2025-08",
    end: "2026-08",
    location: "Mumbai, India",
    color: "#EAB308",
    results: [
      "Directed financial operations and strategic budgeting for a premier technical society, with transparent allocation and institutional compliance.",
      "Led corporate sponsorship pitches with industry partners, negotiating and closing deals that funded major tech events.",
      "Maintained ledgers and ran periodic audits, reporting to the college administration.",
    ],
    stack: ["Budgeting", "Sponsorships", "Audits"],
  },
  {
    company: "T&M Services Consulting",
    role: "Backend and Applied AI Intern",
    seat: "Test & Reserve Driver",
    start: "2025-06",
    end: "2025-12",
    location: "Mumbai, India",
    color: "#22C55E",
    results: [
      "Architected AI recruitment solutions: an AI interview platform that cut manual screening time by 60%, and a CV analyser trained on 80,000+ records that processes 3,000+ resumes a month.",
      "Led end-to-end development and deployment of a scalable, client-facing Test Assessment microservice.",
      "Deployed containerised FastAPI services on Docker and GCP with horizontal scaling, sub-300 ms average responses and 10,000+ API requests a month.",
      "Worked directly with clients to gather requirements and validate features against their workflows.",
    ],
    stack: ["Python", "FastAPI", "Docker", "GCP", "Microservices"],
  },
];
