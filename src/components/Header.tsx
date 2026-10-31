import { useState } from "react";
import {
  GraduationCap,
  Heart,
  Menu,
  Phone,
  Search,
  Send,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { STORE } from "@/data/mockData";

interface HeaderProps {
  search: string;
  onSearch: (v: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  view: "store" | "astu";
  onChangeView: (v: "store" | "astu") => void;
}

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const NAV = [
  { label: "Shop", id: "catalog" },
  { label: "Delivery", id: "delivery" },
  { label: "Contact", id: "contact" },
];

export default function Header({
  search,
  onSearch,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  view,
  onChangeView,
}: HeaderProps) {
  const [mobile, setMobile] = useState(false);

  const goAstu = () => {
    onChangeView("astu");
    setMobile(false);
    setTimeout(() => scrollTo("astu"), 60);
  };

  return (
    <header className="sticky top-0 z-40">
      {/* announcement */}
      <div className="bg-[#0B0B0B] text-[#C8A24A]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 text-[11px] tracking-wide">
          <p className="hidden sm:block">
            Free nationwide delivery over 15,000 ETB · ASTU students save 20%
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${STORE.phone}`}
              className="inline-flex items-center gap-1.5 transition hover:text-[#F0DCA8]"
            >
              <Phone className="h-3 w-3" /> {STORE.phoneDisplay}
            </a>
            <a
              href={STORE.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-[#F0DCA8]"
            >
              <Send className="h-3 w-3" /> {STORE.telegramHandle}
            </a>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="border-b border-[#C8A24A]/20 bg-[#070707]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => {
              onChangeView("store");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#E3C87A] to-[#A37F26] font-serif text-lg font-bold text-black shadow-sm">
              M
            </span>
            <span className="text-left leading-none">
              <span className="block font-serif text-lg font-semibold tracking-wide text-[#F5EFE1]">
                Mercy Store
              </span>
              <span className="mt-0.5 block text-[9px] uppercase tracking-[0.28em] text-[#C8A24A]">
                Girls' Collection · Adama
              </span>
            </span>
          </button>

          <nav className="ml-6 hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  onChangeView("store");
                  scrollTo(n.id);
                }}
                className="text-xs font-medium uppercase tracking-[0.18em] text-[#B9B3A6] transition hover:text-[#C8A24A]"
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={goAstu}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                view === "astu" ? "text-[#C8A24A]" : "text-[#B9B3A6] hover:text-[#C8A24A]"
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" /> ASTU Portal
            </button>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <label className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition focus-within:border-[#C8A24A]/60 md:flex">
              <Search className="h-3.5 w-3.5 text-[#8A8478]" />
              <input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search 42 pieces…"
                className="w-32 bg-transparent text-xs text-[#F5EFE1] placeholder:text-[#6F6A61] focus:outline-none lg:w-44"
              />
            </label>

            <button
              onClick={onOpenAccount}
              aria-label="Account"
              className="relative grid h-9 w-9 place-items-center rounded-full border border-white/10 text-[#E8E2D4] transition hover:border-[#C8A24A]/60 hover:text-[#C8A24A]"
            >
              <User className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenWishlist}
              aria-label="Wishlist"
              className="relative grid h-9 w-9 place-items-center rounded-full border border-white/10 text-[#E8E2D4] transition hover:border-[#C8A24A]/60 hover:text-[#C8A24A]"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#C8A24A] px-1 text-[9px] font-bold text-black">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenCart}
              aria-label="Cart"
              className="relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#E3C87A] to-[#A37F26] text-black transition hover:brightness-110"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full border border-[#070707] bg-black px-1 text-[9px] font-bold text-[#E3C87A]">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobile((v) => !v)}
              aria-label="Menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-[#E8E2D4] lg:hidden"
            >
              {mobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* mobile drawer */}
        {mobile && (
          <div className="border-t border-white/10 bg-[#0B0B0B] px-4 py-4 lg:hidden">
            <label className="mb-3 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <Search className="h-3.5 w-3.5 text-[#8A8478]" />
              <input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search the collection…"
                className="w-full bg-transparent text-sm text-[#F5EFE1] placeholder:text-[#6F6A61] focus:outline-none"
              />
            </label>
            <div className="grid gap-1">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    onChangeView("store");
                    setMobile(false);
                    setTimeout(() => scrollTo(n.id), 60);
                  }}
                  className="rounded-lg px-3 py-2 text-left text-sm text-[#D9D3C5] hover:bg-white/5"
                >
                  {n.label}
                </button>
              ))}
              <button
                onClick={goAstu}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#C8A24A] hover:bg-white/5"
              >
                <GraduationCap className="h-4 w-4" /> ASTU Student Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}