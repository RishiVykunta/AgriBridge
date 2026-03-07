import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, hasRole } from "@/lib/auth";
import { deleteProduct } from "@/app/actions/products";
import { EditProductForm } from "./ui";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: Props) {
  const session = await getSession();
  if (!session || !hasRole(session, "ADMIN")) redirect("/login");

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { media: true },
  });
  if (!product) notFound();

  const imageUrls = product.media.filter((m) => m.type === "IMAGE").map((m) => m.url);
  const videoUrl = product.media.find((m) => m.type === "VIDEO")?.url ?? "";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Edit Product</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Update fields, media, pricing, and stock.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/admin/catalog"
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:border-emerald-300 hover:text-emerald-700"
          >
            ← Back
          </Link>
          <form action={deleteProduct.bind(null, product.id)}>
            <button
              type="submit"
              className="rounded-lg border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      <EditProductForm
        product={{
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price.toString(),
          stock: product.stock,
          discountPercent: product.discountPercent ?? null,
          description: product.description,
          mainCategory: product.mainCategory,
          subCategory: product.subCategory,
          imageUrls,
          videoUrl,
          packSizes: product.packSizes ?? null,
          isTodayOffer: product.isTodayOffer,
          isNewArrival: product.isNewArrival,
          isTrending: product.isTrending,
        }}
      />
    </div>
  );
}

