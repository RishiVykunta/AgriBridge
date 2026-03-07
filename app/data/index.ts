import type { Product } from "../components/ProductSection";
import { slugify } from "../config/catalog";

// --- Brands ---
export type Brand = {
  name: string;
  slug: string;
  logo: string;
};

export const BRANDS: Brand[] = [
  {
    name: "Dhanuka Agritech",
    slug: slugify("Dhanuka Agritech"),
    logo: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772548775/Create_a_clean_professional_corporate_logo_for_Dhanuka_Agritech_._Use_green_and_blue_color_tones_to_reflect_agriculture_and_trust._Modern_sans-serif_typography_with_a_subtle_leaf_or_crop_element_integrated_into_t_s3gxxp.jpg",
  },
  {
    name: "FMC",
    slug: slugify("FMC"),
    logo: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772548773/Design_a_modern_corporate_logo_for_FMC_._Use_bold_blue_color_with_strong_clean_typography._Minimal_and_professional_look_flat_vector_style._No_gradients_or_shadows._Suitable_for_agricultural_and_chemical_industr_qyluhd.jpg",
  },
  {
    name: "UPL",
    slug: slugify("UPL"),
    logo: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772548770/Create_a_sleek_modern_logo_for_UPL_with_purple_and_magenta_tones._Use_bold_rounded_typography_and_a_simple_abstract_element_symbolizing_growth_or_innovation._Clean_vector_style_minimal_design_white_or_transpar_juwkbz.jpg",
  },
  {
    name: "Bayer",
    slug: slugify("Bayer"),
    logo: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772548769/Generate_a_professional_circular_corporate_logo_for_Bayer_._Use_green_and_blue_cross-style_branding_inside_a_circle_clean_typography._Flat_vector_design_sharp_and_high_contrast._White_or_transparent_background._nl15ui.jpg",
  },
  {
    name: "Syngenta",
    slug: slugify("Syngenta"),
    logo: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772548767/Design_a_clean_corporate_logo_for_Syngenta_using_dark_blue_typography_with_a_small_green_leaf_accent_above_the_lettering._Minimal_professional_flat_vector_style._White_or_transparent_background._Website-ready_f_prfd9t.jpg",
  },
  {
    name: "Sumitomo Chemical",
    slug: slugify("Sumitomo Chemical"),
    logo: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772548743/Create_a_professional_logo_for_Sumitomo_Chemical_with_red_corporate_branding._Use_clean_modern_typography_and_a_simple_red_emblem_symbolizing_chemistry_or_innovation._Flat_vector_style_sharp_edges_white_or_tran_hgq9ql.jpg",
  },
  {
    name: "Multiplex",
    slug: slugify("Multiplex"),
    logo: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772548743/Design_a_modern_agricultural_brand_logo_for_Multiplex_._Use_green_tones_with_a_leaf_or_plant-inspired_symbol_integrated_into_the_typography._Clean_minimal_vector_design_flat_style._White_or_transparent_backgroun_llflp4.jpg",
  },
];


// --- Growth Promoters ---
export const GROWTH_PROMOTERS: Product[] = [
  {
    name: "Fantac Plus Growth Promoter",
    brand: "Coromandel",
    prices: [{ label: "100 ml", price: "259" }],
    cutPrice: "430",
    save: "171",
    discount: "40% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772546501/Create_a_high-quality_e-commerce_product_image_of_Fantac_Plus_Growth_Promoter_._The_packaging_should_be_a_premium_agricultural_liquid_bottle_or_pouch_with_green_and_gold_accents._Include_subtle_plant_growth_graphi_f4usf1.jpg",
    description:
      "Liquid growth promoter that supports vigorous vegetative growth and flowering.",
  },
  {
    name: "Amruth Adhaar Amino Acid",
    brand: "Amruth Organic",
    prices: [{ label: "1000 ml", price: "809" }],
    cutPrice: "899",
    save: "90",
    discount: "10% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772546564/Generate_a_realistic_product_image_of_Amruth_Adhaar_Amino_Acid_in_a_sturdy_agricultural_bottle._Use_earthy_green_and_brown_tones_with_leaf_and_crop_imagery_on_the_label._The_design_should_look_organic_and_bio-bas_yfms1c.jpg",
    description:
      "Amino acid-based formulation that reduces stress and improves nutrient uptake.",
  },
  {
    name: "Banana Special Growth Booster",
    brand: "Anand Agro",
    prices: [{ label: "1 ltr", price: "1606" }],
    cutPrice: "2008",
    save: "402",
    discount: "20% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772546608/Create_a_premium_agricultural_product_image_for_Banana_Special_Growth_Booster_._The_packaging_should_feature_banana_plantation_imagery_and_vibrant_green-yellow_colors._Use_a_liquid_fertilizer_bottle_or_pouch_desig_seqddj.jpg",
    description:
      "Specialized booster for banana crops to enhance bunch size and fruit filling.",
  },
  {
    name: "Geolife Plus Gold",
    brand: "Geolife",
    prices: [{ label: "250 ml", price: "249" }],
    cutPrice: "373",
    save: "124",
    discount: "33% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772546652/Design_a_high-end_product_image_for_Geolife_Plus_Gold_fertilizer._The_packaging_should_look_premium_with_gold_and_dark_green_color_scheme_modern_agricultural_branding_and_crop_growth_visuals._Realistic_packagin_fdznrw.jpg",
    description:
      "Premium plant growth enhancer with balanced nutrients for higher productivity.",
  },
  {
    name: "Root Booster Pro",
    brand: "FarmTech",
    prices: [{ label: "500 ml", price: "499" }],
    cutPrice: "699",
    save: "200",
    discount: "29% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772546692/Generate_a_professional_e-commerce_image_for_Root_Booster_Pro_fertilizer._The_packaging_should_highlight_strong_root_graphics_growing_underground_with_healthy_green_plants_above._Use_green_and_brown_earthy_tones._nfgnur.jpg",
    description:
      "Root-strengthening formula that promotes deeper, healthier root systems.",
  },
];


