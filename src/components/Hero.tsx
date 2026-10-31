import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Send, Sparkles, Star, Truck } from "lucide-react";
import { GATE_IMAGE, HERO_IMAGE, STORE } from "@/data/mockData";

interface HeroProps {
  onShop: () => void;
  onAstu: () => void;
}

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.09, ease: "easeOut" as const },
  }),
};

const STATS = [
  { value: "42", label: "Curated pieces" },
  { value: "18", label: "Cities served" },
  { value: "20%", label: "ASTU discount" },
  { value: "4.9", label: "Average rating" },
];

export default function Hero({ onShop, onAstu }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#070707]">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#C8A24A]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#7A5E1E]/25 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <motion.p
            custom={0}
            variants={fade}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-[#C8A24A]/40 bg-[#C8A24A]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E3C87A]"
          >
            <Sparkles className="h-3 w-3" /> Adama · Nationwide delivery
          </motion.p>

          <motion.h1
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-5 font-serif text-4xl leading-[1.05] text-[#F5EFE1] sm:text-5xl lg:text-6xl"
          >
            Wear the night.
            <span className="mt-1 block bg-gradient-to-r from-[#F0DCA8] via-[#C8A24A] to-[#8A6A22] bg-clip-text italic text-transparent">
              Own the gold.
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-xl text-sm leading-relaxed text-[#A8A296] sm:text-base"
          >
            A curated collection of girls' fashion — statement clothing, elegant footwear and
            gilded accessories — 42 pieces, hand-checked in our Adama
            atelier and shipped to every region of Ethiopia, Bale Robe included.
          </motion.p>

          <motion.div
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={onShop}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E3C87A] to-[#A37F26] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
            >
              Shop the collection
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <button
              onClick={onAstu}
              className="inline-flex items-center gap-2 rounded-full border border-[#C8A24A]/50 px-5 py-3 text-sm font-semibold text-[#E3C87A] transition hover:bg-[#C8A24A]/10"
            >
              <GraduationCap className="h-4 w-4" /> ASTU Student Portal
            </button>
            <a
              href={STORE.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-3 py-3 text-sm font-medium text-[#B9B3A6] transition hover:text-[#E3C87A]"
            >
              <Send className="h-4 w-4" /> {STORE.telegramHandle}
            </a>
          </motion.div>

          <motion.dl
            custom={4}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-10 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="bg-[#0B0B0B] px-4 py-4">
                <dt className="font-serif text-2xl text-[#E3C87A]">{s.value}</dt>
                <dd className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#8A8478]">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -inset-3 rounded-[1.75rem] border border-[#C8A24A]/30" />
          <div className="relative overflow-hidden rounded-[1.5rem] border border-[#C8A24A]/40">
            <img
              src={HERO_IMAGE}
              alt="Girls' fashion editorial"
              className="h-[420px] w-full object-cover sm:h-[520px]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 backdrop-blur">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#C8A24A]">
                  New season
                </p>
                <p className="font-serif text-sm text-[#F5EFE1]">
                  Obsidian & Gold edit
                </p>
              </div>
              <div className="flex items-center gap-1 text-[#E3C87A]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3 w-3" fill="currentColor" />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -left-4 top-6 hidden items-center gap-2 rounded-full border border-[#C8A24A]/40 bg-[#0B0B0B]/90 px-3 py-2 text-[11px] font-medium text-[#E3C87A] shadow-xl sm:flex">
            <Truck className="h-3.5 w-3.5" /> Bale Robe · now delivering
          </div>
        </motion.div>
      </div>
    </section>
  );
}