"use client";
export default function About() {
  return (
    <>
      <div className="relative flex h-screen w-full flex-col items-center justify-center rounded-md bg-neutral-950 antialiased">
        <div className="mx-auto flex max-w-2xl flex-col items-center p-4">
          <h1 className="relative z-10 bg-gradient-to-b from-neutral-200  to-neutral-600 bg-clip-text p-4 text-center font-sans text-lg font-bold text-transparent md:text-7xl">
            About
          </h1>
          <p className="text-md relative z-10 mx-auto my-2 max-w-lg text-center text-neutral-500 ">
            A software engineer with expertise in developing and deploying web
            applications.
          </p>
          <button
            className="animate-shimmer z-10 mt-4 inline-flex h-12 items-center justify-center rounded-md border border-slate-800
            bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]
            px-6 font-medium text-slate-400 transition-colors
            focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            Resume
          </button>
        </div>
      </div>
    </>
  );
}
