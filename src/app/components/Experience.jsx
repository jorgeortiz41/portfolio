"use client";
import { motion } from "framer-motion";
import { useState } from "react";

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
    <div className="z-10 w-full flex-col items-start justify-start space-y-8 text-white/50">
      {experiences.map((job, index) => (
        <motion.button
          key={index}
          whileHover={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.5)",
          }}
          transition={{
            duration: 0.3,
            delay: 0,
            ease: "easeInOut",
          }}
          className="grid grid-cols-3 rounded-lg p-4"
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
      ))}
    </div>
  );
}
