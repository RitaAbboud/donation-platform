"use client";

import { Poppins } from "next/font/google";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Mission from "../components/Mission";
import Info from "../components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});


export default function Page() {
  return (
    <div className={poppins.className}>
      <NavBar />
      <main>
        <Hero />
        <Features />
        <Mission />
             </main>
        <Info/>
      
    </div>
  );
}
