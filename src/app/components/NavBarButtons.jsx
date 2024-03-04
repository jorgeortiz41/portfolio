"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const lineVariants = {
  large: { width: 80, backgroundColor: "white" },
  small: { width: 40, backgroundColor: "#94a3b8" },
};

const textVariants = {
  large: { color: "white" },
  small: { color: "#94a3b8" },
};

export const RouteButton = ({ content, selected, scrollTo, handleClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleButtonClick = (option) => {
    scrollTo(option);
    handleClick(option);
  };

  return (
    <motion.button
      className={`text-md flex h-full items-center rounded-sm py-4 font-semibold text-slate-400 antialiased`}
      onClick={() => handleButtonClick(content.toLowerCase())}
      onHoverStart={() => setIsHovered((isHovered) => !isHovered)}
      onHoverEnd={() => setIsHovered((isHovered) => !isHovered)}
    >
      <motion.div
        animate={
          isHovered || selected == content.toLowerCase() ? "large" : "small"
        }
        className="mr-2 inline-flex h-px bg-white"
        variants={lineVariants}
      />
      <motion.div
        animate={
          isHovered || selected == content.toLowerCase() ? "large" : "small"
        }
        className={isHovered ? "large" : "small"}
        variants={textVariants}
      >
        {content}
      </motion.div>
    </motion.button>
  );
};
