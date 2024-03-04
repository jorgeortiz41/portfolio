"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { CardContainer, CardBody, CardItem } from "../components/HoverCard";
import { experiences } from "../data/data";

export default function Experience({ refProp }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hover, setHover] = useState(false);

  const handleHoverStart = (index) => {
    setHoveredIndex(index);
  };

  const handleHoverEnd = () => {
    setHoveredIndex(null);
  };

  return (
    <div
      ref={refProp}
      className="text-white/50c z-10 w-full snap-start scroll-mt-12 flex-col items-start justify-start space-y-8"
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
      <div className="text-xl">
        <button
          className={hover ? "text-blue-300" : "text-white"}
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
