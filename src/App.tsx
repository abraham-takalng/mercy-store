import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  ArrowRight, Clock, GraduationCap, Heart, Lock, MapPin, Phone, Send,
  ShieldCheck, ShoppingBag, Truck, User, X,
} from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCatalog from "@/components/ProductCatalog";
import AstuStudentPortal from "@/components/AstuStudentPortal";
import CartAndCheckout from "@/components/CartAndCheckout";
import AdminDashboard from "@/components/AdminDashboard";
import {
  DELIVERY_CITIES, PRODUCTS, STORE, formatETB,
} from "@/data/mockData";
import {
  FREE_SHIPPING_THRESHOLD,
  type CartItem, type CheckoutPayload, type Order, type OrderStatus,
  type Product,
} from "@/types";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => read<CartItem[]>("gn_cart", []));
  const [wishlist, setWishlist] = useState<string[]>(() => read<string[]>("gn_wishlist", []));
  const [orders, setOrders] = useState<Order[]>(() => read<Order[]>("gn_orders", []));
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"store" | "astu">("store");
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("gn_cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("gn_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem("gn_orders", JSON.stringify(orders));
  }, [orders]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const addToCart = (product: Product, size: string, color: string) => {
    const key = `${product.id}-${size}-${color}`;
    setCart((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found)
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { key, product, quantity: 1, size, color }];
    });
    toast.success(`${product.name} added to your bag.`);
  };

  const updateQty = (key: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    );

  const removeFromCart = (key: string) =>
    setCart((prev) => prev.filter((i) => i.key !== key));

  const toggleWishlist = (id: string) => {
    const liked = wishlist.includes(id);
    setWishlist((prev) => (liked ? prev.filter((w) => w !== id) : [...prev, id]));
    toast.success(liked ? "Removed from wishlist." : "Saved to wishlist.");
  };

  const placeOrder = (payload: CheckoutPayload): Order => {
    const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const order: Order = {
      id: `GN-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      createdAt: new Date().toISOString(),
      customer: payload.customer,
      items: cart,
      subtotal,
      discount: payload.discount,
      deliveryFee: payload.deliveryFee,
      total: subtotal - payload.discount + payload.deliveryFee,
      paymentMethod: payload.paymentMethod,
      status: "Pending Confirmation",
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return order;
  };

  const updateStatus = (orderId: string, status: OrderStatus) =>
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));

  const updateStock = (productId: string, stock: number) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock } : p)));
    toast.success("Stock updated.");
  };

  const goCatalog = () => {
    setView("store");
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };
  const goAstu = () => {
    setView("astu");
    setTimeout(
      () => document.getElementById("astu")?.scrollIntoView({ behavior: "smooth" }),
      60,
    );
  };

  const wishItems = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5EFE1]">
      <Header
        search={search}
        onSearch={setSearch}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        view={view}
        onChangeView={setView}
      />

      <Hero onShop={goCatalog} onAstu={goAstu} />

      <ProductCatalog
        products={products}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        search={search}
      />

      <AstuStudentPortal products={products} onAddToCart={addToCart} />

      {/* ---------------- Delivery network ---------------- */}
      <section id="delivery" className="border-t border-white/10 bg-[#070707]">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#C8A24A]">
                <Truck className="h-3.5 w-3.5" /> Nationwide delivery
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[#F5EFE1] sm:text-4xl">
                From Adama to every corner of Ethiopia
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#A8A296]">
                Orders are packed in our Adama studio and handed to trusted courier
                partners. Delivery is free above {formatETB(FREE_SHIPPING_THRESHOLD)} ETB,
                and ASTU students never pay for campus drop-off.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Clock, t: "1–4 days", d: "Courier transit" },
                  { icon: ShieldCheck, t: "Insured", d: "Every parcel" },
                  { icon: GraduationCap, t: "Free ASTU", d: "Campus drop-off" },
                ].map((c) => (
                  <div key={c.t} className="rounded-xl border border-white/10 bg-[#0D0D0D] p-3">
                    <c.icon className="h-4 w-4 text-[#C8A24A]" />
                    <p className="mt-2 text-sm font-semibold text-[#F5EFE1]">{c.t}</p>
                    <p className="text-[10px] text-[#7E7A70]">{c.d}</p>
                  </div>
                ))}
              </div>

              <a
                href={STORE.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#C8A24A]/50 px-5 py-3 text-sm font-semibold text-[#E3C87A] transition hover:bg-[#C8A24A]/10"
              >
                <Send className="h-4 w-4" /> Track an order on Telegram
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DELIVERY_CITIES.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-white/10 bg-[#0D0D0D] p-3 transition hover:border-[#C8A24A]/40"
                >
                  <p className="text-sm font-semibold text-[#F5EFE1]">{c.name}</p>
                  <p className="mt-0.5 text-[11px] text-[#C8A24A]">
                    {c.fee === 0 ? "Free" : `${formatETB(c.fee)} ETB`}
                  </p>
                  <p className="text-[10px] text-[#7E7A70]">{c.eta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Contact / footer ---------------- */}
      <footer id="contact" className="border-t border-[#C8A24A]/20 bg-[#0B0B0B]">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#E3C87A] to-[#A37F26] font-serif text-lg font-bold text-black shadow-sm">
                  M
                </span>
                <span className="font-serif text-lg text-[#F5EFE1]">Mercy Store</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#8A8478]">
                {STORE.tagline}. Curated clothing, footwear and accessories for girls —
                delivered from Adama.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8A24A]">
                Contact
              </p>
              <a
                href={`tel:${STORE.phone}`}
                className="mt-3 flex items-center gap-2 text-sm text-[#D9D3C5] hover:text-[#E3C87A]"
              >
                <Phone className="h-3.5 w-3.5 text-[#C8A24A]" /> {STORE.phoneDisplay}
              </a>
              <a
                href={STORE.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center gap-2 text-sm text-[#D9D3C5] hover:text-[#E3C87A]"
              >
                <Send className="h-3.5 w-3.5 text-[#C8A24A]" /> {STORE.telegramHandle}
              </a>
              <p className="mt-2 flex items-center gap-2 text-sm text-[#8A8478]">
                <MapPin className="h-3.5 w-3.5 text-[#C8A24A]" /> {STORE.location}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8A24A]">
                Shop
              </p>
              <button onClick={goCatalog} className="mt-3 block text-sm text-[#D9D3C5] hover:text-[#E3C87A]">
                All 42 pieces
              </button>
              <button onClick={goAstu} className="mt-2 block text-sm text-[#D9D3C5] hover:text-[#E3C87A]">
                ASTU student portal
              </button>
              <button
                onClick={() => setWishOpen(true)}
                className="mt-2 block text-sm text-[#D9D3C5] hover:text-[#E3C87A]"
              >
                Wishlist ({wishlist.length})
              </button>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8A24A]">
                Store hours
              </p>
              <p className="mt-3 text-sm text-[#D9D3C5]">Mon – Sat · 8:30 – 20:00</p>
              <p className="mt-1 text-sm text-[#D9D3C5]">Sunday · 10:00 – 17:00</p>
              <button
                onClick={() => setAdminOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A8478] transition hover:border-[#C8A24A]/50 hover:text-[#E3C87A]"
              >
                <Lock className="h-3 w-3" /> Admin
              </button>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-[#6F6A61] sm:flex-row">
            <p>© {new Date().getFullYear()} Mercy Store. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <ShoppingBag className="h-3 w-3" /> {orders.length} order
              {orders.length === 1 ? "" : "s"} placed via this device
            </p>
          </div>
        </div>
      </footer>

      {/* ---------------- Wishlist drawer ---------------- */}
      {wishOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <button aria-label="Close wishlist" onClick={() => setWishOpen(false)} className="flex-1" />
          <aside className="flex h-full w-full max-w-sm flex-col border-l border-[#C8A24A]/30 bg-[#0B0B0B]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="flex items-center gap-2 font-serif text-xl text-[#F5EFE1]">
                <Heart className="h-4 w-4 text-[#C8A24A]" /> Wishlist
              </h2>
              <button
                onClick={() => setWishOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-[#E8E2D4] hover:text-[#E3C87A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {wishItems.length === 0 ? (
                <div className="mt-16 text-center">
                  <Heart className="mx-auto h-9 w-9 text-[#3A3A3A]" />
                  <p className="mt-3 font-serif text-lg text-[#F5EFE1]">Nothing saved yet</p>
                  <p className="mt-1 text-sm text-[#7E7A70]">
                    Tap the heart on any piece to keep it here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {wishItems.map((p) => (
                    <li
                      key={p.id}
                      className="flex gap-3 rounded-xl border border-white/10 bg-[#0D0D0D] p-2.5"
                    >
                      <img src={p.image} alt={p.name} className="h-20 w-16 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#F5EFE1]">{p.name}</p>
                        <p className="mt-0.5 text-sm text-[#E3C87A]">{formatETB(p.price)} ETB</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => addToCart(p, p.sizes[0], p.colors[0])}
                            className="inline-flex items-center gap-1 rounded-full bg-[#C8A24A] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-black"
                          >
                            <ShoppingBag className="h-3 w-3" /> Add
                          </button>
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className="text-[10px] uppercase tracking-[0.1em] text-[#7E7A70] hover:text-[#C8A24A]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-white/10 p-5">
              <button
                onClick={() => {
                  setWishOpen(false);
                  setCartOpen(true);
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#C8A24A]/50 py-2.5 text-sm font-semibold text-[#E3C87A] hover:bg-[#C8A24A]/10"
              >
                View bag <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </aside>
        </div>
      )}

      <CartAndCheckout
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onPlaceOrder={placeOrder}
      />

      {/* ---------------- Account modal ---------------- */}
      {accountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <button aria-label="Close account" onClick={() => setAccountOpen(false)} className="absolute inset-0" />
          <aside className="relative w-full max-w-sm rounded-2xl border border-[#C8A24A]/30 bg-[#0B0B0B] p-6">
            <button
              onClick={() => setAccountOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-white/15 text-[#E8E2D4] hover:text-[#E3C87A]"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-[#C8A24A]/40 bg-[#C8A24A]/10">
                <User className="h-5 w-5 text-[#C8A24A]" />
              </span>
              <div>
                <h2 className="font-serif text-xl text-[#F5EFE1]">My Account</h2>
                <p className="text-xs text-[#8A8478]">Track orders & save preferences</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => { setAccountOpen(false); setCartOpen(true); }}
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0D0D0D] px-4 py-3 text-left transition hover:border-[#C8A24A]/40"
              >
                <ShoppingBag className="h-4 w-4 text-[#C8A24A]" />
                <div>
                  <p className="text-sm font-semibold text-[#F5EFE1]">My Orders</p>
                  <p className="text-[11px] text-[#7E7A70]">{orders.length} order{orders.length === 1 ? "" : "s"} placed</p>
                </div>
              </button>
              <button
                onClick={() => { setAccountOpen(false); setWishOpen(true); }}
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0D0D0D] px-4 py-3 text-left transition hover:border-[#C8A24A]/40"
              >
                <Heart className="h-4 w-4 text-[#C8A24A]" />
                <div>
                  <p className="text-sm font-semibold text-[#F5EFE1]">Wishlist</p>
                  <p className="text-[11px] text-[#7E7A70]">{wishlist.length} saved items</p>
                </div>
              </button>
              <a
                href={STORE.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0D0D0D] px-4 py-3 text-left transition hover:border-[#C8A24A]/40"
              >
                <Send className="h-4 w-4 text-[#C8A24A]" />
                <div>
                  <p className="text-sm font-semibold text-[#F5EFE1]">Contact on Telegram</p>
                  <p className="text-[11px] text-[#7E7A70]">{STORE.telegramHandle}</p>
                </div>
              </a>
            </div>
          </aside>
        </div>
      )}

      <AdminDashboard
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        orders={orders}
        products={products}
        onUpdateStatus={updateStatus}
        onUpdateStock={updateStock}
      />

      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "#0D0D0D",
            border: "1px solid rgba(200,162,74,0.35)",
            color: "#F5EFE1",
          },
        }}
      />
    </div>
  );
}