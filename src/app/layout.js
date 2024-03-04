import { Inter } from "next/font/google";
import "./globals.css";
import { HeroNav } from "./components/HeroNav";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jortiz",
  description: "Jorge Ortiz's portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative">
          <HeroNav />
          {children}
        </div>
      </body>
    </html>
  );
}
