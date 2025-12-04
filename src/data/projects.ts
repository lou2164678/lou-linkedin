export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  technologies: string[];
  features: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
}

export const projectsData: Project[] = [
  {
    id: 5,
    title: "Prospect Vetting Assistant - Streaming Gemini Reports",
    category: "AI Sales Tools",
    description:
      "Real-time prospect research assistant that streams structured Gemini briefings through OpenRouter, turning raw company inputs into seller-ready insights.",
    longDescription:
      "The Prospect Vetting Assistant accelerates outbound prep by combining Gemini's up-to-date knowledge with a streaming experience optimised for sales teams. Reps provide a company name and instantly receive a structured Markdown briefing covering strategic position, product fit, active initiatives, risk flags, and actionable next plays. The experience mirrors a live analyst typing findings in real time, reducing prep cycles from hours to minutes.",
    technologies: ["Gemini 2.5 Flash", "OpenRouter", "Streaming UX", "React", "TypeScript"],
    features: [
      "Streaming Markdown brief with eight seller-focused sections",
      "Seller-ready insights with recommended plays and buyer personas",
      "Copy-to-clipboard Markdown export for CRM or docs",
      "Abortable generations with automatic state management",
      "OpenRouter API key storage via secure local preference",
    ],
    image: "/generated_images/AutoBrief_AI_Dashboard_Interface_92b4f61c.png",
    githubUrl: "",
    liveUrl: "/prospect",
  },
  {
    id: 2,
    title: "Objection Knowledge Base - AI-Powered Sales Support",
    category: "AI Sales Tools",
    description:
      "Intelligent objection handling system using RAG (Retrieval-Augmented Generation) to provide contextual responses and build institutional knowledge for sales teams.",
    longDescription:
      "The Objection Knowledge Base transforms how sales teams handle customer objections by building a searchable, AI-powered repository of proven responses. Using advanced vector embeddings and retrieval-augmented generation, it provides instant access to contextual objection handling strategies based on your team's collective experience. This system ensures consistent messaging while enabling continuous learning and improvement of objection handling techniques.",
    technologies: ["Vector Embeddings", "RAG Architecture", "PDF Processing", "Cosine Similarity", "OpenAI Embeddings"],
    features: [
      "Document upload and automatic indexing",
      "AI-powered objection response generation",
      "Citation-backed answers for credibility",
      "Searchable knowledge base with semantic matching",
      "Continuous learning from new objection scenarios",
    ],
    image: "/generated_images/Objection_Knowledge_Base_Interface_1c76297d.png",
    githubUrl: "",
    liveUrl: "/objections",
  },
  {
    id: 6,
    title: "AI Interview Pack Generator",
    category: "AI Sales Tools",
    description:
      "Turn a short role query into a structured, JSON-based interview prep pack with a clean visual report.",
    longDescription:
      "The AI Interview Pack Generator converts a simple role/context prompt into a deeply structured interview preparation document. It strictly returns a JSON object that our UI renders into a polished report and a raw JSON view for power users, enabling fast, credible prep with live-grounded sources.",
    technologies: ["Gemini 2.5 Pro", "OpenRouter", "JSON Mode", "React", "TypeScript"],
    features: [
      "Strict JSON output with schema enforcement",
      "Visual Report and Raw JSON tabs",
      "Live web grounding with citations",
      "Reusable sections (facts, plan, rubric)",
      "Copy-to-clipboard for JSON export",
    ],
    image: "/generated_images/Interview_Pack_Generator_Interface.svg",
    githubUrl: "",
    liveUrl: "/interview-pack",
  },
  {
    id: 7,
    title: "Commission Forecaster & Scenario Planner",
    category: "AI Sales Tools",
    description:
      "Interactive earnings calculator with what-if scenario modeling. Visualize your path to quota with customizable accelerators.",
    longDescription:
      "The Commission Forecaster helps sales professionals model their earnings with precision. Enter your comp plan details (base, OTE, quota, accelerators), add pipeline deals with close probabilities, and use scenario sliders to answer 'what if' questions. The interactive earnings curve chart shows accelerator breakpoints and your current projected position, helping you make data-driven decisions about deal prioritization and quota attainment strategies.",
    technologies: ["React", "TypeScript", "Recharts", "Framer Motion"],
    features: [
      "Customizable comp plan with accelerator tiers",
      "Pipeline deal management with probability weighting",
      "What-if scenario sliders for earnings projection",
      "Interactive earnings curve visualization",
      "Accelerator breakpoint indicators",
      "Real-time quota attainment tracking",
    ],
    image: "/generated_images/Commission_Forecaster_Interface.png",
    githubUrl: "",
    liveUrl: "/commission",
  },
];

export const getProjectById = (id: number) => projectsData.find((p) => p.id === id);
export const getProjectCategories = () => Array.from(new Set(projectsData.map((p) => p.category)));
