import { CategoryListingLayout } from "@/app/components/CategoryListingLayout";
import { MEGA_MENU_CONFIG, formatLabelFromSlug, getCategoryHref } from "@/app/config/catalog";

type Props = {
  params: Promise<{ category: string }>;
};

export default async function SeedsCategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryLabel = formatLabelFromSlug(category);
  const categories =
    (MEGA_MENU_CONFIG["Seeds"] ?? [])
      .flatMap((c) => c.items)
      .map((label) => ({ label, href: getCategoryHref("Seeds", label) }));

  return (
    <CategoryListingLayout
      sectionLabel="Seeds"
      categoryLabel={categoryLabel || "All Seeds"}
      categories={categories}
    />
  );
}

