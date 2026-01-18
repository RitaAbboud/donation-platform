"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  FileText,
  LifeBuoy,
} from "lucide-react";

export default function Footer() {
  return (
    <footer id="info" className="bg-[#FFF1E6] text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">

          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-750">
         
              One Hand
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Helping people help each other with dignity, respect, and transparency.
            </p>
          </div>

          {/* PLATFORM */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-750">
              Platform
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
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
                <Link
                  href="/login"
                  className="hover:text-[#e25e2d] transition-colors font-medium"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-750">
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#e25e2d]" />
                <Link href="#" className="hover:text-[#e25e2d] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <FileText size={16} className="text-[#e25e2d]" />
                <Link href="#" className="hover:text-[#e25e2d] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <LifeBuoy size={16} className="text-[#e25e2d]" />
                <Link href="#" className="hover:text-[#e25e2d] transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-750">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-[#e25e2d]" />
                onehand.platform@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-[#e25e2d]" />
                +961 71 000 000
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-[#e25e2d]" />
                Lebanon
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-12 border-t border-gray-300/40 pt-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} One Hand. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
