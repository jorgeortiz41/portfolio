"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const selectedStyle =
  "animate-shimmer bg-[linear-gradient(110deg,#0d9dde,25%,#a748de,55%,#0d9dde)] bg-[length:200%_100%] bg-clip-text";
const contactStyle = "";
const unSelectedStyle =
  "bg-gradient-to-b from-neutral-200 to-neutral-600 bg-clip-text hover:animate-shimmer hover:bg-[linear-gradient(110deg,#0d9dde,25%,#a748de,55%,#0d9dde)] hover:bg-[length:200%_100%] hover:bg-clip-text";

export const RouteButton = ({
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
