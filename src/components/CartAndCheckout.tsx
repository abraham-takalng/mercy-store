import { useMemo, useState } from "react";
import {
  BadgeCheck, Check, ChevronDown, CreditCard, GraduationCap, Minus, Plus,
  Send, ShieldCheck, ShoppingBag, Trash2, Truck, X,
} from "lucide-react";
import { toast } from "sonner";
import { ASTU, DELIVERY_CITIES, PAYMENT_DETAILS, STORE, buildTelegramMessage, formatETB } from "@/data/mockData";
import {
  ASTU_COUPON, ASTU_DISCOUNT_RATE, FREE_SHIPPING_THRESHOLD, PAYMENT_METHODS,
  type CartItem, type CheckoutPayload, type Order, type PaymentMethod,
} from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (key: string, delta: number) => void;
  onRemove: (key: string) => void;
  onPlaceOrder: (payload: CheckoutPayload) => Order;
}

const input =
  "w-full rounded-lg border border-white/12 bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#F5EFE1] placeholder:text-[#6F6A61] focus:border-[#C8A24A] focus:outline-none";
const lab = "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8478]";
const gold =
  "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E3C87A] to-[#A37F26] text-sm font-semibold text-black transition hover:brightness-110";

const TEXT_FIELDS = [
  { key: "fullName", label: "Full name", ph: "Full name" },
  { key: "phone", label: "Phone", ph: "09xx xxx xxx" },
  { key: "email", label: "Email (optional)", ph: "you@example.com" },
] as const;

const ASTU_TEXT = [
  { key: "studentName", label: "Student name", ph: "Abebe Tesfaye" },
  { key: "studentId", label: "Student ID", ph: "ASTU/1234/15" },
  { key: "room", label: "Room", ph: "214" },
] as const;

const ASTU_SELECTS = [
  { key: "block", label: "Block", options: ASTU.blocks },
  { key: "dropPoint", label: "Drop point", options: ASTU.dropPoints },
  { key: "timeSlot", label: "Time slot", options: ASTU.timeSlots },
] as const;

