"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { projects } from "../data/data";
import Image from "next/image";

export default function Projects({ refProp }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleHoverStart = (index) => {
    setHoveredIndex(index);
  };

  const handleHoverEnd = () => {
    setHoveredIndex(null);
  };

  return (
    <div
      ref={refProp}
      className="z-10 w-full flex-col items-start justify-start space-y-8 text-white/50"
    >
      {projects.map((project, index) => (
        <motion.button
          key={index}
          whileHover={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.5)",
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
          onClick={() => window.open(project.link, "_blank")}
        >
          <div>
            <motion.img
              src={project.image}
              alt={project.title}
              width={150}
              height={50}
              whileHover={{
                scale: 5.0,
                boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 1)",
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="transform-gpu rounded-sm bg-slate-950"
            />
          </div>
          <div className="col-span-2 text-start">
            <div className="text-md mb-2">
              <span
                className={
                  hoveredIndex === index
                    ? "font-bold text-blue-300"
                    : "font-bold text-white"
                }
              >
                {project.title}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={
                    hoveredIndex === index
                      ? "ml-1 inline-block h-4 w-4 shrink-0 -translate-y-1 translate-x-1 transition-transform motion-reduce:transition-none"
                      : "ml-1 inline-block h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none"
                  }
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </div>
            <div className="mb-4 text-sm leading-relaxed text-slate-400">
              {project.description}
            </div>
            <div>
              {project.tags.map((tag, index) => (
                <div
                  key={index}
                  className="mb-2 mr-2 inline-block rounded-full bg-blue-500/10 p-1 px-2 text-sm font-medium text-blue-400"
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
