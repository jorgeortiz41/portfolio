"use client";
import { motion } from "framer-motion";

export default function About() {
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
        className="relative flex h-screen w-full flex-col items-center justify-center rounded-md bg-neutral-950 antialiased"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center p-4">
          <h1 className="relative z-10 bg-gradient-to-b from-neutral-200  to-neutral-600 bg-clip-text p-4 text-center font-sans text-lg font-bold text-transparent md:text-7xl">
            Experience
          </h1>
          <p className="text-md relative z-10 mx-auto my-2 max-w-lg text-center text-neutral-500 ">
            A software engineer with expertise in developing and deploying web
            applications.
          </p>
        </div>
      </motion.div>
    </>
  );
}
