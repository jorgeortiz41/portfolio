const firstParagraph =
  "Hi there!, Im a software engineering student at the University of Puerto Rico Mayaguez. I first got interested in programming since i played video games and liked tech in general. Before college i tried a small HTML/CSS tutorial and loved the idea of creating something from scratch. Fast forward today, I have built web services for myself, local industries, and the scientific community.";
const secondParagraph = "";
export default function About({ refProp }) {
  return (
    <div
      ref={refProp}
      className="z-10 w-full flex-col items-start justify-start space-y-8 leading-relaxed text-slate-400"
    >
      <div>{firstParagraph}</div>
      <div>{secondParagraph}</div>
      <div>{firstParagraph}</div>
    </div>
  );
}
