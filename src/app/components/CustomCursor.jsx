"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const addHover = () => setHovering(true);
    const removeHover = () => setHovering(false);

    // watch all clickable elements
    const targets = document.querySelectorAll("a, button, .card");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 z-50 pointer-events-none"
      animate={{
        x: pos.x - 12,
        y: pos.y - 12,
        scale: hovering ? 2 : 1, // bigger on hover
      }}
      transition={{
        type: "tween",
        ease: "linear",
        duration: 0.01, // basically instant
      }}
    >
      <div
        className={`h-6 w-6 rounded-full border-2 ${
          hovering ? "border-pink-400" : "border-cyan-400"
        }`}
      />
      <div className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400" />
    </motion.div>
  );
};
