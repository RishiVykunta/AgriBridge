import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productToUiProduct } from "@/app/lib/productUi";

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?redirect=/checkout");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.userId },
    include: { product: { include: { media: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  const uiItems = cartItems.map((item) => {
    const ui = productToUiProduct(item.product);
    const firstPrice = ui.prices[0];
    const unitPrice = Number(firstPrice?.price ?? "0");
    const quantity = item.quantity;
    const subtotal = unitPrice * quantity;
    return {
      id: item.id,
      productId: item.productId,
      name: ui.name,
      brand: ui.brand,
      image: ui.image,
      variantLabel: firstPrice?.label,
      unitPrice,
      quantity,
      subtotal,
    };
  });

  const itemsSubtotal = uiItems.reduce((sum, it) => sum + it.subtotal, 0);
  const deliveryCharge = itemsSubtotal > 0 ? 50 : 0;
  const gst = itemsSubtotal * 0.18;
  const total = itemsSubtotal + deliveryCharge + gst;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900">
              Checkout
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Review your order, enter your details, and choose a payment method.
            </p>
          </div>
          <Link
            href="/cart"
            className="text-sm font-medium text-emerald-600 hover:underline"
          >
            ← Back to Cart
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1.1fr)] items-start">
          {/* Left column: address + payment */}
          <div className="space-y-6">
            {/* Shipping address */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-zinc-900">
                Shipping Details
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                We currently ship within India. Please enter a complete delivery
                address.
              </p>

              <form className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    defaultValue={session.name ?? ""}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. 9876543210"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700">
                    Address Line
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="House number, street, landmark"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </form>
            </section>

            {/* Payment options */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-zinc-900">
                Payment Method
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                This is a demo checkout UI. To enable real payments, integrate a
                provider like Razorpay, Stripe, or PayU using their SDK and
                server-side webhooks.
              </p>

              <div className="mt-4 space-y-3 text-sm">
                <label className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 hover:border-emerald-500 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    defaultChecked
                    className="h-4 w-4 text-emerald-600"
                  />
                  <div>
                    <p className="font-medium text-zinc-900">UPI / Wallet</p>
                    <p className="text-xs text-zinc-500">
                      Pay using popular UPI apps and wallets.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 hover:border-emerald-500 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="h-4 w-4 text-emerald-600"
                  />
                  <div>
                    <p className="font-medium text-zinc-900">
                      Credit / Debit Card
                    </p>
                    <p className="text-xs text-zinc-500">
                      Secure card payment (to be wired to gateway).
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 hover:border-emerald-500 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="h-4 w-4 text-emerald-600"
                  />
                  <div>
                    <p className="font-medium text-zinc-900">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-xs text-zinc-500">
                      Pay with cash when your order is delivered.
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Right column: order summary and items */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm text-sm">
              <h2 className="text-base font-semibold text-zinc-900 mb-3">
                Order Summary
              </h2>

              <div className="max-h-60 space-y-3 overflow-y-auto pr-1 border-b border-zinc-100 pb-3 mb-3">
                {uiItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-zinc-100">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xl text-zinc-300">
                            📦
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-900 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          Qty {item.quantity}
                          {item.variantLabel ? ` · ${item.variantLabel}` : ""}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-zinc-900">
                      ₹{item.subtotal.toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-zinc-700">
                <div className="flex justify-between">
                  <span>Items subtotal</span>
                  <span>₹{itemsSubtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₹{deliveryCharge.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{gst.toFixed(0)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-sm font-semibold text-zinc-900">
                  <span>Payable Amount</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Place Order &amp; Pay
              </button>

              <p className="mt-2 text-[11px] text-zinc-500">
                By placing your order, you agree to proceed with payment via the
                selected method. Integrate a real payment gateway here in
                production.
              </p>
            </div>

            <p className="text-xs text-zinc-500">
              This is a demo checkout. To go live, wire this page to your order
              creation logic and payment provider SDK (Razorpay/Stripe/PayU)
              and handle webhooks for payment confirmation.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

