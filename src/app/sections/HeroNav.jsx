"use client";
import { motion } from "framer-motion";
import { RouteButton } from "../components/NavBarButtons";
import { GithubLogo, LinkedinLogo, EmailLogo } from "../data/data";

export const HeroNav = ({ scrollTo, selected, handleClick }) => {
  const iconButtons = ({
    content,
    route = window.location.href,
    ariaLabel,
  }) => {
    return (
      <a href={route} target="_blank" aria-label={ariaLabel}>
        <motion.div className="h-full rounded-sm border-2 border-transparent p-4">
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
      className="top-0 mb-10 w-full flex-col items-start justify-between p-4 lg:sticky lg:mb-0 lg:flex lg:h-screen lg:w-1/2 lg:overflow-auto lg:py-24 lg:pl-48"
    >
      <div className="flex flex-col items-start">
        <h1 className="relative z-10 font-mono text-5xl font-semibold text-white md:text-5xl">
          <a href="/">Jorge Ortiz</a>
        </h1>
        <h2 className="relative my-4 text-lg text-white lg:italic">
          Software Engineering Student
        </h2>
        <p></p>
      </div>
      <div className="hidden flex-col items-start lg:flex">
        <RouteButton
          content="About"
          selected={selected}
          scrollTo={scrollTo}
          handleClick={handleClick}
        />
        <RouteButton
          content="Experience"
          selected={selected}
          scrollTo={scrollTo}
          handleClick={handleClick}
        />
        <RouteButton
          content="Projects"
          selected={selected}
          scrollTo={scrollTo}
          handleClick={handleClick}
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
