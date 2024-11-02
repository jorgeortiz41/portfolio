"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { experiences } from "../data/data";

export default function Experience({ refProp }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const linkCompanies = ["LeadWire Marketing", "Red Ventures"];

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

  const renderLinkArrow = (job, index) => {
    if (linkCompanies.includes(job.company)) {
      if (isMobile) {
        return (
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
        );
      } else {
        return (
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
        );
      }
    }
  };

  return (
    <div
      ref={refProp}
      className="text-white/50c z-10 w-full snap-start scroll-mt-4 flex-col items-start justify-start space-y-8"
    >
      {isMobile
        ? experiences.map((job, index) => (
            <motion.button
              key={index}
              className="flex-flex-col rounded-lg bg-white/[0.03] p-4 shadow-xl"
              onClick={() =>
                job.link ? window.open(job.link, "_blank") : null
              }
            >
              <div className="self-end pb-2">
                <p className="text-start text-xs text-slate-400">{job.date}</p>
              </div>
              <div className="text-start">
                <div className="text-md mb-2">
                  <span
                    className={
                      hoveredIndex === index
                        ? "font-bold text-blue-300"
                        : "font-bold text-white"
                    }
                  >
                    {job.title} • {job.company}
                    {renderLinkArrow(job, index)}
                  </span>
                </div>
                <div className="mb-4 text-sm leading-relaxed text-slate-400">
                  {job.description}
                </div>
                <div>
                  {job.tags.map((tag, index) => (
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
          ))
        : experiences.map((job, index) => (
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
              onClick={() =>
                job.link ? window.open(job.link, "_blank") : null
              }
            >
              <div>
                <p className="text-start text-xs text-slate-400">{job.date}</p>
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
                    {job.title} • {job.company}
                    {renderLinkArrow(job, index)}
                  </span>
                </div>
                <div className="mb-4 text-sm leading-relaxed text-slate-400">
                  {job.description}
                </div>
                <div>
                  {job.tags.map((tag, index) => (
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
      <div className="text-lg">
        <button
          className={
            hover ? "p-4 font-bold text-blue-300" : "p-4 font-bold text-white"
          }
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => window.open("/resume.pdf", "_blank")}
        >
          View Full Résumé
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={
              hover
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
        </button>
      </div>
    </div>
  );
}
