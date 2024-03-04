"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import { HeroNav } from "./sections/HeroNav";

export default function Home() {
  const [selected, setSelected] = useState("about");

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

  const handleScroll = () => {
    const aboutRect = refs.about.current.getBoundingClientRect();
    const experienceRect = refs.experience.current.getBoundingClientRect();
    const projectsRect = refs.projects.current.getBoundingClientRect();

    const scrollPosition = window.scrollY;

    if (
      scrollPosition >= aboutRect.top &&
      scrollPosition < experienceRect.top
    ) {
      setSelected("about");
    } else if (
      scrollPosition >= experienceRect.top &&
      scrollPosition < projectsRect.top
    ) {
      setSelected("experience");
    } else if (
      scrollPosition >= projectsRect.top &&
      scrollPosition < projectsRect.bottom
    ) {
      setSelected("projects");
    }
  };

  const handleClick = (option) => {
    setSelected(option);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        <HeroNav
          scrollTo={scrollTo}
          selected={selected}
          handleClick={handleClick}
        />
        <div className="flex w-1/2 snap-y flex-col items-start justify-start space-y-32  py-24 pr-48 text-white antialiased">
          <About refProp={refs.about} />
          <Experience refProp={refs.experience} />
          <Projects refProp={refs.projects} />
        </div>
      </motion.div>
    </>
  );
}
