import { useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Clock,
  GraduationCap,
  MapPin,
  Percent,
  Send,
  ShoppingBag,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { ASTU, ASTU_IMAGE, ASTU_LOGO, STORE, buildTelegramMessage, formatETB } from "@/data/mockData";
import { ASTU_COUPON, type Product } from "@/types";

interface AstuProps {
  products: Product[];
  onAddToCart: (product: Product, size: string, color: string) => void;
}

const field =
  "w-full rounded-lg border border-white/12 bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#F5EFE1] placeholder:text-[#6F6A61] focus:border-[#C8A24A] focus:outline-none";

const label =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8478]";

export default function AstuStudentPortal({ products, onAddToCart }: AstuProps) {
  const picks = products.filter((p) => p.astuPick).slice(0, 4);

  const [form, setForm] = useState({
    studentName: "",
    studentId: "",
    phone: "",
    block: ASTU.blocks[0],
    room: "",
    dropPoint: ASTU.dropPoints[0],
    timeSlot: ASTU.timeSlots[0],
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName.trim() || !form.studentId.trim() || !form.phone.trim()) {
      toast.error("Please add your name, student ID and phone number.");
      return;
    }
    const message = buildTelegramMessage([
      `ASTU dorm delivery request — ${STORE.name}`,
      `Student: ${form.studentName} (ID ${form.studentId})`,
      `Phone: ${form.phone}`,
      `Block: ${form.block} · Room: ${form.room || "n/a"}`,
      `Drop point: ${form.dropPoint}`,
      `Preferred time: ${form.timeSlot}`,
      `Use coupon ${ASTU_COUPON} for the 20% student discount.`,
    ]);
    window.open(message, "_blank");
    toast.success("Request ready — send it on Telegram to confirm delivery.");
  };

  return (
    <section id="astu" className="border-t border-white/10 bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          {/* promo */}
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#C8A24A]/40 bg-[#C8A24A]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E3C87A]">
              <GraduationCap className="h-3 w-3" /> ASTU student hub
            </p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src={ASTU_LOGO}
                alt="Adama Science and Technology University official logo"
                loading="lazy"
                className="h-14 w-14 shrink-0 rounded-full bg-white object-contain p-1 ring-1 ring-[#C8A24A]/40"
              />
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C8A24A]">
                Official ASTU university portal
              </p>
            </div>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-[#F5EFE1] sm:text-4xl">
              Dorm-to-door delivery for{" "}
              <span className="italic text-[#E3C87A]">Adama Science &amp; Technology University</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#A8A296]">
              Students on campus get 20% off every order plus free delivery to your
              block. Fill the card on the right, send the message on Telegram, and
              your parcel arrives at your chosen drop point.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#C8A24A]/30">
              <img
                src={ASTU_IMAGE}
                alt="ASTU campus at golden hour"
                loading="lazy"
                className="h-48 w-full object-cover sm:h-56"
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Percent, t: `20% off`, d: `Coupon ${ASTU_COUPON}` },
                { icon: Clock, t: "24 hours", d: "Campus turnaround" },
                { icon: MapPin, t: "5 drop points", d: "Blocks 501–525" },
              ].map((c) => (
                <div
                  key={c.t}
                  className="rounded-xl border border-white/10 bg-[#0D0D0D] p-3"
                >
                  <c.icon className="h-4 w-4 text-[#C8A24A]" />
                  <p className="mt-2 text-sm font-semibold text-[#F5EFE1]">{c.t}</p>
                  <p className="text-[10px] text-[#7E7A70]">{c.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* form */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-2xl border border-[#C8A24A]/30 bg-[#0D0D0D] p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-xl text-[#F5EFE1]">Dorm delivery request</h3>
              <span className="rounded-full bg-[#C8A24A] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-black">
                Students only
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="astu-name">
                  Full name
                </label>
                <input
                  id="astu-name"
                  className={field}
                  value={form.studentName}
                  onChange={(e) => set("studentName", e.target.value)}
                  placeholder="Abebe Tesfaye"
                />
              </div>
              <div>
                <label className={label} htmlFor="astu-id">
                  Student ID
                </label>
                <input
                  id="astu-id"
                  className={field}
                  value={form.studentId}
                  onChange={(e) => set("studentId", e.target.value)}
                  placeholder="ASTU/1234/15"
                />
              </div>
              <div>
                <label className={label} htmlFor="astu-phone">
                  Phone
                </label>
                <input
                  id="astu-phone"
                  className={field}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="09xx xxx xxx"
                />
              </div>
              <div>
                <label className={label} htmlFor="astu-block">
                  Dorm block
                </label>
                <select
                  id="astu-block"
                  className={field}
                  value={form.block}
                  onChange={(e) => set("block", e.target.value)}
                >
                  {ASTU.blocks.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="astu-room">
                  Room number
                </label>
                <input
                  id="astu-room"
                  className={field}
                  value={form.room}
                  onChange={(e) => set("room", e.target.value)}
                  placeholder="e.g. 214"
                />
              </div>
              <div>
                <label className={label} htmlFor="astu-slot">
                  Preferred time
                </label>
                <select
                  id="astu-slot"
                  className={field}
                  value={form.timeSlot}
                  onChange={(e) => set("timeSlot", e.target.value)}
                >
                  {ASTU.timeSlots.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="astu-drop">
                  Drop point
                </label>
                <select
                  id="astu-drop"
                  className={field}
                  value={form.dropPoint}
                  onChange={(e) => set("dropPoint", e.target.value)}
                >
                  {ASTU.dropPoints.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E3C87A] to-[#A37F26] py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
            >
              <Send className="h-4 w-4" /> Send request on Telegram
            </button>
            <p className="mt-2 text-center text-[10px] text-[#6F6A61]">
              Coupon <span className="text-[#C8A24A]">{ASTU_COUPON}</span> is applied
              automatically at checkout.
            </p>
          </motion.form>
        </div>

        {/* ASTU picks */}
        <div className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C8A24A]">
                <BadgeCheck className="h-3.5 w-3.5" /> Student favourites
              </p>
              <h3 className="mt-2 font-serif text-2xl text-[#F5EFE1]">
                ASTU picks under student budget
              </h3>
            </div>
            <p className="text-xs text-[#7E7A70]">
              Prices shown before the 20% student discount
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {picks.map((p) => (
              <div
                key={p.id}
                className="group overflow-hidden rounded-xl border border-white/10 bg-[#0D0D0D] transition hover:border-[#C8A24A]/50"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="p-3">
                  <h4 className="line-clamp-1 text-sm font-semibold text-[#F5EFE1]">
                    {p.name}
                  </h4>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#7E7A70]">
                    <Star className="h-2.5 w-2.5 text-[#C8A24A]" fill="currentColor" />
                    {p.rating} · {p.category}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-[#E3C87A]">
                    {formatETB(p.price * 0.8)}{" "}
                    <span className="text-[9px] font-normal uppercase text-[#7E7A70]">
                      ETB student price
                    </span>
                  </p>
                  <button
                    onClick={() => onAddToCart(p, p.sizes[0], p.colors[0])}
                    className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#C8A24A]/50 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#E3C87A] transition hover:bg-[#C8A24A]/10"
                  >
                    <ShoppingBag className="h-3 w-3" /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}