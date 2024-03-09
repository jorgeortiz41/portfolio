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
        className="flex flex-col lg:flex-row"
      >
        <HeroNav
          scrollTo={scrollTo}
          selected={selected}
          handleClick={handleClick}
        />

        <div className="flex w-full snap-y flex-col items-start justify-start space-y-32 text-white antialiased lg:w-1/2 lg:py-24 lg:pr-48">
          <div>
            <h1 className="sticky top-0 z-20 mb-4 w-full bg-transparent p-4 text-xl font-bold tracking-wide backdrop-blur lg:hidden ">
              ABOUT
            </h1>
            <About refProp={refs.about} />
          </div>
          <div>
            <h1 className="sticky top-0 z-20 mb-4 w-full bg-transparent p-4 text-xl font-bold tracking-wide backdrop-blur lg:hidden ">
              EXPERIENCE
            </h1>
            <Experience refProp={refs.experience} />
          </div>
          <div>
            <h1 className="sticky top-0 z-20 mb-4  w-full bg-transparent p-4 text-xl font-bold tracking-wide backdrop-blur lg:hidden ">
              PROJECTS
            </h1>
            <Projects refProp={refs.projects} />
          </div>
        </div>
      </motion.div>
    </>
  );
}
