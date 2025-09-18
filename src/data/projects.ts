export type Project = {
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
};

export const projectsData: Project[] = [
  {
    id: 1,
    title: "AutoBrief AI - Account Research Automation",
    category: "AI Sales Tools",
    description:
      "AI-powered account research platform that generates comprehensive company briefs and talking points for B2B sales teams, reducing prep time from hours to minutes.",
    longDescription:
      "AutoBrief AI revolutionizes sales preparation by automating the time-intensive process of account research. Using advanced AI models, it analyzes company information to generate structured briefs including company overview, key decision makers, pain points, and strategic talking points. This tool transforms how sales professionals prepare for client meetings, enabling them to walk into any conversation fully informed and ready to add value from the first interaction.",
    technologies: ["OpenAI GPT-4", "Next.js", "TypeScript", "Real-time API Integration", "JSON Processing"],
    features: [
      "Instant company analysis and brief generation",
      "Strategic talking points and value propositions",
      "Decision maker identification and insights",
      "Customizable brief templates and formats",
      "Export capabilities for CRM integration",
    ],
    image: "/generated_images/AutoBrief_AI_Dashboard_Interface_92b4f61c.png",
    githubUrl: "",
    liveUrl: "/brief",
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
    id: 3,
    title: "ICP Scorer - Ideal Customer Profile Analytics",
    category: "AI Sales Tools",
    description:
      "Data-driven lead scoring system that evaluates prospects against your ideal customer profile using heuristic algorithms and predictive analytics for better sales prioritization.",
    longDescription:
      "ICP Scorer leverages advanced analytics to help sales teams identify and prioritize the highest-value prospects. By analyzing multiple data points against your ideal customer profile criteria, it provides quantitative scoring that guides resource allocation and outreach strategies. This tool eliminates guesswork in lead prioritization and ensures sales efforts are focused on prospects with the highest probability of conversion.",
    technologies: ["Heuristic Algorithms", "CSV Processing", "Predictive Analytics", "React", "Data Visualization"],
    features: [
      "Automated lead scoring based on ICP criteria",
      "Bulk CSV upload and processing capabilities", 
      "Customizable scoring weights and parameters",
      "Priority-ranked prospect lists with rationale",
      "Export functionality for CRM integration",
    ],
    image: "/generated_images/ICP_Scorer_Analytics_Dashboard_28ca6c54.png",
    githubUrl: "",
    liveUrl: "/icp",
  },
  {
    id: 4,
    title: "Battlecard Builder - Competitive Intelligence AI",
    category: "AI Sales Tools",
    description:
      "AI-driven competitive analysis platform that generates comprehensive battlecards with objection handling strategies and competitive positioning for complex B2B sales scenarios.",
    longDescription:
      "Battlecard Builder empowers sales teams with AI-generated competitive intelligence and positioning strategies. This sophisticated tool analyzes competitive landscapes to create detailed battlecards that include feature comparisons, objection handling tactics, and strategic positioning advice. By automating competitive research and synthesis, it ensures sales teams are always prepared to differentiate their solutions and address competitive challenges effectively.",
    technologies: ["AI Analysis", "Competitive Intelligence", "Strategic Positioning", "Automated Research", "Next.js API Routes"],
    features: [
      "Automated competitive analysis and comparison",
      "Strategic positioning recommendations", 
      "Objection handling strategies for competitive scenarios",
      "Feature-by-feature comparison matrices",
      "Exportable battlecards for field sales teams",
    ],
    image: "/generated_images/Battlecard_Builder_Intelligence_Platform_1f1b00ad.png",
    githubUrl: "",
    liveUrl: "/battlecard",
  },
];

export const getProjectById = (id: number) => projectsData.find((p) => p.id === id);
export const getProjectCategories = () => Array.from(new Set(projectsData.map((p) => p.category)));
