"use client";

import { useState } from "react";

type Media = {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
};

type ProductGalleryProps = {
  name: string;
  media: Media[];
};

export function ProductGallery({ name, media }: ProductGalleryProps) {
  const images = media.filter((m) => m.type === "IMAGE");
  const [activeId, setActiveId] = useState(images[0]?.id ?? null);

  const activeImage =
    images.find((m) => m.id === activeId) ?? images[0] ?? null;

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="group overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeImage.url}
            alt={name}
            className="h-96 w-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
          />
        ) : (
          <div className="flex h-96 items-center justify-center text-4xl text-zinc-300">
            📦
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveId(img.id)}
              className={`h-20 w-20 overflow-hidden rounded-md border bg-zinc-100 transition ${
                img.id === activeImage?.id
                  ? "border-emerald-500 ring-2 ring-emerald-400"
                  : "border-zinc-200 hover:border-emerald-400"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={name}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

