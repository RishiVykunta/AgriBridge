import { CategoryListingLayout } from "@/app/components/CategoryListingLayout";
import { MEGA_MENU_CONFIG, formatLabelFromSlug, getCategoryHref } from "@/app/config/catalog";

type Props = {
  params: Promise<{ category: string }>;
};

export default async function EquipmentsCategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryLabel = formatLabelFromSlug(category);
  const categories =
    (MEGA_MENU_CONFIG["Equipments"] ?? [])
      .flatMap((c) => c.items)
      .map((label) => ({ label, href: getCategoryHref("Equipments", label) }));

  return (
    <CategoryListingLayout
      sectionLabel="Equipments"
      categoryLabel={categoryLabel || "All Equipments"}
      categories={categories}
    />
  );
}

