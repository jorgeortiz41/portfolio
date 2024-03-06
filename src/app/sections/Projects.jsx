"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { CardContainer, CardBody, CardItem } from "../components/HoverCard";
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

  const createDiscordLink = () => {
    return (
      <div>
        A Discord bot that uses OpenAI{"'"}s GPT-3.5-Turbo to generate text
        based on user input, also the bot can also generate spreadsheet data in
        CSV.
        <br />
        <a
          href="https://discord.com/oauth2/authorize?client_id=1164764096269402134&permissions=27482422508609&scope=bot"
          className="text-sm font-bold text-white hover:underline"
          target="_blank"
        >
          Add it to your server!
        </a>
      </div>
    );
  };

  return (
    <div
      ref={refProp}
      className="z-10 w-full flex-col items-start justify-start space-y-8 text-white/50"
    >
      {projects.map((project, index) => (
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
                  <CardItem translateZ={500}>
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      width={150}
                      height={50}
                      whileHover={{
                        scale: 4.0,
                        x: -250,
                        y: -100,
                        boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.5)",
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                      className="transform-gpu rounded-sm bg-slate-950"
                    />
                  </CardItem>
                </div>
                <div className="col-span-2 text-start">
                  <div className="text-md mb-2">
                    <span
                      className={
                        hoveredIndex === index
                          ? "font-black text-blue-300"
                          : "font-black text-white"
                      }
                    >
                      {project.title}
                    </span>
                  </div>
                  <div className="mb-4 text-sm">
                    {project.title === "GPT Discord Bot"
                      ? createDiscordLink()
                      : project.description}
                  </div>
                  <div>
                    {project.tags.map((tag, index) => (
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
