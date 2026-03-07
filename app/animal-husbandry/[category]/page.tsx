import { CategoryListingLayout } from "@/app/components/CategoryListingLayout";
import { MEGA_MENU_CONFIG, formatLabelFromSlug, getCategoryHref } from "@/app/config/catalog";

type Props = {
  params: Promise<{ category: string }>;
};

export default async function AnimalHusbandryCategoryPage({
  params,
}: Props) {
  const { category } = await params;
  const categoryLabel = formatLabelFromSlug(category);
  const categories =
    (MEGA_MENU_CONFIG["Animal Husbandry"] ?? [])
      .flatMap((c) => c.items)
      .map((label) => ({ label, href: getCategoryHref("Animal Husbandry", label) }));

  return (
    <CategoryListingLayout
      sectionLabel="Animal Husbandry"
      categoryLabel={categoryLabel || "All Animal Husbandry"}
      categories={categories}
    />
  );
}

