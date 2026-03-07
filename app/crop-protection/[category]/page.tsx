import { CategoryListingLayout } from "@/app/components/CategoryListingLayout";
import { MEGA_MENU_CONFIG, formatLabelFromSlug, getCategoryHref } from "@/app/config/catalog";

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CropProtectionCategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryLabel = formatLabelFromSlug(category);
  const categories =
    (MEGA_MENU_CONFIG["Crop Protection"] ?? [])
      .flatMap((c) => c.items)
      .map((label) => ({ label, href: getCategoryHref("Crop Protection", label) }));

  return (
    <CategoryListingLayout
      sectionLabel="Crop Protection"
      categoryLabel={categoryLabel || "All Crop Protection"}
      categories={categories}
    />
  );
}

