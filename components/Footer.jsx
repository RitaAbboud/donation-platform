"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer id="info" className="bg-[#fae9d7] text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">

          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-bold mb-4">One Hand</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Helping people help each other with dignity, respect, and transparency.
            </p>
          </div>

          {/* PLATFORM */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link href="#features" className="hover:text-[#e25e2d] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#mission" className="hover:text-[#e25e2d] transition-colors">
                  Mission
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#e25e2d] transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link href="#" className="hover:text-[#e25e2d] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#e25e2d] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#e25e2d] transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>onehand.platform@gmail.com</li>
              <li>+961 71 000 000</li>
              <li>Lebanon</li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-12 border-t border-black/20 pt-6 text-center text-sm opacity-80">
          © {new Date().getFullYear()} One Hand. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
