import { CategoryListingLayout } from "@/app/components/CategoryListingLayout";
import { MEGA_MENU_CONFIG, formatLabelFromSlug, getCategoryHref } from "@/app/config/catalog";

type Props = {
  params: Promise<{ category: string }>;
};

export default async function OrganicCategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryLabel = formatLabelFromSlug(category);
  const categories =
    (MEGA_MENU_CONFIG["Organic"] ?? [])
      .flatMap((c) => c.items)
      .map((label) => ({ label, href: getCategoryHref("Organic", label) }));

  return (
    <CategoryListingLayout
      sectionLabel="Organic"
      categoryLabel={categoryLabel || "All Organic"}
      categories={categories}
    />
  );
}

