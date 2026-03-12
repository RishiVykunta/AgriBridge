import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
interface ProductWithMedia {
  id: string;
  name: string;
  brand: string;
  price: any; // Prisma Decimal
  stock: number;
  status: string;
  mainCategory: string;
  media: { url: string }[];
}

export default async function MyProductsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const products = await prisma.product.findMany({
    where: { sellerId: session.userId },
    include: { media: true },
    orderBy: { createdAt: "desc" },
  }) as unknown as ProductWithMedia[];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Products</h1>
          <p className="text-zinc-600 mt-1">Manage and track your product listings.</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
        >
          + Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 rounded-xl border-2 border-dashed border-zinc-200 bg-white">
          <span className="text-4xl mb-4 block">📦</span>
          <h3 className="text-lg font-medium text-zinc-900">No products yet</h3>
          <p className="text-zinc-500 mt-1">Start selling by adding your first product.</p>
          <Link
            href="/dashboard/products/new"
            className="mt-4 inline-block text-emerald-600 font-medium hover:underline"
          >
            Add a product now →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col sm:flex-row gap-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                {product.media[0] ? (
                  <img
                    src={product.media[0].url}
                    alt={product.name}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-400">
                    No image
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">{product.name}</h2>
                    <p className="text-sm text-zinc-500">{product.brand}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      product.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-700"
                        : product.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {product.status}
                    </span>
                    <p className="text-lg font-bold text-emerald-700">₹{Number(product.price).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4 text-sm">
                  <div className="flex gap-4 text-zinc-600">
                    <span>Stock: <strong className="text-zinc-900">{product.stock}</strong></span>
                    <span>Category: <strong className="text-zinc-900">{product.mainCategory.replace(/_/g, " ")}</strong></span>
                  </div>
                  <div className="flex gap-4">
                     {/* Edit/Delete functionality can be added later as per schema */}
                    <span className="text-zinc-400 cursor-not-allowed">Edit listing</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 text-sm text-zinc-500">
        <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700">
          ← Back to dashboard
        </Link>
      </p>
    </div>
  );
}
