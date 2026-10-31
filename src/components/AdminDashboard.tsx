import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Lock,
  LogOut,
  Minus,
  Package,
  Phone,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatETB } from "@/data/mockData";
import {
  ORDER_STATUSES,
  type Order,
  type OrderStatus,
  type Product,
} from "@/types";

interface AdminDashboardProps {
  open: boolean;
  onClose: () => void;
  orders: Order[];
  products: Product[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateStock: (productId: string, stock: number) => void;
}

const DEMO_PIN = "1234";

const STATUS_STYLES: Record<OrderStatus, string> = {
  "Pending Confirmation": "bg-[#FBEDEC] text-[#9E2A2B] border-[#EBC6C5]",
  "Processing in Adama": "bg-[#FDF4DF] text-[#9A7B2E] border-[#EAD69C]",
  "Dispatched via Courier": "bg-[#E7F0EE] text-[#2A6F5E] border-[#B9D6CE]",
  Delivered: "bg-[#E7F3E9] text-[#2F7A46] border-[#BCE0C4]",
  Cancelled: "bg-[#F0EFEC] text-[#7A746A] border-[#DAD4C7]",
};

export default function AdminDashboard({
  open,
  onClose,
  orders,
  products,
  onUpdateStatus,
  onUpdateStock,
}: AdminDashboardProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [tab, setTab] = useState<"orders" | "inventory">("orders");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const tryUnlock = () => {
    if (pin === DEMO_PIN) {
      setUnlocked(true);
      setPin("");
      toast.success("Welcome back, owner");
    } else {
      toast.error("Incorrect PIN. Try 1234.");
    }
  };

  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(
    (o) => o.status === "Pending Confirmation",
  ).length;

  const filtered =
    statusFilter === "All"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 overflow-y-auto bg-[#20231F]/70 p-3 backdrop-blur-sm sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-[#FBF7F0] shadow-2xl"
          >
            {/* Bar */}
            <div className="flex items-center justify-between border-b border-[#E7DFD2] px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2A2E28] text-[#D8B46A]">
                  <Lock className="h-4 w-4" />
                </span>
                <div className="leading-tight">
                  <p className="font-serif text-lg text-[#2A2E28]">
                    Admin dashboard
                  </p>
                  <p className="text-[11px] text-[#8A8578]">
                    Mercy Store · Adama
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {unlocked && (
                  <button
                    onClick={() => setUnlocked(false)}
                    className="grid h-9 w-9 place-items-center rounded-full text-[#5A6157] hover:bg-[#EDE4D6]"
                    aria-label="Lock"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-full text-[#2A2E28] hover:bg-[#EDE4D6]"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {!unlocked ? (
              <div className="grid place-items-center px-6 py-16 text-center">
                <Lock className="mb-3 h-9 w-9 text-[#C9BEA9]" />
                <h3 className="font-serif text-2xl text-[#2A2E28]">
                  Owner access
                </h3>
                <p className="mt-1 max-w-sm text-sm text-[#8A8578]">
                  Enter your dashboard PIN to manage orders and inventory.
                </p>
                <input
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
                  type="password"
                  inputMode="numeric"
                  placeholder="• • • •"
                  className="mt-5 w-40 rounded-xl border border-[#DED3C0] bg-white px-4 py-2.5 text-center text-lg tracking-[0.5em] outline-none focus:border-[#9E2A2B]/50"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={tryUnlock}
                    className="rounded-full bg-[#9E2A2B] px-5 py-2.5 text-sm font-semibold text-[#FBF7F0] hover:bg-[#862223]"
                  >
                    Unlock
                  </button>
                  <button
                    onClick={() => {
                      setPin(DEMO_PIN);
                      setUnlocked(true);
                      toast.success("Demo access granted");
                    }}
                    className="rounded-full border border-[#DED3C0] px-4 py-2.5 text-sm font-semibold text-[#5A6157] hover:border-[#9E2A2B]/40"
                  >
                    Demo unlock
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-h-[80vh] overflow-y-auto">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
                  <Stat label="Total orders" value={String(orders.length)} />
                  <Stat
                    label="Revenue (ETB)"
                    value={formatETB(revenue)}
                    accent
                  />
                  <Stat label="Pending" value={String(pending)} />
                  <Stat
                    label="Products"
                    value={String(products.length)}
                  />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-5">
                  {(["orders", "inventory"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                        tab === t
                          ? "bg-[#2A2E28] text-[#FBF7F0]"
                          : "text-[#5A6157] hover:bg-[#EDE4D6]"
                      }`}
                    >
                      {t === "orders" ? (
                        <ShoppingBag className="h-4 w-4" />
                      ) : (
                        <Package className="h-4 w-4" />
                      )}
                      {t}
                    </button>
                  ))}
                </div>

                {tab === "orders" ? (
                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {(["All", ...ORDER_STATUSES] as (
                        | OrderStatus
                        | "All"
                      )[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                            statusFilter === s
                              ? "border-[#9E2A2B] bg-[#9E2A2B] text-white"
                              : "border-[#DED3C0] text-[#5A6157]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {filtered.length === 0 ? (
                      <div className="grid place-items-center rounded-2xl border border-dashed border-[#DED3C0] py-16 text-center">
                        <ShoppingBag className="mb-2 h-8 w-8 text-[#C9BEA9]" />
                        <p className="font-serif text-lg text-[#2A2E28]">
                          No orders here yet
                        </p>
                        <p className="text-sm text-[#8A8578]">
                          Place a test order from the store to see it appear.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filtered.map((o) => (
                          <div
                            key={o.id}
                            className="overflow-hidden rounded-xl border border-[#EADFCF] bg-white"
                          >
                            <button
                              onClick={() =>
                                setExpanded(expanded === o.id ? null : o.id)
                              }
                              className="flex w-full items-center gap-3 p-3 text-left"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-mono text-xs font-bold text-[#2A2E28]">
                                    {o.id}
                                  </p>
                                  <span
                                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[o.status]}`}
                                  >
                                    {o.status}
                                  </span>
                                </div>
                                <p className="mt-0.5 truncate text-sm text-[#2A2E28]">
                                  {o.customer.fullName} · {o.customer.city}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-[#2A2E28]">
                                  {formatETB(o.total)} ETB
                                </p>
                                <p className="text-[11px] text-[#8A8578]">
                                  {o.items.length} item
                                  {o.items.length > 1 ? "s" : ""}
                                </p>
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 text-[#B9B0A0] transition ${
                                  expanded === o.id ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            <AnimatePresence>
                              {expanded === o.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden border-t border-[#F0E9DC]"
                                >
                                  <div className="space-y-3 p-3">
                                    <div className="flex flex-wrap gap-2 text-xs">
                                      <a
                                        href={`tel:${o.customer.phone}`}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F0EE] px-3 py-1.5 font-medium text-[#2A6F5E]"
                                      >
                                        <Phone className="h-3.5 w-3.5" />
                                        {o.customer.phone}
                                      </a>
                                      <a
                                        href={`https://wa.me/${o.customer.phone.replace(/\D/g, "").replace(/^0/, "251")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F0EC] px-3 py-1.5 font-medium text-[#2A6F5E]"
                                      >
                                        WhatsApp
                                      </a>
                                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3ECE0] px-3 py-1.5 font-medium text-[#5A6157]">
                                        {o.paymentMethod}
                                      </span>
                                    </div>

                                    <div className="rounded-lg bg-[#FAF7F0] p-2">
                                      {o.items.map((i) => (
                                        <div
                                          key={i.key}
                                          className="flex justify-between py-0.5 text-xs text-[#5A6157]"
                                        >
                                          <span>
                                            {i.product.name} · {i.size} ·{" "}
                                            {i.color} × {i.quantity}
                                          </span>
                                          <span>
                                            {formatETB(
                                              i.product.price * i.quantity,
                                            )}
                                          </span>
                                        </div>
                                      ))}
                                    </div>

                                    {o.customer.addressNotes && (
                                      <p className="text-xs text-[#8A8578]">
                                        Address: {o.customer.addressNotes}
                                      </p>
                                    )}

                                    <div>
                                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#8A8578]">
                                        Update status
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {ORDER_STATUSES.map((s) => (
                                          <button
                                            key={s}
                                            onClick={() =>
                                              onUpdateStatus(o.id, s)
                                            }
                                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                                              o.status === s
                                                ? "border-[#2A2E28] bg-[#2A2E28] text-white"
                                                : "border-[#DED3C0] text-[#5A6157] hover:border-[#9E2A2B]/40"
                                            }`}
                                          >
                                            {o.status === s && (
                                              <Check className="h-3 w-3" />
                                            )}
                                            {s}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 p-5">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 rounded-xl border border-[#EADFCF] bg-white p-2.5"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-12 w-10 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#2A2E28]">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-[#8A8578]">
                            {formatETB(p.price)} ETB · {p.category}
                          </p>
                        </div>
                        <div className="flex items-center rounded-full border border-[#DED3C0]">
                          <button
                            onClick={() =>
                              onUpdateStock(p.id, Math.max(0, p.stock - 1))
                            }
                            className="grid h-7 w-7 place-items-center rounded-l-full hover:bg-[#EDE4D6]"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span
                            className={`w-9 text-center text-xs font-semibold ${
                              p.stock === 0 ? "text-[#9E2A2B]" : "text-[#2A2E28]"
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            onClick={() => onUpdateStock(p.id, p.stock + 1)}
                            className="grid h-7 w-7 place-items-center rounded-r-full hover:bg-[#EDE4D6]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        accent
          ? "border-[#9E2A2B]/20 bg-[#FBEDEC]"
          : "border-[#EADFCF] bg-white"
      }`}
    >
      <p className="text-[11px] uppercase tracking-wider text-[#8A8578]">
        {label}
      </p>
      <p
        className={`mt-0.5 font-serif text-xl font-semibold ${
          accent ? "text-[#9E2A2B]" : "text-[#2A2E28]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}