import { CategoryListingLayout } from "@/app/components/CategoryListingLayout";
import {
  MEGA_MENU_CONFIG,
  formatLabelFromSlug,
  getCategoryHref,
} from "@/app/config/catalog";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productToUiProduct } from "@/app/lib/productUi";
import { BRANDS } from "@/app/data";

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CropNutritionCategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryLabel = formatLabelFromSlug(category);

  const categories =
    (MEGA_MENU_CONFIG["Crop Nutrition"] ?? [])
      .flatMap((c) => c.items)
      .map((label) => ({
        label,
        href: getCategoryHref("Crop Nutrition", label),
      }));

  const session = await getSession();
  const isLoggedIn = !!session;

  const whereClause: any = {
    status: "APPROVED",
    mainCategory: "CROP_NUTRITION",
  };

  if (categoryLabel) {
    whereClause.subCategory = categoryLabel;
  }

  const rows = await prisma.product.findMany({
    where: whereClause,
    include: { media: true },
    orderBy: { createdAt: "desc" },
  });

  const products = rows.map((p) => productToUiProduct(p));
  const brands = BRANDS.map((b) => b.name);

  return (
    <CategoryListingLayout
      sectionLabel="Crop Nutrition"
      categoryLabel={categoryLabel || "All Crop Nutrition"}
      categories={categories}
      products={products}
      isLoggedIn={isLoggedIn}
      brands={brands}
    />
  );
}

