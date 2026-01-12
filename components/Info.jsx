"use client";

export default function Info() {
  const infoList = [
    {
      title: "Who We Are",
      text: "One Hand is a community-driven platform focused on dignity, trust, and human connection.",
    },
    {
      title: "Contact Us",
      text: (
        <>
          Email: onehand.platform@gmail.com <br />
          Phone: +961 71 000 000
        </>
      ),
    },
    {
      title: "Location",
      text: "Based in Lebanon, serving people everywhere through kindness.",
    },
  ];

  return (
    <section id="info" className="py-24 bg-[#fae9d7]">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
        {infoList.map((info, idx) => (
          <div
            key={idx}
            className="bg-[#fff7f0] p-8 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] transform translate-z-0"
          >
            <h3
              className="text-xl md:text-2xl font-semibold text-[#e25e2d] mb-4 italic"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.05)" }}
            >
              {info.title}
            </h3>
            <p className="text-gray-800 text-sm md:text-base leading-relaxed italic">
              {info.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
