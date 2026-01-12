"use client";

export default function Mission() {
  return (
    <section id="mission" className="py-24 bg-[#fae9d7]">
      <div className="max-w-4xl mx-auto px-6 text-center bg-[#fff7f0] p-12 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] transform translate-z-0">
        <h2
          className="text-3xl md:text-4xl font-extrabold text-[#e25e2d] mb-6 italic"
          style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.1)" }}
        >
          Our Mission
        </h2>
        <p
          className="text-base md:text-lg text-gray-800 leading-relaxed italic"
          style={{ textShadow: "0.5px 0.5px 1px rgba(0,0,0,0.05)" }}
        >
          At <strong>One Hand</strong>, help should never feel
          <span className="text-[#e25e2d]"> humiliating</span> or
          <span className="text-[#e25e2d]"> complicated</span>.<br /><br />
          Some people have more than they need. Others are missing the basics.
          We exist to quietly connect them — with <span className="text-[#e25e2d]">respect</span>,
          <span className="text-[#e25e2d]"> transparency</span>, and
          <span className="text-[#e25e2d]"> empathy</span>.<br /><br />
          One hand gives. Another receives. Both walk away stronger.
        </p>
      </div>
    </section>
  );
}
