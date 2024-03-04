"use client";
import { useState, useEffect } from "react";

const FollowMouse = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="follow-mouse"
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 1000,
        width: "800px",
        height: "800px",
        borderRadius: "50%",
        background:
          "radial-gradient(600px at 1245px 111px, rgba(29, 78, 216, 0.15), transparent 80%)", // Radial gradient background
      }}
    ></div>
  );
};

export default FollowMouse;
