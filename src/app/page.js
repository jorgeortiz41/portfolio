"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
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
        <Image
          src="/JorgeOrtiz.webp"
          alt="Jorge Ortiz"
          width={200}
          height={200}
          className="z-10 rounded-full"
          priority
        />
        <h1 className="relative z-10 bg-gradient-to-b from-neutral-200  to-neutral-600 bg-clip-text p-4 text-center font-sans text-lg font-bold text-transparent md:text-7xl">
          Jorge Ortiz
        </h1>
        <p className="text-md relative z-10 mx-auto my-2 max-w-lg text-center text-neutral-500 ">
          A software engineer with expertise in developing and deploying web
          applications.
        </p>
        <motion.button
          className="hover:animate-shimmer z-10 mt-4 inline-flex h-12 transform-gpu items-center justify-center rounded-md
          border border-slate-800
          bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium
          text-slate-400 hover:bg-[linear-gradient(110deg,#000103,45%,#4e5762,55%,#000103)]"
          onClick={() => {
            const link = document.createElement("a");
            link.href = "/ResumeFeb2024.pdf";
            link.download = "ResumeFeb2024.pdf";
            link.click();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Resume
        </motion.button>
      </div>
    </motion.div>
  );
}
