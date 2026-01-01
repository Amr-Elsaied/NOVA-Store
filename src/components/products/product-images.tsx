"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImagesProps {
  cover: string;
  images: string[];
  title: string;
}

export default function ProductImages({
  cover,
  images,
  title,
}: ProductImagesProps) {
  const [mainImage, setMainImage] = useState(cover);

  const allImages = Array.from(new Set([cover, ...images]));

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 border">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-contain p-4"
          priority
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {allImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(img)}
            className={cn(
              "relative w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all",
              mainImage === img
                ? "border-black dark:border-white"
                : "border-transparent"
            )}
          >
            <Image
              src={img}
              alt={`${title} - view ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
