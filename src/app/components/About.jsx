"use client";
import { motion } from "framer-motion";

const firstParagraph =
  "Hi there!, im a software engineering student at the University of Puerto Rico Mayaguez. I first got interested in programming since i played video games and liked tech in general. Before college i tried a small HTML/CSS tutorial and loved the idea of creating something from scratch. Fast forward today, I have built web services for myself, local industries, and the scientific community.";
const secondParagraph = "";
export default function About() {
  return (
    <div className="z-10 w-full flex-col items-start justify-start space-y-8 text-white">
      <div>{firstParagraph}</div>
      <div>{secondParagraph}</div>
      <div>{firstParagraph}</div>
    </div>
  );
}
