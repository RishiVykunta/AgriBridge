export type MegaMenuColumn = { title: string; items: string[] };

export const MAIN_CATEGORY_OPTIONS = [
  { value: "SEEDS", label: "Seeds" },
  { value: "CROP_PROTECTION", label: "Crop Protection" },
  { value: "CROP_NUTRITION", label: "Crop Nutrition" },
  { value: "EQUIPMENTS", label: "Equipments" },
  { value: "ANIMAL_HUSBANDRY", label: "Animal Husbandry" },
  { value: "ORGANIC", label: "Organic" },
] as const;

export const NAV_ITEMS = [
  "Brands",
  "Seeds",
  "Crop Protection",
  "Crop Nutrition",
  "Equipments",
  "Animal Husbandry",
  "Organic",
  "Services",
  "Blogs",
] as const;

export const SECTION_IDS: Record<string, string> = {
  Brands: "brands-section",
  Seeds: "seeds-section",
  "Crop Protection": "crop-protection-section",
  "Crop Nutrition": "crop-nutrition-section",
  Equipments: "equipments-section",
  "Animal Husbandry": "animal-husbandry-section",
  Organic: "organic-section",
  Services: "services-section",
};

export const MEGA_MENU_CONFIG: Record<string, MegaMenuColumn[]> = {
  Seeds: [
    {
      title: "Horticulture Crops",
      items: ["Vegetables Seeds", "Fruit Seeds", "Flower Seeds"],
    },
    {
      title: "Field Crops",
      items: ["Forages", "Maize/Corn", "Paddy", "Mustard", "Jowar", "Cotton"],
    },
    {
      title: "Special Category",
      items: ["Polyhouse", "Exotics", "Forestry", "Urban Garden", "Saplings"],
    },
    {
      title: "Popular Products",
      items: ["Tomato", "Chilli", "Brinjal", "Cucumber", "Cauliflower"],
    },
  ],
  "Crop Protection": [
    {
      title: "Chemical Pesticides",
      items: [
        "Insecticides",
        "Fungicides",
        "Herbicides",
        "Bactericides",
        "Miticides/Acaricides",
      ],
    },
    {
      title: "Bio/Organic Pesticides",
      items: [
        "Bio Insecticides",
        "Bio Fungicides",
        "Bio Viricides",
        "Bio Nematicides",
        "Bio Miticides/Acaricides",
      ],
    },
    {
      title: "Traps and Lures",
      items: [
        "Sticky Traps",
        "Pheromone Lures",
        "Pheromone Traps",
        "Solar Light Traps",
      ],
    },
    {
      title: "Others",
      items: [
        "Adjuvants",
        "Surface Disinfectants",
        "Decomposers",
        "Animal Repellant",
        "Safety Kit",
        "Safety Shoes",
      ],
    },
  ],
  "Crop Nutrition": [
    {
      title: "Fertilizers",
      items: [
        "Chemical Fertilizers",
        "Bio/Organic Fertilizers",
        "Micro Nutrients",
        "Humic Acids",
        "pH Balancers",
      ],
    },
    {
      title: "Growth Promoters",
      items: [
        "Plant Growth Promoters",
        "Plant Enhancers",
        "Bio Stimulants/Activators",
      ],
    },
    {
      title: "Plant Growth Regulators",
      items: ["Yield Boosters", "Fruit Enhancers", "Flower Boosters"],
    },
    {
      title: "Popular",
      items: [
        "NPK Fertilizers",
        "Liquid Fertilizers",
        "Seaweed Extracts",
        "Fertilizer Enhancers",
      ],
    },
  ],
  Equipments: [
    {
      title: "Implements",
      items: [
        "Sprayers",
        "Brush Cutter",
        "Weeder/Tiller",
        "Chaff Cutter and Parts",
        "Solar Dryer",
        "Rice Mill",
        "Earth Augers",
        "Power Reaper",
        "Chain Saw",
        "Sugarcane Machine",
      ],
    },
    {
      title: "Agriculture Tools",
      items: [
        "Nursery Inputs",
        "Fruit Harvester/Plucker",
        "Garden Tools",
        "Seeder/Transplanter",
      ],
    },
    {
      title: "Accessories",
      items: [
        "Tirpal/Tarpaulin",
        "Mulch",
        "Shade Net",
        "Traps and Lure",
        "Safety Kit",
        "Torch/Lantern",
        "Crop Cover",
      ],
    },
    {
      title: "Irrigation",
      items: ["Pipe", "Water Pump", "Sprinkler", "Drip Kit"],
    },
  ],
  "Animal Husbandry": [
    {
      title: "Cattle",
      items: [
        "Cattle Feed",
        "Cattle Supplements",
        "Milking Machine",
        "Milking Machine Accessories",
        "Calf Feeding Bottle",
      ],
    },
    {
      title: "Poultry",
      items: ["Poultry Supplements", "Poultry Equipment"],
    },
    {
      title: "Others",
      items: ["Forage Seeds", "Silage Culture"],
    },
    {
      title: "Popular Brands",
      items: [
        "Meenakshi Agro",
        "Ecowealth",
        "Godhan",
        "Prompt Equipments Private Limited",
        "Agrigators Enterprises Private Limited",
        "Shivam Pharma",
      ],
    },
  ],
  Organic: [
    {
      title: "Bio/Organic Pesticides",
      items: [
        "Bio Insecticides",
        "Bio Fungicides",
        "Bio Viricides",
        "Bio Nematicides",
        "Bio Miticides/Acaricides",
      ],
    },
    {
      title: "Crop Nutrition",
      items: ["Bio/Organic Fertilizers", "Bio Stimulants/Activators"],
    },
  ],
  Services: [
    {
      title: "Services",
      items: ["Tractor Loan", "Harvester Loan", "Open Savings Account"],
    },
  ],
};

