"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { addProduct } from "@/app/actions/products";
import {
  MAIN_CATEGORY_OPTIONS,
  getSubcategoriesForMain,
  ENUM_TO_MAIN_LABEL,
} from "@/app/config/catalog";

export default function NewProductPage() {
  const [state, formAction] = useFormState(addProduct, undefined);
  const [mainCategory, setMainCategory] = useState("");
  const subcategories = mainCategory
    ? getSubcategoriesForMain(ENUM_TO_MAIN_LABEL[mainCategory] ?? "")
    : [];
  const [imageCount, setImageCount] = useState(2);
  const [packUnit, setPackUnit] = useState("");
  const [packInput, setPackInput] = useState("");
  const [packSizes, setPackSizes] = useState<string[]>([]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-zinc-900">Add Product</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Products will be visible only after admin approval (unless added by Admin).
      </p>

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
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-600">
              <span>Availability:</span>
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name="availability"
                  value="in_stock"
                  defaultChecked
                  className="h-3 w-3"
                />
                <span>In stock</span>
              </label>
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name="availability"
                  value="out_of_stock"
                  className="h-3 w-3"
                />
                <span>Out of stock</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Pack sizes (optional)
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={packInput}
              onChange={(e) => setPackInput(e.target.value)}
              placeholder="e.g. 100"
              className="w-1/2 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <select
              value={packUnit}
              onChange={(e) => setPackUnit(e.target.value)}
              className="w-1/3 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Unit</option>
              <option value="ml">ml</option>
              <option value="litre">litre</option>
              <option value="gram">gram</option>
              <option value="kg">kg</option>
            </select>
            <button
              type="button"
              className="w-1/6 rounded-lg bg-emerald-600 px-2 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              onClick={() => {
                const trimmed = packInput.trim();
                if (!trimmed || !packUnit) return;
                setPackSizes((prev) =>
                  prev.includes(trimmed) ? prev : [...prev, trimmed]
                );
                setPackInput("");
              }}
            >
              +
            </button>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Select a unit and add multiple sizes like 100, 200, 500 (e.g. 100 ml, 200 ml, 500 ml).
          </p>

          {packSizes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {packSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    setPackSizes((prev) => prev.filter((v) => v !== size))
                  }
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  {size} {packUnit || ""}
                  <span className="text-emerald-500">×</span>
                </button>
              ))}
            </div>
          )}

          {/* Hidden inputs so server receives all pack sizes as value/unit pairs */}
          {packSizes.map((size) => (
            <div key={`hidden-${size}`} className="hidden">
              <input type="hidden" name="quantityValue" value={size} />
              <input type="hidden" name="quantityUnit" value={packUnit} />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Homepage sections */}
        <div>
          <p className="block text-sm font-medium text-zinc-700">
            Show this product in homepage sections
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Select where this product should appear on the storefront home page.
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3 text-xs text-zinc-700">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="isTodayOffer"
                className="h-3 w-3 rounded border-zinc-300"
              />
              <span>Today&apos;s Offers</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="isNewArrival"
                className="h-3 w-3 rounded border-zinc-300"
              />
              <span>New Arrivals</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="isTrending"
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
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            Products added by Farmers/Retailers go to admin for approval before becoming visible.
          </p>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Submit Product
          </button>
        </div>
      </form>
    </div>
  );
}