// --- New Arrivals ---
export const NEW_ARRIVALS: Product[] = [
  {
    name: "Premium Hybrid Corn Seeds",
    brand: "AgriPro",
    prices: [{ label: "1 kg", price: "299" }],
    cutPrice: "399",
    save: "100",
    discount: "25% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772545877/Create_a_realistic_e-commerce_product_image_of_a_Premium_Hybrid_Corn_Seeds_package._The_packaging_should_be_a_standing_matte_pouch_with_bright_yellow_corn_imagery_and_green_farm_fields_in_the_background_design._M_vmtzmi.jpg",
    description:
      "High-vigor hybrid corn seeds designed for better yield and grain quality.",
  },
  {
    name: "Bio Potash Fertilizer",
    brand: "GreenGrow",
    prices: [{ label: "5 kg", price: "599" }],
    cutPrice: "799",
    save: "200",
    discount: "25% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772545900/Generate_a_professional_product_image_of_a_Bio_Potash_Fertilizer_bag._The_package_should_look_sturdy_and_agricultural-grade_with_earthy_brown_and_green_tones._Include_subtle_plant_growth_graphics_on_the_packagin_c8cblg.jpg",
    description:
      "Bio-based potash fertilizer that improves root strength and crop resilience.",
  },
  {
    name: "Neem Oil Spray",
    brand: "Organic India",
    prices: [{ label: "500 ml", price: "349" }],
    cutPrice: "499",
    save: "150",
    discount: "30% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772545939/Create_a_high-quality_product_image_of_a_Neem_Oil_Spray_bottle._The_bottle_should_be_dark_green_or_amber_with_a_spray_nozzle_labeled_with_neem_leaves_graphics._Fresh_natural_aesthetic_clean_typography_on_label._daiiqa.jpg",
    description:
      "Natural neem-based spray for controlling a wide range of sucking pests.",
  },
  {
    name: "Vegetable Seed Combo Pack",
    brand: "VNR",
    prices: [{ label: "Combo", price: "499" }],
    cutPrice: "699",
    save: "200",
    discount: "28% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772546023/Design_a_product_image_showing_a_Vegetable_Seed_Combo_Pack_consisting_of_multiple_colorful_seed_packets_tomato_carrot_spinach_chili_arranged_neatly_in_front_of_a_main_combo_pack_box._Bright_vibrant_agricult_mmhowv.jpg",
    description:
      "Mixed vegetable seed combo for home gardens and diversified cropping.",
  },
  {
    name: "Organic Micronutrient Mix",
    brand: "AgriCare",
    prices: [{ label: "1 kg", price: "399" }],
    cutPrice: "549",
    save: "150",
    discount: "27% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772546078/Generate_a_premium-looking_Organic_Micronutrient_Mix_fertilizer_pouch._Use_natural_green_and_blue_tones_with_crop_field_imagery_in_the_label_design._Clean_eco-friendly_branding_style._Realistic_packaging_texture_ji0h5e.jpg",
    description:
      "Organic micronutrient blend to correct hidden deficiencies and improve crop health.",
  },
];


