"use client";
import { skills } from "../data/data";

export default function Skills({ refProp }) {
  return (
    <div
      ref={refProp}
      className="z-10 w-full flex-col items-start justify-start space-y-6"
    >
      {skills.map((group, index) => (
        <div key={index}>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">
            {group.category}
          </h3>
          <div>
            {group.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="mb-2 mr-2 inline-block rounded-full bg-blue-500/10 p-1 px-3 text-sm font-medium text-blue-400"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