export default function CartAndCheckout({
  open, onClose, cart, onUpdateQty, onRemove, onPlaceOrder,
}: Props) {
  const [step, setStep] = useState<"bag" | "checkout" | "done">("bag");
  const [placed, setPlaced] = useState<Order | null>(null);
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(false);
  const [city, setCity] = useState("Adama");
  const [payment, setPayment] = useState<PaymentMethod>("Telebirr");
  const [isAstu, setIsAstu] = useState(false);
  const [customer, setCustomer] = useState({
    fullName: "", phone: "", email: "", addressNotes: "",
  });
  const [astuForm, setAstuForm] = useState({
    studentName: "", studentId: "", block: ASTU.blocks[0], room: "",
    dropPoint: ASTU.dropPoints[0], timeSlot: ASTU.timeSlots[0],
  });

  const setC = (key: keyof typeof customer, value: string) =>
    setCustomer((p) => ({ ...p, [key]: value }));
  const setA = (key: keyof typeof astuForm, value: string) =>
    setAstuForm((p) => ({ ...p, [key]: value }));

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.product.price * i.quantity, 0),
    [cart],
  );
  const discount = coupon ? Math.round(subtotal * ASTU_DISCOUNT_RATE) : 0;
  const cityRow = DELIVERY_CITIES.find((c) => c.name === city) ?? DELIVERY_CITIES[0];
  const freeShip = subtotal - discount >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const deliveryFee = freeShip ? 0 : cityRow.fee;
  const total = subtotal - discount + deliveryFee;

  const close = () => {
    onClose();
    if (step === "done") { setStep("bag"); setPlaced(null); }
  };

  const applyCoupon = () => {
    if (code.trim().toUpperCase() === ASTU_COUPON) {
      setCoupon(true);
      toast.success("ASTU student discount applied — 20% off.");
    } else {
      toast.error(`Invalid coupon. Try ${ASTU_COUPON}.`);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Your bag is empty.");
    if (!customer.fullName.trim() || !customer.phone.trim())
      return toast.error("Please add your name and phone number.");
    if (city !== "Adama" && !customer.addressNotes.trim())
      return toast.error("Add a delivery address or landmark for your city.");
    if (isAstu && (!astuForm.studentName.trim() || !astuForm.studentId.trim()))
      return toast.error("ASTU orders need a student name and ID.");

    const order = onPlaceOrder({
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim() || undefined,
        city,
        addressNotes:
          customer.addressNotes.trim() || `${cityRow.name} · ${cityRow.eta} courier delivery`,
        isAstuStudent: isAstu,
        astu: isAstu
          ? {
              studentName: astuForm.studentName.trim(),
              studentId: astuForm.studentId.trim(),
              block: astuForm.block,
              room: astuForm.room.trim(),
              dropPoint: astuForm.dropPoint,
              timeSlot: astuForm.timeSlot,
            }
          : undefined,
      },
      paymentMethod: payment,
      deliveryFee,
      discount,
    });
    setPlaced(order);
    setStep("done");
    setIsAstu(false);
    toast.success(`Order ${order.id} received — we will confirm on Telegram.`);
  };

  if (!open) return null;

  const summary = (o: { sub: number; dis: number; fee: number; tot: number; cityName: string }) => (
    <div className="space-y-1 text-xs text-[#B9B3A6]">
      <div className="flex justify-between"><span>Subtotal</span><span>{formatETB(o.sub)} ETB</span></div>
      {o.dis > 0 && (
        <div className="flex justify-between text-[#8FD08F]">
          <span>Student discount</span><span>−{formatETB(o.dis)} ETB</span>
        </div>
      )}
      <div className="flex justify-between">
        <span>Delivery · {o.cityName}</span>
        <span>{o.fee === 0 ? "Free" : `${formatETB(o.fee)} ETB`}</span>
      </div>
      <div className="flex justify-between pt-1 text-base font-semibold text-[#E3C87A]">
        <span>Total</span><span>{formatETB(o.tot)} ETB</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <button aria-label="Close cart" onClick={close} className="flex-1" />
      <aside className="flex h-full w-full max-w-md flex-col border-l border-[#C8A24A]/30 bg-[#0B0B0B]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="flex items-center gap-2 font-serif text-xl text-[#F5EFE1]">
            <ShoppingBag className="h-4 w-4 text-[#C8A24A]" />
            {step === "bag" ? "Your bag" : step === "checkout" ? "Checkout" : "Order placed"}
          </h2>
          <button onClick={close} aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-[#E8E2D4] hover:text-[#E3C87A]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === "bag" && (
            <>
              {cart.length === 0 ? (
                <div className="mt-16 text-center">
                  <ShoppingBag className="mx-auto h-9 w-9 text-[#3A3A3A]" />
                  <p className="mt-3 font-serif text-lg text-[#F5EFE1]">Your bag is empty</p>
                  <p className="mt-1 text-sm text-[#7E7A70]">Browse the collection and add your first piece.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <li key={item.key} className="flex gap-3 rounded-xl border border-white/10 bg-[#0D0D0D] p-2.5">
                      <img src={item.product.image} alt={item.product.name}
                        className="h-20 w-16 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#F5EFE1]">{item.product.name}</p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-[#7E7A70]">
                          {item.size} · {item.color}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#E3C87A]">
                          {formatETB(item.product.price * item.quantity)}{" "}
                          <span className="text-[9px] font-normal text-[#7E7A70]">ETB</span>
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex items-center gap-1 rounded-full border border-white/12">
                            <button onClick={() => onUpdateQty(item.key, -1)} aria-label="Decrease"
                              className="grid h-6 w-6 place-items-center text-[#B9B3A6] hover:text-white">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-4 text-center text-xs text-[#F5EFE1]">{item.quantity}</span>
                            <button onClick={() => onUpdateQty(item.key, 1)} aria-label="Increase"
                              className="grid h-6 w-6 place-items-center text-[#B9B3A6] hover:text-white">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button onClick={() => onRemove(item.key)} aria-label="Remove"
                            className="ml-auto grid h-6 w-6 place-items-center text-[#7E7A70] hover:text-[#C8A24A]">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {cart.length > 0 && (
                <div className="mt-5 rounded-xl border border-white/10 bg-[#0D0D0D] p-3">
                  <label className={lab} htmlFor="coupon">Student / promo coupon</label>
                  <div className="flex gap-2">
                    <input id="coupon" value={code} onChange={(e) => setCode(e.target.value)}
                      placeholder={ASTU_COUPON} className={input} />
                    <button onClick={applyCoupon}
                      className="shrink-0 rounded-lg bg-[#C8A24A] px-3 text-xs font-bold uppercase tracking-[0.1em] text-black hover:brightness-110">
                      Apply
                    </button>
                  </div>
                  {coupon && (
                    <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#8FD08F]">
                      <Check className="h-3 w-3" /> 20% ASTU discount active
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {step === "checkout" && (
            <form id="checkout-form" onSubmit={submit} className="space-y-3">
              {TEXT_FIELDS.map((f) => (
                <div key={f.key}>
                  <label className={lab} htmlFor={`ck-${f.key}`}>{f.label}</label>
                  <input id={`ck-${f.key}`} className={input} value={customer[f.key]}
                    onChange={(e) => setC(f.key, e.target.value)} placeholder={f.ph} />
                </div>
              ))}

              <div>
                <label className={lab} htmlFor="ck-city">Delivery city</label>
                <div className="relative">
                  <select id="ck-city" className={`${input} appearance-none pr-9`} value={city}
                    onChange={(e) => setCity(e.target.value)}>
                    {DELIVERY_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} · {c.fee === 0 ? "Free" : `${formatETB(c.fee)} ETB`} · {c.eta}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8478]" />
                </div>
                {cityRow.note && <p className="mt-1 text-[10px] text-[#7E7A70]">{cityRow.note}</p>}
              </div>

              <div>
                <label className={lab} htmlFor="ck-addr">Address / landmark</label>
                <textarea id="ck-addr" className={`${input} h-20 resize-none`} value={customer.addressNotes}
                  onChange={(e) => setC("addressNotes", e.target.value)}
                  placeholder="Sub-city, street, landmark or dorm block" />
              </div>

              <div>
                <label className={lab} htmlFor="ck-pay">Payment method</label>
                <div className="relative">
                  <select id="ck-pay" className={`${input} appearance-none pr-9`} value={payment}
                    onChange={(e) => setPayment(e.target.value as PaymentMethod)}>
                    {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <CreditCard className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8478]" />
                </div>
                {(() => {
                  const pd = PAYMENT_DETAILS.find((p) => p.method === payment);
                  if (!pd) return null;
                  return (
                    <div className="mt-2 rounded-lg border border-[#C8A24A]/20 bg-[#0D0D0D] p-3">
                      <p className="text-[11px] text-[#B9B3A6]">{pd.description}</p>
                      {pd.accountNumber && (
                        <p className="mt-1.5 text-xs font-semibold tracking-wide text-[#E3C87A]">
                          Account: {pd.accountNumber}
                        </p>
                      )}
                      <p className="mt-1.5 text-[10px] text-[#7E7A70]">{pd.instructions}</p>
                    </div>
                  );
                })()}
              </div>

              <button type="button" onClick={() => setIsAstu((v) => !v)}
                className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition ${
                  isAstu ? "border-[#C8A24A] bg-[#C8A24A]/10 text-[#E3C87A]"
                    : "border-white/12 text-[#B9B3A6] hover:border-white/30"}`}>
                <GraduationCap className="h-4 w-4" />
                I am an ASTU student — deliver to my dorm
                {isAstu && <BadgeCheck className="ml-auto h-4 w-4" />}
              </button>

              {isAstu && (
                <div className="grid gap-3 rounded-xl border border-[#C8A24A]/30 bg-[#0D0D0D] p-3 sm:grid-cols-2">
                  {ASTU_TEXT.map((f) => (
                    <div key={f.key}>
                      <label className={lab} htmlFor={`as-${f.key}`}>{f.label}</label>
                      <input id={`as-${f.key}`} className={input} value={astuForm[f.key]}
                        onChange={(e) => setA(f.key, e.target.value)} placeholder={f.ph} />
                    </div>
                  ))}
                  {ASTU_SELECTS.map((f) => (
                    <div key={f.key}>
                      <label className={lab} htmlFor={`as-${f.key}`}>{f.label}</label>
                      <select id={`as-${f.key}`} className={input} value={astuForm[f.key]}
                        onChange={(e) => setA(f.key, e.target.value)}>
                        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </form>
          )}

          {step === "done" && placed && (
            <div className="mt-4 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#C8A24A]/15 text-[#E3C87A]">
                <Check className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-serif text-2xl text-[#F5EFE1]">Thank you!</h3>
              <p className="mt-1 text-sm text-[#A8A296]">
                Order <span className="text-[#E3C87A]">{placed.id}</span> is now pending confirmation.
              </p>
              <div className="mt-5 space-y-1.5 rounded-xl border border-white/10 bg-[#0D0D0D] p-4 text-left text-xs">
                {placed.items.map((i) => (
                  <div key={i.key} className="flex justify-between gap-3 text-[#B9B3A6]">
                    <span className="truncate">{i.quantity}× {i.product.name}</span>
                    <span className="shrink-0 text-[#F5EFE1]">{formatETB(i.product.price * i.quantity)}</span>
                  </div>
                ))}
                <div className="mt-2 border-t border-white/10 pt-2">
                  {summary({
                    sub: placed.subtotal, dis: placed.discount, fee: placed.deliveryFee,
                    tot: placed.total, cityName: placed.customer.city,
                  })}
                </div>
              </div>
              <a href={buildTelegramMessage([
                `Hello ${STORE.name}, confirming order ${placed.id}`,
                `Name: ${placed.customer.fullName} · ${placed.customer.phone}`,
                `City: ${placed.customer.city}`,
                `Items: ${placed.items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ")}`,
                `Total: ${formatETB(placed.total)} ETB · ${placed.paymentMethod}`,
              ])} target="_blank" rel="noreferrer" className={`${gold} mt-4 w-full py-2.5`}>
                <Send className="h-4 w-4" /> Confirm on Telegram
              </a>
            </div>
          )}
        </div>

        {step !== "done" && (
          <div className="border-t border-white/10 bg-[#0A0A0A] px-5 py-4">
            {summary({ sub: subtotal, dis: discount, fee: deliveryFee, tot: total, cityName: cityRow.name })}
            {step === "bag" ? (
              <button disabled={cart.length === 0} onClick={() => setStep("checkout")}
                className={`${gold} mt-3 w-full py-3 disabled:cursor-not-allowed disabled:opacity-40`}>
                <Truck className="h-4 w-4" /> Proceed to checkout
              </button>
            ) : (
              <div className="mt-3 flex gap-2">
                <button onClick={() => setStep("bag")}
                  className="rounded-full border border-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#B9B3A6] hover:border-white/40">
                  Back
                </button>
                <button type="submit" form="checkout-form" className={`${gold} flex-1 py-3`}>
                  <ShieldCheck className="h-4 w-4" /> Place order
                </button>
              </div>
            )}
            <p className="mt-2 text-center text-[10px] text-[#6F6A61]">
              Questions? Telegram {STORE.telegramHandle} · {STORE.phoneDisplay}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}