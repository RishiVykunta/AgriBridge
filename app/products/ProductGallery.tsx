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
  onWishlist?: () => Promise<void>;
  productUrl: string;
};

export function ProductGallery({ name, media, onWishlist, productUrl }: ProductGalleryProps) {
  const images = media.filter((m) => m.type === "IMAGE");
  const [activeId, setActiveId] = useState(images[0]?.id ?? null);

  const activeImage =
    images.find((m) => m.id === activeId) ?? images[0] ?? null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out ${name} on AgriBridge`,
          url: productUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(productUrl);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Error copying link:", err);
      }
    }
  };

  const handleWishlist = async () => {
    if (onWishlist) {
      await onWishlist();
      alert("Added to wishlist!");
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Main image container */}
      <div className="relative aspect-[1/1] w-full overflow-hidden rounded-[40px] bg-white shadow-2xl shadow-zinc-200 transition-all duration-700 hover:shadow-emerald-100 ring-1 ring-zinc-100">
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeImage.url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-1000 hover:scale-110 cursor-zoom-in"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-8xl text-zinc-100">
            📦
          </div>
        )}
        
        {/* Floating Actions */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
           <button 
             onClick={handleWishlist}
             className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg text-zinc-400 hover:text-rose-500 transition-colors group"
             title="Add to Wishlist"
           >
              <svg className="w-5 h-5 group-hover:fill-rose-500 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
           </button>
           <button 
             onClick={handleShare}
             className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg text-zinc-400 hover:text-emerald-500 transition-colors"
             title="Share Product"
           >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
           </button>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-4 px-2">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveId(img.id)}
              className={`relative h-20 w-20 overflow-hidden rounded-2xl border-2 transition-all duration-300 group ${
                img.id === activeImage?.id
                  ? "border-emerald-500 shadow-md scale-110"
                  : "border-zinc-100 hover:border-emerald-300 bg-white"
              }`}
            >
              <div className={`absolute inset-0 bg-emerald-500/10 transition-opacity ${img.id === activeImage?.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={name}
                className="h-full w-full object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

