export type SkillGroup = {
  category: string;
  items: readonly string[];
};

export const skills: readonly SkillGroup[] = [
  {
    category: "Languages",
    items: [
      "Python",
      "TypeScript",
      "JavaScript",
      "Java",
      "Go",
      "Rust",
      "PHP",
      "SQL",
    ],
  },
  {
    category: "AI / ML",
    items: [
      "Pydantic AI",
      "LLM Agents",
      "RAG",
      "scikit-learn",
      "XGBoost",
      "Ollama",
      "pgvector",
    ],
  },
  {
    category: "Frameworks",
    items: [
      "React",
      "Next.js",
      "FastAPI",
      "Flask",
      "Express",
      "NestJS",
      "Prisma",
      "GraphQL",
      "Tailwind CSS",
    ],
  },
  {
    category: "Data",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Pandas", "ETL"],
  },
  {
    category: "Platform",
    items: ["AWS", "Vercel", "Docker", "Git", "CI/CD", "Jira", "Bitbucket"],
  },
];
