"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { RouteButton } from "../components/NavBarButtons";
import { GithubLogo, LinkedinLogo, EmailLogo } from "../data/data";

export const HeroNav = ({ scrollTo }) => {
  const [selected, setSelected] = useState("home");

  const handleClick = (option) => {
    setSelected(option);
  };
  const iconButtons = ({
    content,
    route = window.location.href,
    ariaLabel,
  }) => {
    return (
      <a href={route} target="_blank" aria-label={ariaLabel}>
        <motion.div
          className={`h-full rounded-sm border-2 border-transparent
            bg-gradient-to-b from-neutral-200 to-neutral-600 bg-clip-text
            p-4 text-xl text-transparent antialiased
            ${content === "Contact:" ? "" : "hover:animate-shimmer hover:bg-[linear-gradient(110deg,#0d9dde,25%,#a748de,55%,#0d9dde)] hover:bg-[length:200%_100%] hover:bg-clip-text"}`}
        >
          {content}
        </motion.div>
      </a>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        delay: 0,
        ease: "easeInOut",
      }}
      className="sticky top-0 flex h-screen w-1/2 flex-col items-start justify-between overflow-auto py-24 pl-48"
    >
      <div className="flex flex-col items-start">
        <h1 className="relative z-10 font-mono text-sm font-semibold text-white md:text-5xl">
          <a href="/">Jorge Ortiz</a>
        </h1>
        <h2 className="relative my-4 text-lg italic text-white">
          Software Engineering Student
        </h2>
        <p></p>
      </div>
      <div className="flex flex-col items-start">
        <RouteButton content="About" selected={selected} scrollTo={scrollTo} />
        <RouteButton
          content="Experience"
          selected={selected}
          scrollTo={scrollTo}
        />
        <RouteButton
          content="Projects"
          selected={selected}
          scrollTo={scrollTo}
        />
      </div>
      <div className="flex flex-col items-start">
        <div className="flex flex-row space-x-2">
          {iconButtons({
            content: EmailLogo,
            route: "mailto:jortizsoftware@gmail.com",
            ariaLabel: "Email",
          })}
          {iconButtons({
            content: GithubLogo,
            route: "https://github.com/jorgeortiz41",
            ariaLabel: "GitHub",
          })}
          {iconButtons({
            content: LinkedinLogo,
            route: "https://www.linkedin.com/in/jorgeaortizramirez/",
            ariaLabel: "LinkedIn",
          })}
        </div>
      </div>
    </motion.div>
  );
};