// --- Seeds ---
export const SEEDS: Product[] = [
  {
    name: "Saaho Tomato Seeds",
    brand: "Syngenta",
    prices: [{ label: "3500 seeds", price: "1014" }],
    cutPrice: "1525",
    save: "511",
    discount: "34% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772547364/Create_a_high-quality_e-commerce_product_image_of_Saaho_Tomato_Seeds_._The_packaging_should_be_a_vibrant_seed_pouch_featuring_fresh_red_tomatoes_and_green_vines._Use_bright_red_and_green_color_tones_with_modern_ag_jg6igb.jpg",
    description:
      "Popular hybrid tomato seeds known for high yield and firm, uniform fruits.",
  },
  {
    name: "Sagar King Watermelon Seeds",
    brand: "Sagar Bio Tech",
    prices: [{ label: "50 gms", price: "1400" }],
    cutPrice: "2100",
    save: "700",
    discount: "33% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772547414/Generate_a_professional_product_image_of_Sagar_King_Watermelon_Seeds_._The_seed_packet_should_display_large_striped_watermelons_and_a_fresh_farm_background._Use_green_and_red_tones_with_bold_premium_branding._Rea_p011vo.jpg",
    description:
      "Hybrid watermelon variety with large fruits and excellent sweetness.",
  },
  {
    name: "KUNDAN F1 Hybrid Muskmelon",
    brand: "Known-You",
    prices: [{ label: "50 gms", price: "2989" }],
    cutPrice: "3750",
    save: "761",
    discount: "20% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772547507/Create_a_realistic_e-commerce_image_for_KUNDAN_F1_Hybrid_Muskmelon_seeds._The_packaging_should_show_ripe_muskmelons_with_netted_skin_texture_and_fresh_green_leaves._Use_warm_orange_and_green_tones_for_an_agricult_iah7vn.jpg",
    description:
      "Premium muskmelon seeds producing uniform, sweet fruits with strong aroma.",
  },
  {
    name: "Radhika Bhindi Hybrid Seeds",
    brand: "Advanta",
    prices: [{ label: "1500 seeds", price: "679" }],
    cutPrice: "990",
    save: "311",
    discount: "31% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772547559/Design_a_professional_product_image_of_Radhika_Bhindi_Hybrid_Seeds_._The_seed_packet_should_feature_fresh_green_okra_bhindi_pods_and_healthy_crop_imagery._Use_bright_green_tones_with_modern_agricultural_label_de_psodbv.jpg",
    description:
      "High-yield hybrid okra with tender pods and strong tolerance to common stresses.",
  },
  {
    name: "VNR 145 F1 Hybrid Chilli Seeds",
    brand: "VNR",
    prices: [{ label: "10 gms", price: "559" }],
    cutPrice: "720",
    save: "161",
    discount: "22% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772547600/Generate_a_premium_e-commerce_product_image_of_VNR_145_F1_Hybrid_Chilli_Seeds_._The_packaging_should_display_vibrant_red_and_green_chilli_peppers_with_bold_agricultural_branding._Use_red_and_green_color_theme_for_k73mrf.jpg",
    description:
      "High-performing chilli hybrid with uniform fruits suited for fresh market and drying.",
  },
];

// --- Today's Offers ---
export const TODAYS_OFFERS: Product[] = [
  {
    name: "NPK Fertilizer 50kg",
    brand: "Coromandel",
    prices: [
      { label: "1 kg", price: "50" },
      { label: "5 kg", price: "240" },
      { label: "50 kg", price: "1299" },
    ],
    cutPrice: "1599",
    save: "300",
    discount: "19% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772210957/A_centered_50kg_NPK_fertilizer_bag_realistic_agricultural_packaging_standing_upright_minimal_light_grey_background_soft_diffused_lighting_subtle_ground_shadow_modern_e-commerce_product_style_high_detail_text_mc05mo.jpg",
    description:
      "Balanced NPK fertilizer for boosting crop yield across a wide range of soils.",
  },
  {
    name: "Insecticide Spray",
    brand: "Bayer",
    prices: [
      { label: "500 ml", price: "449" },
      { label: "1 L", price: "799" },
    ],
    cutPrice: "549",
    save: "100",
    discount: "18% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772213984/A_500ml_insecticide_spray_bottle_modern_agricultural_product_design_centered_composition_light_grey_minimal_background_soft_studio_lighting_subtle_shadow_realistic_label_design_without_readable_text_professi_vscel2.jpg",
    description:
      "Fast-acting insecticide spray for effective control of sucking and chewing pests.",
  },
  {
    name: "Tomato Seeds Premium",
    brand: "AgriGold",
    prices: [
      { label: "50 g", price: "199" },
      { label: "100 g", price: "349" },
    ],
    cutPrice: "499",
    save: "300",
    discount: "80% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772210286/A_centered_product_image_of_a_premium_tomato_seeds_packet_clean_modern_e-commerce_style_minimal_light_grey_background_soft_studio_lighting_subtle_shadow_below_the_product_realistic_packaging_with_agricultural_mm4c1m.jpg",
    description:
      "High-germination premium tomato seeds for uniform fruits and better shelf life.",
  },
  {
    name: "Organic Compost 10kg",
    brand: "Green Earth",
    prices: [
      { label: "5 kg", price: "199" },
      { label: "10 kg", price: "349" },
    ],
    cutPrice: "449",
    save: "100",
    discount: "22% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772213983/A_10kg_organic_compost_bag_eco-friendly_packaging_design_natural_earthy_tones_centered_product_shot_clean_light_grey_background_soft_studio_lighting_subtle_shadow_underneath_professional_e-commerce_style_hi_sgxxqz.jpg",
    description:
      "Organic compost enriched with micronutrients to improve soil structure and health.",
  },
  {
    name: "Wheat Seeds 5kg",
    brand: "VNR",
    prices: [
      { label: "1 kg", price: "149" },
      { label: "5 kg", price: "599" },
    ],
    cutPrice: "749",
    save: "150",
    discount: "20% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772213983/A_5kg_wheat_seeds_bag_realistic_agricultural_packaging_with_natural_grain-themed_design_warm_earthy_tones_centered_product_composition_clean_light_grey_minimal_background_soft_studio_lighting_subtle_shadow_be_wacjf7.jpg",
    description:
      "High-yielding wheat seeds suitable for multiple agro-climatic regions.",
  },
];


