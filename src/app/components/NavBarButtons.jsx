"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, memo } from "react";

export const buttonAnimation = ({
  content,
  route = "/",
  handleClick,
  selected,
}) => {
  let currentStyle = "";
  if (content === "Contact:") {
    currentStyle = contactStyle;
  } else if (content.toLowerCase() === selected) {
    currentStyle = selectedStyle;
  } else {
    currentStyle = unSelectedStyle;
  }
  return (
    <Link href={route} prefetch={true}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0,
          ease: "easeInOut",
        }}
        className={`h-full rounded-sm border-2 border-transparent
          p-4 text-xl text-transparent antialiased
          ${currentStyle}`}
        onClick={() => handleClick(content.toLowerCase())}
      >
        {content}
      </motion.div>
    </Link>
  );
};
export const buttonAnimationLogos = ({
  content,
  route = window.location.href,
  ariaLabel,
}) => {
  return (
    <a href={route} target="_blank" aria-label={ariaLabel}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0,
          ease: "easeInOut",
        }}
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
