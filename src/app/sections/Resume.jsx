"use client";
import { useState, useEffect } from "react";

export default function Resume({ refProp }) {
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={refProp}
      className={`z-10 w-full flex-col items-start justify-start space-y-6 ${isMobile ? "px-4" : ""}`}
    >
      <div className="leading-relaxed tracking-wide text-slate-400">
        Get a full overview of my experience, skills, and education in one
        place.
      </div>

      {!isMobile && (
        <iframe
          src="/resume.pdf"
          title="Résumé"
          className="aspect-[8.5/11] w-full max-w-md rounded-lg bg-white/[0.03] shadow-xl"
        />
      )}

      <div className="text-lg">
        <button
          className={
            hover ? "p-4 font-bold text-blue-300" : "p-4 font-bold text-white"
          }
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => window.open("/resume.pdf", "_blank")}
        >
          View Full Résumé
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={
              hover
                ? "ml-1 inline-block h-4 w-4 shrink-0 -translate-y-1 translate-x-1 transition-transform motion-reduce:transition-none"
                : "ml-1 inline-block h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none"
            }
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
