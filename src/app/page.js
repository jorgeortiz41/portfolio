"use client";
import { motion } from "framer-motion";
import About from "./components/About";
import Experience from "./components/Experience";
import { HeroNav } from "./components/HeroNav";

export default function Home() {
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
        <HeroNav />
        <div className="flex w-1/2 flex-col items-start justify-start space-y-32  py-24 pr-48 text-white antialiased">
          <About />
          <Experience />
        </div>
      </motion.div>
    </>
  );
}
