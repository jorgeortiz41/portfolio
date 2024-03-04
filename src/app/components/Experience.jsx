"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { CardContainer, CardBody, CardItem } from "./HoverCard";

const experiences = [
  {
    title: "Software Engineer Intern",
    company: "Red Ventures",
    date: "MAY — AUG 2023",
    description:
      "Collaborated with the Platea team to deliver front-end and back-end features on multiple websites. Utilized Word- Press, Twig, Timber, and PHP for front-end, and Prisma and Nest for back-end. Enhanced user engagement by implementing a ’Save’ feature for blog content and developing an API for user- generated lists. Drove A/B testing initiatives by coding two content gates, optimizing user interaction, and refining conversion pathways. Demonstrated proficiency in React and TypeScript while working on an additional site, further diversifying skill set and impact.",
    tags: [
      "React",
      "TypeScript",
      "Wordpress",
      "Twig",
      "Timber",
      "PHP",
      "Prisma",
      "Nest",
      "HTML & SCSS",
    ],
  },
  {
    title: "Software Engineer REU",
    company: "Arecibo Observatory",
    date: "MAY — AUG 2022",
    description:
      "Independently developed a proof of concept MERN stack web application under the guidance of a mentor. The application showcased real-time data from the 12m Radio Telescope, accompanied by a logging tool for operational data collection.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Mongoose", "HTML & SCSS"],
  },
  {
    title: "Software Developer",
    company: "SEA UPRM",
    date: "SEP 2021 — MAY 2022",
    description:
      "I Developed web modules using PHP/Laravel/MySQL for the different services the organization offers. In addition to my technical responsibilities, I also collaborated with multidisciplinary teams to gather requirements, prioritize feature requests, provide technical support and training to end-users.",
    tags: ["PHP", "Laravel", "MySQL", "HTML & SCSS"],
  },
  {
    title: "Data Analyst Intern",
    company: "VIPPR",
    date: "SEP 2020 — FEB 2021",
    description:
      "Collaborated with an organization dedicated to aiding those affected by the 2020 Puerto Rico earthquakes. Focused on facilitating home reconstruction, I managed and processed thousands of requests containing demographic, financial, and diverse datasets. Leveraging Python scripts and data analysis techniques, I extracted meaningful insights to inform strategic decision-making and resource allocation.",
    tags: ["Python", "Pandas", "Numpy", "Matplotlib", "Seaborn", "Jupyter"],
  },
];

export default function Experience() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleHoverStart = (index) => {
    setHoveredIndex(index);
  };

  const handleHoverEnd = () => {
    setHoveredIndex(null);
  };

  return (
    <div
      id="experience"
      className="z-10 w-full flex-col items-start justify-start space-y-8 text-white/50"
    >
      {experiences.map((job, index) => (
        <CardContainer key={index}>
          <CardBody>
            <CardItem translateZ={10}>
              <motion.button
                key={index}
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.5)",
                }}
                transition={{
                  duration: 0.1,
                  delay: 0,
                  ease: "easeInOut",
                }}
                className={
                  hoveredIndex === index
                    ? "grid grid-cols-3 rounded-lg p-4"
                    : hoveredIndex !== null
                      ? "grid grid-cols-3 rounded-lg p-4 opacity-50"
                      : "grid grid-cols-3 rounded-lg p-4"
                }
                onHoverStart={() => handleHoverStart(index)}
                onHoverEnd={handleHoverEnd}
              >
                <div>
                  <p className="text-start text-xs">{job.date}</p>
                </div>
                <div className="col-span-2 text-start">
                  <div className="text-md mb-2">
                    <span
                      className={
                        hoveredIndex === index ? "text-blue-300" : "text-white"
                      }
                    >
                      {job.title} • {job.company}
                      {job.company === "Red Ventures" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          class={
                            hoveredIndex === index
                              ? "ml-1 inline-block h-4 w-4 shrink-0 -translate-y-1 translate-x-1 transition-transform motion-reduce:transition-none"
                              : "ml-1 inline-block h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none"
                          }
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      )}
                    </span>
                  </div>
                  <div className="mb-4 text-sm">{job.description}</div>
                  <div>
                    {job.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="mb-2 mr-2 inline-block rounded-full bg-blue-500/10 p-1 px-2 text-sm text-blue-400"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.button>
            </CardItem>
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
}
