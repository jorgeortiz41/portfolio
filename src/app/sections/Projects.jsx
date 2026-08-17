"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { projects, archivedProjects } from "../data/data";
import Image from "next/image";

export default function Projects({ refProp }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [archivedHoveredIndex, setArchivedHoveredIndex] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's 'sm' breakpoint is 640px
    };

    handleResize(); // Call handleResize initially to set the initial state

    window.addEventListener("resize", handleResize); // Listen for window resize events
    return () => {
      window.removeEventListener("resize", handleResize); // Clean up event listener on component unmount
    };
  }, []);

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
      {isMobile
        ? projects.map((project, index) => (
            <motion.button
              key={index}
              className="flex flex-col rounded-lg gap-2 bg-white/[0.03] p-4 shadow-xl"
              onClick={() =>
                project.link ? window.open(project.link, "_blank") : null
              }
            >
              <div className="text-start">
                <div className="mb-2 text-lg">
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
              <Image
                src={project.image}
                alt={project.title}
                width={250}
                height={50}
                className="rounded-sm bg-slate-950"
              />
            </motion.button>
          ))
        : projects.map((project, index) => (
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
                  ? "grid grid-cols-3 rounded-lg p-4 gap-2"
                  : hoveredIndex !== null
                  ? "grid grid-cols-3 rounded-lg p-4 opacity-50 gap-2"
                  : "grid grid-cols-3 rounded-lg p-4 gap-2"
              }
              onHoverStart={() => handleHoverStart(index)}
              onHoverEnd={handleHoverEnd}
              onClick={() =>
                project.link ? window.open(project.link, "_blank") : null
              }
            >
              <div>
                <motion.img
                  src={project.image}
                  alt={project.title}
                  width={150}
                  height={50}
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

      <div className="w-full">
        <button
          className="flex items-center text-lg font-bold text-white hover:text-blue-300"
          onClick={() => setShowArchived((prev) => !prev)}
        >
          Earlier Projects
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={
              showArchived
                ? "ml-1 inline-block h-4 w-4 shrink-0 rotate-180 transition-transform motion-reduce:transition-none"
                : "ml-1 inline-block h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none"
            }
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <AnimatePresence initial={false}>
          {showArchived && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-col space-y-8">
                {archivedProjects.map((project, index) => (
                  <motion.button
                    key={index}
                    whileHover={
                      !isMobile
                        ? {
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.5)",
                          }
                        : undefined
                    }
                    transition={{
                      duration: 0.1,
                      delay: 0,
                      ease: "easeInOut",
                    }}
                    className={
                      isMobile
                        ? "flex flex-col rounded-lg gap-2 bg-white/[0.03] p-4 shadow-xl"
                        : archivedHoveredIndex === index
                        ? "grid grid-cols-3 rounded-lg p-4 gap-2"
                        : archivedHoveredIndex !== null
                        ? "grid grid-cols-3 rounded-lg p-4 opacity-50 gap-2"
                        : "grid grid-cols-3 rounded-lg p-4 gap-2"
                    }
                    onHoverStart={() => setArchivedHoveredIndex(index)}
                    onHoverEnd={() => setArchivedHoveredIndex(null)}
                    onClick={() =>
                      project.link
                        ? window.open(project.link, "_blank")
                        : null
                    }
                  >
                    <div className={isMobile ? "" : ""}>
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        width={isMobile ? 250 : 150}
                        height={50}
                        className="rounded-sm bg-slate-950"
                      />
                    </div>
                    <div
                      className={
                        isMobile ? "text-start" : "col-span-2 text-start"
                      }
                    >
                      <div className="mb-2 text-md">
                        <span
                          className={
                            archivedHoveredIndex === index
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
                              archivedHoveredIndex === index
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
                        {project.tags.map((tag, tagIndex) => (
                          <div
                            key={tagIndex}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
