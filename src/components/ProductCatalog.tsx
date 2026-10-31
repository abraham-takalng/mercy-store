import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Heart,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import { STORE, buildTelegramMessage, formatETB } from "@/data/mockData";
import type { Category, Product } from "@/types";

type Filter = Category | "All" | "ASTU Picks" | "New Arrivals" | "Bestsellers" | "On Sale";

const FILTERS: Filter[] = [
  "All",
  "Clothing",
  "Shoes",
  "Accessories",
  "ASTU Picks",
  "New Arrivals",
  "Bestsellers",
  "On Sale",
];

type Sort = "Featured" | "Price: low to high" | "Price: high to low" | "Top rated";

const SORTS: Sort[] = ["Featured", "Price: low to high", "Price: high to low", "Top rated"];

interface CatalogProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  search: string;
}

const matches = (p: Product, filter: Filter) => {
  if (filter === "All") return true;
  if (filter === "Clothing" || filter === "Shoes" || filter === "Accessories")
    return p.category === filter;
  if (filter === "ASTU Picks") return Boolean(p.astuPick);
  if (filter === "New Arrivals") return p.tag === "New";
  if (filter === "Bestsellers") return p.tag === "Bestseller";
  return p.tag === "Sale" || Boolean(p.oldPrice);
};