export const CATEGORY_BASE_PATH: Record<string, string> = {
  Seeds: "/seeds",
  "Crop Protection": "/crop-protection",
  "Crop Nutrition": "/crop-nutrition",
  Equipments: "/equipments",
  "Animal Husbandry": "/animal-husbandry",
  Organic: "/organic",
  Services: "/services",
};

export const SAVINGS_ACCOUNT_URL =
  "https://www.hdfc.bank.in/savings-account/savings-farmers-account";

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const formatLabelFromSlug = (slug?: string) =>
  (slug ?? "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// Where the top nav item should land when clicked
export const DEFAULT_PARENT_LINK: Record<string, string> = {
  Seeds: "/seeds/fruit-seeds",
  "Crop Protection": "/crop-protection/insecticides",
  "Crop Nutrition": "/crop-protection/insecticides",
  Equipments: "/equipments/sprayers",
  "Animal Husbandry": "/animal-husbandry/cattle-feed",
  Organic: "/organic/bio-insecticides",
  Services: "/services/tractor-loan",
};

// Force specific labels to go to specific URLs
export const CATEGORY_LINK_OVERRIDES: Record<string, Record<string, string>> = {
  Seeds: {
    "Vegetables Seeds": "/seeds/fruit-seeds",
    "Flower Seeds": "/seeds/fruit-seeds",
  },
  "Crop Protection": {
    Insecticides: "/crop-protection/insecticides",
    Fungicides: "/crop-protection/insecticides",
    Herbicides: "/crop-protection/insecticides",
  },
  Equipments: {
    Sprayers: "/equipments/sprayers",
  },
  "Animal Husbandry": {
    "Cattle Feed": "/animal-husbandry/cattle-feed",
  },
  Organic: {
    "Bio Insecticides": "/organic/bio-insecticides",
  },
};

/** Map UI label to Prisma MainCategory enum */
export const MAIN_CATEGORY_TO_ENUM: Record<string, string> = {
  Seeds: "SEEDS",
  "Crop Protection": "CROP_PROTECTION",
  "Crop Nutrition": "CROP_NUTRITION",
  Equipments: "EQUIPMENTS",
  "Animal Husbandry": "ANIMAL_HUSBANDRY",
  Organic: "ORGANIC",
};

/** Map Prisma enum to UI label for MEGA_MENU_CONFIG lookup */
export const ENUM_TO_MAIN_LABEL: Record<string, string> = {
  SEEDS: "Seeds",
  CROP_PROTECTION: "Crop Protection",
  CROP_NUTRITION: "Crop Nutrition",
  EQUIPMENTS: "Equipments",
  ANIMAL_HUSBANDRY: "Animal Husbandry",
  ORGANIC: "Organic",
};

/** Get flat list of subcategory labels for a main category */
export function getSubcategoriesForMain(mainLabel: string): string[] {
  const cols = MEGA_MENU_CONFIG[mainLabel];
  if (!cols) return [];
  const set = new Set<string>();
  for (const col of cols) {
    for (const item of col.items) set.add(item);
  }
  return Array.from(set).sort();
}

export const getCategoryHref = (parent: string, label: string) => {
  const forced = CATEGORY_LINK_OVERRIDES[parent]?.[label];
  if (forced) return forced;

  const base = CATEGORY_BASE_PATH[parent];
  if (!base) return "#";

  return `${base}/${slugify(label)}`;
};

