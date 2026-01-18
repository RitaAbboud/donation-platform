"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  FileText,
  LifeBuoy,
  Heart,
  Instagram,
  Twitter,
  Facebook,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer id="info" className="bg-[#3d332d] text-[#fdf2e9]/80">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">


        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 pb-16">
          {/* BRAND COLUMN */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white">
              <Heart fill="#e25e2d" className="text-[#e25e2d]" size={24} />
              <span>
                OneHand<span className="text-[#f3a552]">.</span>
              </span>
            </div>
            <p className="leading-relaxed max-w-xs">
              What you no longer need could mean everything to someone else.
              Join us in giving with dignity.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Facebook size={18} />} />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-[#f3a552] font-bold mb-6 uppercase tracking-widest text-xs">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#mission">Our Mission</FooterLink>
              <FooterLink href="/login">Join Community</FooterLink>
              <FooterLink href="#">Success Stories</FooterLink>
            </ul>
          </div>

          {/* LEGAL & SAFETY */}
          <div>
            <h4 className="text-[#f3a552] font-bold mb-6 uppercase tracking-widest text-xs">
              Safety & Legal
            </h4>
            <ul className="space-y-4">
              <FooterLink href="#" icon={<ShieldCheck size={16} />}>
                Privacy Policy
              </FooterLink>
              <FooterLink href="#" icon={<FileText size={16} />}>
                Terms of Service
              </FooterLink>
              <FooterLink href="#" icon={<LifeBuoy size={16} />}>
                Safety Guidelines
              </FooterLink>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className="text-[#f3a552] font-bold mb-6 uppercase tracking-widest text-xs">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer group">
                <Mail
                  size={18}
                  className="text-[#e25e2d] mt-0.5 group-hover:scale-110 transition-transform"
                />
                <span>onehand.platform@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#e25e2d]" />
                <span>+961 71 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-[#e25e2d]" />
                <span>Beirut, Lebanon</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-[#fdf2e9]/40 uppercase tracking-widest">
          <p>
            © {new Date().getFullYear()} One Hand Platform. Built with empathy.
          </p>

        </div>
      </div>
    </footer>
  );
}

// Helper component for Links
function FooterLink({ href, children, icon }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-2 hover:text-white transition-all duration-300 transform hover:translate-x-1"
      >
        {icon && <span className="text-[#e25e2d]">{icon}</span>}
        {children}
      </Link>
    </li>
  );
}

// Helper component for Socials
function SocialIcon({ icon }) {
  return (
    <Link
      href="#"
      className="w-9 h-9 rounded-xl bg-[#4d423b] flex items-center justify-center text-white/70 hover:bg-[#e25e2d] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-lg"
    >
      {icon}
    </Link>
  );
}
