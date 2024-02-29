import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { BackgroundBeams } from "./components/BackgroundBeams";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jortiz",
  description: "Jorge Ortiz's portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <BackgroundBeams />
      </body>
    </html>
  );
}
