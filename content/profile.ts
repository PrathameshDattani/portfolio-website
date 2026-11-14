import type { Profile } from "./types";

/**
 * Personal details. Values marked "CHOOSE" are not on the resume and are yours to pick.
 */
export const profile: Profile = {
  fullName: "Prathamesh Dattani",
  // CHOOSE: 3-letter driver code (F1 convention: first three letters of the surname)
  shortName: "DAT",
  // CHOOSE: your race number, 1–99
  driverNumber: 27,
  roleTitle: "AI & Backend Engineer",
  // CHOOSE: your personal "constructor" brand. Defaults to your college.
  teamName: "DJSCE",
  location: "Mumbai, India",
  locationFlag: "🇮🇳",
  timezone: "Asia/Kolkata",
  tagline: "Building AI systems and backends that hold up in production, from research paper to deployed service.",
  bioShort:
    "I'm an Information Technology student at DJSCE, Mumbai, building applied AI and backend systems: recruitment platforms, AI-integrated CRMs, edge data agents, and research published with Springer and IEEE.",
  bioLong:
    "I'm in my B.Tech in Information Technology at Dwarkadas J. Sanghvi College of Engineering, with Honors in DevOps and a CGPA of 9.49. Most of my work sits where machine learning meets production engineering: I like taking a model out of a notebook and turning it into a service that real people depend on.\n\nAs a Backend and Applied AI intern at T&M Services Consulting, I built an AI interview platform that cut manual screening time by 60%, a CV analyser trained on 80,000+ records, and containerised FastAPI microservices on GCP with sub-300 ms response times. At AIVision21 I built an AI-integrated CRM over 30,000+ records and an asynchronous extraction agent running across 30+ edge devices.\n\nAlongside industry work I do research: multimodal dementia detection, ML-driven statistical test selection, image-guided cryptographic key derivation and IoT telemetry for organ transport. Three of those papers have been accepted at Springer and IEEE conferences. Off the clock I mentor at the Computer Society of India chapter at DJSCE, where I was previously treasurer.",
  stats: [
    { label: "Papers accepted", value: 3, f1Label: "Podiums" },
    { label: "Industry internships", value: 2, f1Label: "Test sessions" },
    { label: "Records in production systems", value: 30, f1Label: "Laps led", suffix: "k+" },
    { label: "CGPA", value: 9.49, f1Label: "Qualifying pace" },
  ],
  driverStats: [
    { label: "CGPA (out of 10)", value: 9.49, f1Label: "Qualifying pace" },
    { label: "Research papers accepted", value: 3, f1Label: "Podiums" },
    { label: "Industry internships", value: 2, f1Label: "Test sessions" },
    { label: "Certifications", value: 3, f1Label: "Super licences" },
    { label: "Hackathon & showcase finals", value: 2, f1Label: "Points finishes" },
    { label: "Spoken languages", value: 3, f1Label: "Radio channels" },
  ],
  interests: ["Applied ML research", "Cryptography", "IoT and edge systems", "DevOps", "Mentoring"],
  careerHighlights: [
    { year: "2023", title: "Grid slot at DJSCE", detail: "Started B.Tech in Information Technology, Honors in DevOps." },
    { year: "2025", title: "First test session", detail: "Backend and Applied AI Intern at T&M Services Consulting." },
    { year: "2025", title: "Into the paddock", detail: "Elected Treasurer of the Computer Society of India, DJSCE." },
    { year: "2026", title: "Second team", detail: "AI Development Intern at AIVision21." },
    { year: "2026", title: "Published", detail: "Papers accepted at Springer LNNS and IEEE conferences." },
  ],
  availability: "open",
  availabilityNote: "Open to internships, graduate roles from 2027, and research collaborations.",
  responseTime: "< 24h",
  profileImage: undefined, // add a photo at public/images/profile.jpg and set "/images/profile.jpg"
  resumeUrl: "/resume.pdf",
};
