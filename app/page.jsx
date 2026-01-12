"use client";

import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Mission from "../components/Mission";
import Info from "../components/Info";

export default function Page() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <Features />
        <Mission />
        <Info />
      </main>
      <footer id="info" className="bg-[#e25e2d] text-white py-10 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
          <h3 className="text-2xl font-bold">One Hand</h3>
          <p>
            Helping people help each other with dignity and transparency.
          </p>
          <p className="text-sm opacity-90">
            Contact: onehand.platform@gmail.com | +961 71 000 000
          </p>
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} One Hand. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

