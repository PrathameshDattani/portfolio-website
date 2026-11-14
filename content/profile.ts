import type { Profile } from "./types";

/**
 * {{FULL_NAME}}, {{SHORT_NAME}}, {{DRIVER_NUMBER}}, {{TAGLINE}}, {{ROLE_TITLE}},
 * {{LOCATION}}, {{BIO_SHORT}}, {{BIO_LONG}}, {{TEAM_NAME}}: replace the sample values below.
 */
export const profile: Profile = {
  fullName: "Alex Sample",
  shortName: "SMP",
  driverNumber: 27,
  roleTitle: "Software Engineer",
  teamName: "Apex Labs",
  location: "Sample City",
  locationFlag: "🏁",
  timezone: "Asia/Kolkata",
  tagline: "Building fast, reliable software, from first commit to the chequered flag.",
  bioShort:
    "Sample bio: a software engineer who enjoys shipping well-engineered products, tuning systems for performance and learning something new every lap.",
  bioLong:
    "This is placeholder copy for {{BIO_LONG}}. Describe how you got into engineering, the problems you love solving and the kind of team you want to race with next.\n\nA second paragraph can cover your approach: measure first, iterate quickly, and keep the code readable for the next engineer on the pit wall. Replace this text in content/profile.ts.",
  stats: [
    { label: "Years coding", value: 4, f1Label: "Seasons", suffix: "+" },
    { label: "Projects shipped", value: 12, f1Label: "Race starts" },
    { label: "Internships", value: 2, f1Label: "Test sessions" },
    { label: "Hackathon podiums", value: 3, f1Label: "Podiums" },
  ],
  driverStats: [
    { label: "CGPA", value: "9.0", f1Label: "Qualifying pace" },
    { label: "Projects", value: 12, f1Label: "Starts" },
    { label: "Awards", value: 3, f1Label: "Podiums" },
    { label: "Open-source PRs", value: 40, f1Label: "Fastest laps", suffix: "+" },
    { label: "Languages", value: 5, f1Label: "Power units" },
    { label: "Coffee per sprint", value: "∞", f1Label: "Fuel load" },
  ],
  interests: ["Motorsport strategy", "Photography", "Mechanical keyboards", "Hiking", "Chess"],
  careerHighlights: [
    { year: "2022", title: "First commit", detail: "Started the journey with a sample project." },
    { year: "2023", title: "First podium", detail: "Placed at a sample hackathon." },
    { year: "2024", title: "Test & reserve seat", detail: "Joined Placeholder Systems as an intern." },
    { year: "2025", title: "Race seat", detail: "Full-time sample role at Sample Corp." },
  ],
  availability: "open",
  availabilityNote: "Open to full-time roles and interesting collaborations.",
  responseTime: "< 24h",
  profileImage: undefined, // e.g. "/images/profile.jpg"
  resumeUrl: "/resume.pdf",
};