// --- Trending Products ---
export const TRENDING_PRODUCTS: Product[] = [
  {
    name: "Simodis Insecticide",
    brand: "Syngenta",
    prices: [{ label: "80 ml", price: "803" }],
    cutPrice: "1029",
    save: "226",
    discount: "22% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772548027/Create_a_high-quality_e-commerce_product_image_of_Simodis_Insecticide._The_packaging_should_be_a_sturdy_agricultural_bottle_with_red_and_green_accents_featuring_crop_protection_graphics_and_subtle_pest_control_i_fm1qln.jpg",
    description:
      "Systemic insecticide for broad-spectrum control of major crop pests.",
  },
  {
    name: "Isabion Biostimulant",
    brand: "Syngenta",
    prices: [{ label: "100 ml", price: "174" }],
    cutPrice: "225",
    save: "51",
    discount: "23% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772548010/Generate_a_premium_product_image_of_Isabion_Biostimulant_in_a_modern_agricultural_bottle._Use_green_and_blue_tones_to_reflect_plant_vitality_and_growth_stimulation._Label_should_include_healthy_crop_visuals_and_s_xeeeo7.jpg",
    description:
      "Biostimulant that supports plant recovery from stress and improves crop vigor.",
  },
  {
    name: "Amistar Top Fungicide",
    brand: "Syngenta",
    prices: [{ label: "100 ml", price: "566" }],
    cutPrice: "749",
    save: "183",
    discount: "24% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772547978/Create_a_professional_e-commerce_image_of_Amistar_Top_Fungicide_._The_product_should_appear_as_a_high-quality_agricultural_liquid_bottle_with_strong_crop_disease_protection_graphics._Use_blue_and_green_tones_for_a_pcem2v.jpg",
    description:
      "Broad-spectrum fungicide to protect crops against major foliar diseases.",
  },
  {
    name: "Rogor Insecticide",
    brand: "FMC",
    prices: [{ label: "100 ml", price: "119" }],
    cutPrice: "124",
    save: "5",
    discount: "4% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772547978/Design_a_realistic_product_image_of_Rogor_Insecticide_in_a_classic_agricultural_bottle_style._Use_bold_red_and_white_branding_elements_with_crop_protection_visuals._Professional_farm-grade_appearance_centered_pr_wxw3dj.jpg",
    description:
      "Classic contact insecticide for quick knockdown of sucking insects.",
  },
  {
    name: "Fruit Fly Trap",
    brand: "Green Revolution",
    prices: [{ label: "1 unit", price: "17" }],
    cutPrice: "30",
    save: "13",
    discount: "43% OFF",
    image:
      "https://res.cloudinary.com/dqcxekzxn/image/upload/v1772547977/Generate_a_high-quality_e-commerce_product_image_of_a_Fruit_Fly_Trap_._The_product_should_show_a_yellow_sticky_trap_card_or_trap_device_with_subtle_fruit_and_pest_control_imagery._Clean_agricultural_branding_cent_fscp0n.jpg",
    description:
      "Easy-to-use trap to monitor and reduce fruit fly populations in orchards and fields.",
  },
];
