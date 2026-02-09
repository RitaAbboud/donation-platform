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
  <footer id="info" className="relative bg-[#fdf2e9] text-slate-600 border-t border-orange-200/50">

    <div className="max-w-7xl mx-auto px-6 pt-32 pb-10">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 pb-16">
        
        {/* BRAND COLUMN */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-slate-900">
            <Heart fill="#e25e2d" className="text-[#e25e2d]" size={24} />
            <span>
              OneHand<span className="text-[#e25e2d]">.</span>
            </span>
          </div>
          <p className="leading-relaxed max-w-xs text-slate-600">
            What you no longer need could mean everything to someone else.
            Join us in giving with dignity.
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={<Instagram size={18} />} className="bg-white text-[#e25e2d] shadow-sm hover:bg-orange-50" />
            <SocialIcon icon={<Twitter size={18} />} className="bg-white text-[#e25e2d] shadow-sm hover:bg-orange-50" />
            <SocialIcon icon={<Facebook size={18} />} className="bg-white text-[#e25e2d] shadow-sm hover:bg-orange-50" />
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-[#e25e2d] font-bold mb-6 uppercase tracking-widest text-xs">
            Quick Links
          </h4>
          <ul className="space-y-4">
            <FooterLink href="#features" className="hover:text-slate-900 transition-colors">Features</FooterLink>
            <FooterLink href="#mission" className="hover:text-slate-900 transition-colors">Our Mission</FooterLink>
            <FooterLink href="/login" className="hover:text-slate-900 transition-colors">Join Community</FooterLink>
            <FooterLink href="#" className="hover:text-slate-900 transition-colors">Success Stories</FooterLink>
          </ul>
        </div>

        {/* LEGAL & SAFETY */}
        <div>
          <h4 className="text-[#e25e2d] font-bold mb-6 uppercase tracking-widest text-xs">
            Safety & Legal
          </h4>
          <ul className="space-y-4">
            <FooterLink href="#" icon={<ShieldCheck size={16} />}>
              Privacy Policy
            </FooterLink>
            <FooterLink href="/terms" icon={<FileText size={16} />}>
              Terms of Service
            </FooterLink>
            <FooterLink href="#" icon={<LifeBuoy size={16} />}>
              Safety Guidelines
            </FooterLink>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h4 className="text-[#e25e2d] font-bold mb-6 uppercase tracking-widest text-xs">
            Contact Us
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 hover:text-slate-900 transition-colors cursor-pointer group">
              <Mail
                size={18}
                className="text-[#e25e2d] mt-0.5 group-hover:scale-110 transition-transform"
              />
              <span className="text-sm">onehand.platform@gmail.com</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Phone size={18} className="text-[#e25e2d]" />
              <span>+961 71 000 000</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <MapPin size={18} className="text-[#e25e2d]" />
              <span>Beirut, Lebanon</span>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="pt-8 border-t border-orange-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-slate-400 uppercase tracking-widest">
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
        // Changed text-white to text-slate-900 for readability on cream
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-300 transform hover:translate-x-1 group"
      >
        {icon && <span className="text-[#e25e2d] group-hover:scale-110 transition-transform">{icon}</span>}
        <span className="text-sm font-medium">{children}</span>
      </Link>
    </li>
  );
}

// Helper component for Socials
function SocialIcon({ icon }) {
  return (
    <Link
      href="#"
      // Replaced dark background with a crisp white/subtle-border look
      className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-slate-500 shadow-sm hover:shadow-md hover:bg-[#e25e2d] hover:text-white hover:border-[#e25e2d] hover:-translate-y-1 transition-all duration-300"
    >
      {icon}
    </Link>
  );
}