"use client";

import { useFormState } from "react-dom";
import { useMemo, useState } from "react";
import { updateProduct } from "@/app/actions/products";
import {
  MAIN_CATEGORY_OPTIONS,
  getSubcategoriesForMain,
  ENUM_TO_MAIN_LABEL,
} from "@/app/config/catalog";

type EditableProduct = {
  id: string;
  name: string;
  brand: string;
  price: string;
  stock: number;
  discountPercent: number | null;
  description: string;
  mainCategory: string;
  subCategory: string;
  imageUrls: string[];
  videoUrl: string;
  packSizes: unknown;
  isTodayOffer: boolean;
  isNewArrival: boolean;
  isTrending: boolean;
};

function readablePackSizes(packSizes: unknown): string[] {
  if (!Array.isArray(packSizes)) return [];
  const out: string[] = [];
  for (const x of packSizes) {
    if (!x || typeof x !== "object") continue;
    const obj = x as Record<string, unknown>;
    if (typeof obj.label === "string" && obj.label.trim()) {
      const price = typeof obj.price === "number" ? `₹${obj.price}` : "";
      out.push(`${obj.label}${price ? ` · ${price}` : ""}`);
      continue;
    }
    const value = obj.value;
    const unit = obj.unit;
    if (typeof unit === "string" && (typeof value === "number" || typeof value === "string")) {
      out.push(`${value} ${unit}`);
    }
  }
  return out;
}

export function EditProductForm({ product }: { product: EditableProduct }) {
  const [state, formAction] = useFormState(updateProduct.bind(null, product.id), undefined);
  const [mainCategory, setMainCategory] = useState(product.mainCategory ?? "");
  const subcategories = useMemo(() => {
    const label = ENUM_TO_MAIN_LABEL[mainCategory] ?? "";
    return label ? getSubcategoriesForMain(label) : [];
  }, [mainCategory]);

  const [imageCount, setImageCount] = useState(Math.max(1, product.imageUrls.length || 1));
  const [packInput, setPackInput] = useState("");
  const [packUnit, setPackUnit] = useState("ml");
  const [packSizes, setPackSizes] = useState<{ value: string; unit: string }[]>([]);
  const existingPackSizes = useMemo(() => readablePackSizes(product.packSizes), [product.packSizes]);

  return (
    <>
      {state?.error && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <form
        action={formAction}
        className="mt-6 space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Product Name
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={product.name}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Brand Name
            </label>
            <input
              name="brand"
              type="text"
              required
              defaultValue={product.brand}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Price (₹)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={product.price}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Discount (%)
            </label>
            <input
              name="discountPercent"
              type="number"
              min="0"
              max="100"
              step="1"
              defaultValue={product.discountPercent ?? ""}
              placeholder="Optional"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Stock Quantity
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              required
              defaultValue={product.stock}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-600">
              <span>Availability:</span>
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name="availability"
                  value="in_stock"
                  defaultChecked={product.stock > 0}
                  className="h-3 w-3"
                />
                <span>In stock</span>
              </label>
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name="availability"
                  value="out_of_stock"
                  defaultChecked={product.stock <= 0}
                  className="h-3 w-3"
                />
                <span>Out of stock</span>
              </label>
            </div>
          </div>
        </div>

        {existingPackSizes.length > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-700">
                Current pack sizes
              </label>
              <span className="text-[11px] text-zinc-500">
                (Optional) Add new pack sizes below to overwrite
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {existingPackSizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Pack sizes
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={packInput}
              onChange={(e) => setPackInput(e.target.value)}
              placeholder="Value (e.g. 500)"
              className="w-1/2 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <select
              value={packUnit}
              onChange={(e) => setPackUnit(e.target.value)}
              className="w-1/3 rounded-lg border border-zinc-300 px-3 py-2 text-sm bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ml">ml</option>
              <option value="litre">litre</option>
              <option value="gram">gram</option>
              <option value="kg">kg</option>
              <option value="unit">unit</option>
            </select>
            <button
              type="button"
              className="w-1/6 rounded-lg bg-emerald-600 px-2 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              onClick={() => {
                const trimmed = packInput.trim();
                if (!trimmed || !packUnit) return;
                // Add to list if not already present
                if (!packSizes.some(s => s.value === trimmed && s.unit === packUnit)) {
                  setPackSizes((prev) => [...prev, { value: trimmed, unit: packUnit }]);
                }
                setPackInput("");
              }}
            >
              +
            </button>
          </div>

          {packSizes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {packSizes.map((size, idx) => (
                <button
                  key={`${size.value}-${size.unit}-${idx}`}
                  type="button"
                  onClick={() => setPackSizes((prev) => prev.filter((_, i) => i !== idx))}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  {size.value} {size.unit}
                  <span className="text-emerald-500">×</span>
                </button>
              ))}
            </div>
          )}

          {packSizes.map((size, idx) => (
            <div key={`hidden-${idx}`} className="hidden">
              <input type="hidden" name="quantityValue" value={size.value} />
              <input type="hidden" name="quantityUnit" value={size.unit} />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Description
          </label>
          <textarea
            name="description"
            rows={5}
            required
            defaultValue={product.description}
            placeholder="Detailed description of the product. Support multi-line text and lists..."
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Homepage sections */}
        <div>
          <p className="block text-sm font-medium text-zinc-700">
            Show this product in homepage sections
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            These flags control whether the product appears in Today&apos;s
            Offers, New Arrivals, or Trending sections on the home page.
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3 text-xs text-zinc-700">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="isTodayOffer"
                defaultChecked={product.isTodayOffer}
                className="h-3 w-3 rounded border-zinc-300"
              />
              <span>Today&apos;s Offers</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="isNewArrival"
                defaultChecked={product.isNewArrival}
                className="h-3 w-3 rounded border-zinc-300"
              />
              <span>New Arrivals</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="isTrending"
                defaultChecked={product.isTrending}
                className="h-3 w-3 rounded border-zinc-300"
              />
              <span>Trending Products</span>
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Main Category
            </label>
            <select
              name="mainCategory"
              required
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Select</option>
              {MAIN_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Subcategory
            </label>
            {subcategories.length > 0 ? (
              <select
                name="subCategory"
                required
                defaultValue={product.subCategory}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Select</option>
                {subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="subCategory"
                type="text"
                required
                defaultValue={product.subCategory}
                placeholder="Select main category first, or type manually"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Image URLs (at least one required)
          </label>
          <div className="mt-1 space-y-2">
            {Array.from({ length: imageCount }, (_, i) => (
              <input
                key={i}
                name="imageUrls"
                type="url"
                required={i === 0}
                defaultValue={product.imageUrls[i] ?? ""}
                placeholder={`Image ${i + 1} URL${i === 0 ? " (required)" : ""}`}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            ))}
            <button
              type="button"
              onClick={() => setImageCount((n) => n + 1)}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              + Add another image
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Product Video URL (optional)
          </label>
          <input
            name="videoUrl"
            type="url"
            defaultValue={product.videoUrl}
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            Tip: Leave pack sizes empty to keep existing pack sizes.
          </p>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Save changes
          </button>
        </div>
      </form>
    </>
  );
}

