import { redirect } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { approveProduct, rejectProduct } from "@/app/actions/products";

export default async function AdminProductsPage() {
  const session = await getSession();
  if (!session || !hasRole(session, "ADMIN")) redirect("/login");

  const pending = await prisma.product.findMany({
    where: { status: "PENDING" },
    include: {
      seller: { select: { email: true, name: true } },
      media: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Product Add Requests</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Review and approve products submitted by Farmers and Retailers.
      </p>

      {pending.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">No pending products.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {pending.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900">
                    {p.name}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    {p.brand} · ₹{p.price.toString()} · Stock {p.stock}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Seller: {p.seller.name ?? p.seller.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={approveProduct.bind(null, p.id)}>
                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={rejectProduct.bind(null, p.id)}>
                    <button
                      type="submit"
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>

              <p className="mt-3 text-xs text-zinc-600 line-clamp-3">
                {p.description}
              </p>

              {p.media.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {p.media.map((m) =>
                    m.type === "IMAGE" ? (
                      <img
                        key={m.id}
                        src={m.url}
                        alt={p.name}
                        className="h-16 w-16 rounded border border-zinc-200 object-cover"
                      />
                    ) : (
                      <span
                        key={m.id}
                        className="inline-flex h-16 items-center justify-center rounded border border-zinc-200 bg-zinc-50 px-3 text-[10px] font-medium text-zinc-700"
                      >
                        Video
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

