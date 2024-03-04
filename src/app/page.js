"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import { HeroNav } from "./sections/HeroNav";

export default function Home() {
  const refs = {
    about: useRef(null),
    experience: useRef(null),
    projects: useRef(null),
  };

  const scrollTo = (section) => {
    if (section === "about") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (refs[section] && refs[section].current) {
      refs[section].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0,
          ease: "easeInOut",
        }}
        className="flex"
      >
        <HeroNav scrollTo={scrollTo} />
        <div className="flex w-1/2 snap-y flex-col items-start justify-start space-y-32  py-24 pr-48 text-white antialiased">
          <About refProp={refs.about} />
          <Experience refProp={refs.experience} />
          <Projects refProp={refs.projects} />
        </div>
      </motion.div>
    </>
  );
}
