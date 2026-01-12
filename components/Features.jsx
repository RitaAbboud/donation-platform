"use client";

export default function Features() {
  const features = [
    {
      title: "Help Others",
      desc: "Easily donate items and support people in need with dignity and transparency.",
    },
    {
      title: "Reduce Waste",
      desc: "Give your unused items a second life and contribute to a more sustainable world.",
    },
    {
      title: "Community",
      desc: "Join a community of givers and receivers, creating meaningful connections.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#fae9d7]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2
          className="text-3xl md:text-4xl font-extrabold text-[#e25e2d] mb-12 italic"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.1)" }}
        >
          Our Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-[#fff7f0] rounded-xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.15)] transform translate-z-0"
              style={{ perspective: "1000px" }}
            >
              <h3
                className="text-xl md:text-2xl font-semibold mb-3 italic text-[#e25e2d]"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.05)" }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-800 text-sm md:text-base leading-relaxed italic">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
