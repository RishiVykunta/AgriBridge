import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "@/app/actions/products";

type Props = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

function getSellerBucket(
  roles: Array<{ role: string; status: string }>
): "ADMIN" | "RETAILER" | "FARMER" | "CONSUMER" {
  const roleSet = new Set(roles.map((r) => r.role));
  if (roleSet.has("ADMIN")) return "ADMIN";
  if (roleSet.has("RETAILER")) return "RETAILER";
  if (roleSet.has("FARMER")) return "FARMER";
  return "CONSUMER";
}

export default async function AdminCatalogPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session || !hasRole(session, "ADMIN")) redirect("/login");

  const { message, error } = await searchParams;

  const products = await prisma.product.findMany({
    include: {
      media: true,
      seller: { include: { roles: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const buckets: Record<string, typeof products> = {
    ADMIN: [],
    RETAILER: [],
    FARMER: [],
    CONSUMER: [],
  };

  for (const p of products) {
    const bucket = getSellerBucket(p.seller.roles);
    buckets[bucket].push(p);
  }

  const sections: Array<{ key: keyof typeof buckets; title: string; desc: string }> = [
    { key: "ADMIN", title: "Admin Products", desc: "Products added by Admin users." },
    { key: "RETAILER", title: "Retailer Products", desc: "Products added by Retailers (may need approval)." },
    { key: "FARMER", title: "Farmer Products", desc: "Products added by Farmers (may need approval)." },
    { key: "CONSUMER", title: "Customer Products", desc: "Products added by Consumers (if enabled)." },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Catalog</h1>
          <p className="mt-1 text-sm text-zinc-600">
            View products grouped by who added them. Edit or delete any listing.
          </p>
        </div>
        <Link
          href="/dashboard/admin/products"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:border-emerald-300 hover:text-emerald-700"
        >
          Product requests
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <div className="mt-6 space-y-8">
        {sections.map((s) => (
          <section key={s.key}>
            <div className="mb-3">
              <h2 className="text-base font-semibold text-zinc-900">{s.title}</h2>
              <p className="text-xs text-zinc-500">{s.desc}</p>
            </div>

            {buckets[s.key].length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500">
                No products.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
                <table className="min-w-full divide-y divide-zinc-200 text-sm">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-zinc-600">
                        Product
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-zinc-600">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-zinc-600">
                        Seller
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-zinc-600">
                        Created
                      </th>
                      <th className="px-4 py-2 text-right font-medium text-zinc-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {buckets[s.key].map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-2 align-top">
                          <div className="font-medium text-zinc-900">
                            {p.name}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {p.brand} · ₹{p.price.toString()} · Stock {p.stock}
                          </div>
                        </td>
                        <td className="px-4 py-2 align-top">
                          <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 align-top text-xs text-zinc-700">
                          {p.seller.name ?? p.seller.email}
                          <div className="text-[11px] text-zinc-400">
                            {p.seller.email}
                          </div>
                        </td>
                        <td className="px-4 py-2 align-top text-xs text-zinc-600">
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 align-top text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/products/${p.id}`}
                              className="text-xs font-semibold text-zinc-700 hover:underline"
                            >
                              View
                            </Link>
                            <Link
                              href={`/dashboard/admin/catalog/${p.id}/edit`}
                              className="text-xs font-semibold text-emerald-700 hover:underline"
                            >
                              Edit
                            </Link>
                            <form action={deleteProduct.bind(null, p.id)}>
                              <button
                                type="submit"
                                className="text-xs font-semibold text-red-700 hover:underline"
                              >
                                Delete
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-zinc-500">
        <Link href="/dashboard/admin" className="text-emerald-600 hover:text-emerald-700">
          ← Admin Dashboard
        </Link>
      </p>
    </div>
  );
}

