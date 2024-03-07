const firstParagraph =
  "Hey there! I'm a software engineering student at the University of Puerto Rico Mayaguez, and my journey into this field began with a childhood fascination for gaming and technology. I was always curious about how things like GPS and the internet worked, and I loved solving problems, although I'll admit, personal ones are a bit trickier!";
const secondParagraph =
  "Outside of coding, you'll often find me indulging in my hobbies, which include playing video games, hitting the pickleball or basketball courts, and catching up on NBA games or movies.";
const thirdParagraph =
  "What intrigues me most about software engineering is its wide array of industries and specializations. Whether it's web development, mobile app development, or cloud computing, there's always a fresh challenge to tackle. Personally, I'm particularly drawn to web development, as it lies at the core of modern software solutions, and data science, including ML and AI, due to its promising future.";
const fourthParagraph =
  "Ready to collaborate and drive innovation forward? Let's connect and make an impact together in the ever-evolving world of technology.";
export default function About({ refProp }) {
  return (
    <div
      ref={refProp}
      className="z-10 w-full flex-col items-start justify-start space-y-8 leading-relaxed text-slate-400"
    >
      <div>{firstParagraph}</div>
      <div>{secondParagraph}</div>
      <div>{thirdParagraph}</div>
      <div>{fourthParagraph}</div>
    </div>
  );
}
