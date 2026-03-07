import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productToUiProduct } from "@/app/lib/productUi";
import { CartItemRow } from "./CartItemRow";

export default async function CartPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
          <p className="text-sm text-zinc-600">
            Please{" "}
            <Link href="/login" className="text-emerald-600 font-medium">
              log in
            </Link>{" "}
            to view your cart.
          </p>
        </div>
      </div>
    );
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.userId },
    include: { product: { include: { media: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
          <p className="text-sm text-zinc-600">Your cart is currently empty.</p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const cartItems = items.map((item) => {
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

  const cartSubtotal = cartItems.reduce((sum, it) => sum + it.subtotal, 0);
  const deliveryCharge = cartSubtotal > 0 ? 50 : 0;
  const gst = cartSubtotal * 0.18;
  const total = cartSubtotal + deliveryCharge + gst;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          {/* Left: Cart items */}
          <section className="space-y-4">
            {cartItems.map((item) => (
              <CartItemRow
                key={item.id}
                productId={item.productId}
                name={item.name}
                brand={item.brand}
                image={item.image}
                variantLabel={item.variantLabel}
                unitPrice={item.unitPrice}
                initialQuantity={item.quantity}
              />
            ))}
          </section>

          {/* Right: Order summary */}
          <aside className="space-y-4">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 text-sm">
              <h2 className="text-base font-semibold text-zinc-900 mb-3">
                Order Summary
              </h2>
              <div className="space-y-2 text-zinc-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toFixed(0)}</span>
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
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Proceed to Checkout
              </button>
            </div>

            <p className="text-xs text-zinc-500">
              Prices inclusive of applicable offers. Delivery and GST are
              approximate and will be finalized at checkout.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}