export default function ProductCatalog({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  search,
}: CatalogProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<Sort>("Featured");
  const [active, setActive] = useState<Product | null>(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        matches(p, filter) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.colors.some((c) => c.toLowerCase().includes(q))),
    );
    if (sort === "Price: low to high") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: high to low") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "Top rated") return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, filter, sort, search]);

  const openProduct = (p: Product) => {
    setActive(p);
    setSize(p.sizes[0]);
    setColor(p.colors[0]);
  };

  return (
    <section id="catalog" className="border-t border-white/10 bg-[#070707]">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C8A24A]">
              The collection
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#F5EFE1] sm:text-4xl">
              42 pieces for the modern woman
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#A8A296]">
              Filter by category, discover ASTU student picks, and reserve with a
              quick Telegram message.
            </p>
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="appearance-none rounded-full border border-white/15 bg-[#0D0D0D] py-2.5 pl-4 pr-9 text-xs font-medium text-[#E8E2D4] focus:border-[#C8A24A] focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8478]" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                filter === f
                  ? "border-[#C8A24A] bg-[#C8A24A] text-black"
                  : "border-white/12 bg-white/[0.03] text-[#B9B3A6] hover:border-[#C8A24A]/50 hover:text-[#E3C87A]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="mt-14 rounded-2xl border border-white/10 bg-[#0D0D0D] px-6 py-16 text-center">
            <Search className="mx-auto h-8 w-8 text-[#C8A24A]" />
            <p className="mt-3 font-serif text-xl text-[#F5EFE1]">No pieces found</p>
            <p className="mt-1 text-sm text-[#8A8478]">
              Try another search term or browse the full collection.
            </p>
            <button
              onClick={() => {
                setFilter("All");
              }}
              className="mt-5 rounded-full border border-[#C8A24A]/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#E3C87A] hover:bg-[#C8A24A]/10"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((p, i) => {
              const liked = wishlist.includes(p.id);
              return (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: Math.min(i, 7) * 0.03 }}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-[#0D0D0D] transition hover:border-[#C8A24A]/50"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-black">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />

                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                      {p.tag && (
                        <span className="rounded-full bg-black/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#E3C87A] backdrop-blur">
                          {p.tag}
                        </span>
                      )}
                      {p.astuPick && (
                        <span className="rounded-full bg-[#C8A24A] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-black">
                          ASTU
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleWishlist(p.id)}
                      aria-label="Wishlist"
                      className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border backdrop-blur transition ${
                        liked
                          ? "border-[#C8A24A] bg-[#C8A24A] text-black"
                          : "border-white/20 bg-black/50 text-[#E8E2D4] hover:text-[#E3C87A]"
                      }`}
                    >
                      <Heart className="h-3.5 w-3.5" fill={liked ? "currentColor" : "none"} />
                    </button>

                    <button
                      onClick={() => openProduct(p)}
                      className="absolute inset-x-2 bottom-2 translate-y-2 rounded-full bg-white/95 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-black opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      Quick view
                    </button>
                  </div>

                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 text-sm font-semibold text-[#F5EFE1]">
                        {p.name}
                      </h3>
                      <span className="flex shrink-0 items-center gap-0.5 text-[10px] text-[#C8A24A]">
                        <Star className="h-2.5 w-2.5" fill="currentColor" /> {p.rating}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#7E7A70]">
                      {p.category}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="flex items-baseline gap-1.5">
                        <span className="text-sm font-semibold text-[#E3C87A]">
                          {formatETB(p.price)}
                        </span>
                        <span className="text-[9px] uppercase text-[#7E7A70]">ETB</span>
                        {p.oldPrice && (
                          <span className="text-[10px] text-[#6F6A61] line-through">
                            {formatETB(p.oldPrice)}
                          </span>
                        )}
                      </p>
                      <button
                        onClick={() => openProduct(p)}
                        aria-label={`Add ${p.name}`}
                        className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#E3C87A] to-[#A37F26] text-black transition hover:brightness-110"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-1.5 text-[10px] text-[#6F6A61]">
                      {p.stock > 8 ? "In stock" : `Only ${p.stock} left`}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-[#C8A24A]/30 bg-[#0B0B0B] sm:rounded-2xl">
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black/70 text-[#E8E2D4] hover:text-[#E3C87A]"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="grid sm:grid-cols-2">
              <img
                src={active.image}
                alt={active.name}
                className="h-64 w-full object-cover sm:h-full"
              />
              <div className="p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#C8A24A]">
                  {active.category} · {active.material}
                </p>
                <h3 className="mt-1 font-serif text-2xl text-[#F5EFE1]">{active.name}</h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-[#8A8478]">
                  <span className="flex items-center gap-0.5 text-[#C8A24A]">
                    <Star className="h-3 w-3" fill="currentColor" /> {active.rating}
                  </span>
                  <span>({active.reviews} reviews)</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#A8A296]">
                  {active.description}
                </p>

                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-2xl text-[#E3C87A]">
                    {formatETB(active.price)} ETB
                  </span>
                  {active.oldPrice && (
                    <span className="text-xs text-[#6F6A61] line-through">
                      {formatETB(active.oldPrice)}
                    </span>
                  )}
                </p>

                <div className="mt-4">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8478]">
                    Size
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {active.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`min-w-9 rounded-md border px-2.5 py-1.5 text-xs transition ${
                          size === s
                            ? "border-[#C8A24A] bg-[#C8A24A]/15 text-[#E3C87A]"
                            : "border-white/12 text-[#B9B3A6] hover:border-white/30"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8478]">
                    Colour
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {active.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs transition ${
                          color === c
                            ? "border-[#C8A24A] bg-[#C8A24A]/15 text-[#E3C87A]"
                            : "border-white/12 text-[#B9B3A6] hover:border-white/30"
                        }`}
                      >
                        {color === c && <Check className="h-3 w-3" />} {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(active, size || active.sizes[0], color || active.colors[0]);
                      setActive(null);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E3C87A] to-[#A37F26] py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
                  >
                    <ShoppingBag className="h-4 w-4" /> Add to bag
                  </button>
                  <a
                    href={buildTelegramMessage([
                      `Hello ${STORE.name}, I would like to order:`,
                      `${active.name} (${active.category})`,
                      `Size: ${size || active.sizes[0]} · Colour: ${color || active.colors[0]}`,
                      `Price: ${formatETB(active.price)} ETB`,
                    ])}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A24A]/50 py-2.5 text-sm font-semibold text-[#E3C87A] transition hover:bg-[#C8A24A]/10"
                  >
                    <Send className="h-4 w-4" /> Order on Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}