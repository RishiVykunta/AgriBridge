 "use client";

import Link from "next/link";

type Category = {
  label: string;
  href: string;
  image: string;
  targetId?: string;
};

const CATEGORIES: readonly Category[] = [
  {
    label: "Offers",
    href: "/todays-offers",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772206524/Agricultural_special_offers_banner_farming_products_arranged_neatly_discount_tag_hanging_from_seed_bags_fertilizer_bags_and_spray_bottles_warm_sunlight_subtle_green_gradient_background_modern_flat_vector_1_zkl9d0.jpg",
  },
  {
    label: "Insecticides",
    href: "/crop-protection/insecticides",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772206313/Close-up_illustration_of_crop_leaves_with_small_insects_being_sprayed_by_a_farming_sprayer_healthy_green_field_background_soft_focus_modern_flat_farming_illustration_clean_composition_Size__252x146_px_wide_ban_hpmqrp.jpg",
  },
  {
    label: "Nutrients",
    href: "/crop-protection/insecticides",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772206747/Growing_plant_with_visible_roots_absorbing_nutrients_from_rich_soil_glowing_effect_around_roots_sunlight_from_top_fresh_green_gradient_background_minimal_modern_agriculture_style_illustration_Size__252x146_px_owbe6i.jpg",
  },
  {
    label: "Fungicides",
    href: "/crop-protection/insecticides",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772206828/Healthy_crop_leaf_protected_by_transparent_shield_from_fungal_spores_subtle_blue_and_green_tones_modern_flat_agricultural_illustration_clean_minimal_background_Size__252x146_px_wide_banner_layout_space_at_bott_ro8pur.jpg",
  },
  {
    label: "Vegetable & Fruit Seeds",
    href: "/seeds/fruit-seeds",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772206898/Assorted_fresh_vegetables_and_fruits_tomato_carrot_chili_watermelon_slice_arranged_beautifully_on_soft_green_background_seeds_scattered_lightly_modern_flat_illustration_style_Size__252x146_px_horizontal_ban_pn4q1v.jpg",
  },
  {
    label: "Herbicides",
    href: "/crop-protection/insecticides",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772206960/Crop_field_with_unwanted_weeds_fading_away_healthy_crops_standing_strong_farmer_spraying_herbicide_gently_soft_sunlight_modern_vector_farming_style_Size__252x146_px_wide_banner_minimal_composition_space_for_pskboa.jpg",
  },
  {
    label: "Growth Promoters",
    href: "/crop-protection/insecticides",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772207028/Young_plant_transforming_into_tall_healthy_crop_with_upward_growth_arrows_subtly_in_background_sunrise_effect_vibrant_green_theme_clean_flat_agriculture_illustration_Size__252x146_px_horizontal_banner_bottom_t_u1ewz5.jpg",
  },
  {
    label: "Farm Machinery",
    href: "/equipments/sprayers",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772207162/Modern_tractor_working_in_golden_field_during_sunset_soft_gradient_sky_minimalistic_style_clean_vector_agricultural_illustration_Size__252x146_px_wide_layout_lower_area_reserved_for_text_overlay_y2fkyc.jpg",
  },
  {
    label: "Flower Seeds",
    href: "/seeds/fruit-seeds",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772207225/Colorful_blooming_flowers_marigold_sunflower_rose_arranged_beautifully_soft_pastel_background_fresh_spring_vibe_clean_flat_illustration_Size__252x146_px_horizontal_banner_bottom_clear_for_title_asewhi.jpg",
  },
  {
    label: "Organic Farming",
    href: "/organic/bio-insecticides",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772207305/Organic_farm_scene_with_compost_basket_fresh_vegetables_natural_greenery_eco-friendly_theme_earthy_tones_modern_clean_illustration_Size__252x146_px_wide_banner_soft_gradient_background_space_for_text_overla_evnqqv.jpg",
  },
  {
    label: "Animal Husbandry",
    href: "/animal-husbandry/cattle-feed",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772207350/Farm_animals_cow_goat_chicken_standing_in_green_pasture_with_barn_in_background_warm_sunlight_clean_flat_vector_style_Size__252x146_px_horizontal_banner_bottom_area_clear_for_category_name_d1ylhz.jpg",
  },
  {
    label: "New Arrivals",
    href: "/#new-arrivals-section",
    targetId: "new-arrivals-section",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772207607/ChatGPT_Image_Feb_27_2026_09_23_12_PM_hua3td.png",
  },
];

export function CategoriesSection() {
  const scrollToTarget = (targetId?: string) => {
    if (!targetId || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const el = document.getElementById(targetId);
    if (!el) return;

    const headerOffset = 96; // keep consistent with header/hero
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top - headerOffset;

    window.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="border-b border-zinc-200 bg-white px-4 py-8 sm:px-6"
      aria-labelledby="categories-heading"
    >
      <h2 id="categories-heading" className="sr-only">
        Shop by category
      </h2>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6">
          {CATEGORIES.map((cat: Category) => (
            <Link
              key={cat.label}
              href={cat.href}
              onClick={(e) => {
                if (cat.targetId) {
                  e.preventDefault();
                  scrollToTarget(cat.targetId);
                }
              }}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 hover:border-emerald-400 hover:shadow-lg transition duration-300"
            >
              <div className="relative h-44 w-full">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-3">
                  <span className="text-sm font-semibold text-white tracking-wide text-center px-2">
                    {cat.label}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}