import type { Project } from "./types";

/** Projects from the resume. `round` sets calendar order (chronological by start). */
export const projects: Project[] = [
  {
    slug: "organ-transport-bio-refrigerator",
    round: 1,
    name: "Organ Transport Telemetry",
    category: ["IoT", "AI/ML", "Research"],
    summary:
      "Edge-to-cloud temperature sensing for organ-transport bio-refrigerators, with sensor fusion, anomaly detection and thermal forecasting.",
    problem:
      "Organs in transit need continuous, trustworthy core-temperature monitoring, even when connectivity drops. Single-point sensors are noisy and say little about the core temperature of the payload.",
    solution:
      "An edge-to-cloud IoT telemetry pipeline on a Raspberry Pi, streaming to MongoDB Atlas with offline SQLite buffering. Multi-point infrared sensors are polled in parallel over I2C and fused with Adaptive Kalman Filtering. Isolation Forest flags anomalies and ARIMA(2,1,2) forecasts thermal behaviour across payload inertias.",
    result:
      "Core-temperature estimation error brought down to ±0.3 °C, with resilient real-time monitoring during transit. Accepted and presented at the IEEE International Conference on Innovation in Computing, Data and Electronics, to be published in IEEE Xplore.",
    role: "Researcher & engineer",
    start: "2025-01",
    end: "2026-04",
    status: "finished",
    featured: true,
    stack: {
      engine: ["Python", "MongoDB Atlas", "SQLite"],
      electronics: ["Raspberry Pi", "I2C IR sensors", "Adaptive Kalman Filter", "Isolation Forest", "ARIMA"],
    },
    metrics: [
      { label: "Core temp. estimation error", value: 0.3, unit: "±°C" },
    ],
    links: { paper: "https://drive.google.com/file/d/1Mddk8K6T0xqiYwcENKHZErEvHq59gNOB/view?usp=sharing" },
    circuitSeed: 7,
  },
  {
    slug: "non-parametric-test-prediction",
    round: 2,
    name: "Non-Parametric Test Predictor",
    category: ["AI/ML", "Research"],
    summary:
      "An ML-driven framework that picks the right non-parametric statistical test, runs it, and explains the result, without the user needing a statistics background.",
    problem:
      "Choosing between Kruskal-Wallis, Friedman and Spearman's rank correlation takes statistical expertise many analysts don't have, and a wrong choice silently invalidates the conclusions.",
    solution:
      "A Random Forest classifier over TF-IDF NLP features describing the study, chosen by k-fold cross-validation over Decision Tree, SVM and Logistic Regression. An end-to-end pipeline predicts the test, executes it and emits structured outputs: p-values, H-statistics, Spearman's rho and decision rules.",
    result:
      "Statistical analysis that's accessible to non-specialists. Accepted and presented at the 5th World Conference on Information Systems for Business Management, Bangkok 2026, to be published in Springer's Lecture Notes in Networks and Systems.",
    role: "Researcher & ML engineer",
    start: "2026-01",
    end: "2026-03",
    status: "finished",
    featured: true,
    stack: {
      engine: ["Python", "Pandas", "NumPy"],
      electronics: ["Scikit-learn", "Random Forest", "TF-IDF", "k-fold CV"],
    },
    metrics: [
      { label: "Tests automated", value: 3 },
      { label: "Classifiers benchmarked", value: 4 },
    ],
    links: { paper: "https://drive.google.com/file/d/1JnHyDPTGJ_s9vxwPMh4NTg539YpxPDGW/view?usp=sharing" },
    circuitSeed: 21,
  },
  {
    slug: "multimodal-dementia-detection",
    round: 3,
    name: "Multimodal Dementia Detection",
    category: ["AI/ML", "Research"],
    summary:
      "A transformer-based, three-stage multimodal pipeline that detects early Alzheimer's disease from both speech audio and transcripts.",
    problem:
      "Early dementia shows up in how people speak as well as what they say, but most screening models look at a single modality and miss half the signal.",
    solution:
      "Unimodal feature extractors: DistilBERT fine-tuned on parsed linguistic tokens, and Wav2Vec 2.0 contextual embeddings from 16 kHz resampled audio chunks of the DementiaBank Pitt Corpus. A late-fusion transformer then uses cross-modal self-attention to merge acoustic and linguistic cues in a shared latent space.",
    result:
      "Multimodal accuracy and F1-score of 0.9640. Accepted and presented at the 7th International Conference on Data Science and Applications, Mauritius 2026, to be published in Springer's LNNS book series.",
    role: "Co-developer",
    start: "2026-03",
    end: "2026-04",
    status: "finished",
    featured: true,
    stack: {
      engine: ["Python", "PyTorch"],
      electronics: ["Hugging Face", "DistilBERT", "Wav2Vec 2.0", "Cross-modal attention"],
    },
    metrics: [
      { label: "Accuracy", value: 96.4, unit: "%", max: 100 },
      { label: "F1-score", value: 0.964, max: 1 },
      { label: "Audio sample rate", value: 16, unit: "kHz" },
    ],
    links: { paper: "https://drive.google.com/file/d/1rSTBV1CW1KBKnW5afcXsqUC7JAI8ol0u/view?usp=sharing" },
    circuitSeed: 42,
  },
  {
    slug: "migk-image-guided-key-derivation",
    round: 4,
    name: "MIGK Key Derivation",
    category: ["Security", "Research"],
    summary:
      "An image-guided cryptographic key derivation framework that turns a digital image into independent, brute-force-resistant keys.",
    problem:
      "Deriving strong, reproducible keys from rich media is attractive, but naive schemes leak structure and fall quickly to GPU-accelerated brute force.",
    solution:
      "A four-stage hierarchical framework: an image's grayscale projection is the secure root, independent RGB subkeys are derived via SHA-256 and HKDF expansion, an AES-CTR-seeded Fisher-Yates permutation shuffles the composition, and Argon2id stretching hardens the final key.",
    result:
      "7.84 bits/byte min-entropy, all 10 NIST SP 800-22 randomness tests passed, and an ideal 0.500 avalanche coefficient. Submitted to the 1st International Conference on Advances in Intelligence Systems, Security, and Cybernetics (pending acceptance).",
    role: "Independent researcher",
    start: "2026-04",
    end: "2026-04",
    status: "in-progress",
    stack: {
      engine: ["Python"],
      electronics: ["SHA-256", "HKDF", "AES-CTR", "Argon2id", "Fisher-Yates"],
    },
    metrics: [
      { label: "Min-entropy (bits/byte)", value: 7.84, max: 8 },
      { label: "NIST SP 800-22 tests passed", value: 10 },
      { label: "Avalanche coefficient", value: 0.5, max: 1 },
    ],
    circuitSeed: 88,
  },
];

export const sortedProjects = [...projects].sort((a, b) => a.round - b.round);
export const featuredProjects = sortedProjects.filter((p) => p.featured).slice(0, 3);
export const projectCategories = Array.from(new Set(projects.flatMap((p) => p.category))).sort();
