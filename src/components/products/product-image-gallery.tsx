/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  selectedIndex: number;
  onPrev: (e?: React.MouseEvent) => void;
  onNext: (e?: React.MouseEvent) => void;
  title: string;
}

const LightboxModal = ({
  isOpen,
  onClose,
  images,
  selectedIndex,
  onPrev,
  onNext,
  title,
}: LightboxModalProps) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-99999 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition-colors"
      >
        <X className="h-8 w-8" />
        <span className="sr-only">Close</span>
      </button>

      <div
        className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full">
          <Image
            src={images[selectedIndex]}
            alt={`${title} - zoom ${selectedIndex + 1}`}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-2 sm:-left-16 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/20 text-white rounded-full transition-all"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-2 sm:-right-16 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/20 text-white rounded-full transition-all"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/90 font-medium bg-black/40 px-4 py-1 rounded-full text-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>
    </div>,
    document.body
  );
};

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export default function ProductImageGallery({
  images,
  title,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [emblaMainApi, setEmblaMainApi] = React.useState<CarouselApi>();
  const [emblaThumbsApi, setEmblaThumbsApi] = React.useState<CarouselApi>();

  const handleSelect = React.useCallback(
    (index: number) => {
      setSelectedIndex(index);
      emblaMainApi?.scrollTo(index);
      emblaThumbsApi?.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const handlePrevious = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    },
    [images.length]
  );

  const handleNext = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    },
    [images.length]
  );

  React.useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") handlePrevious();
      if (event.key === "ArrowRight") handleNext();
      if (event.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, handlePrevious, handleNext]);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted group cursor-zoom-in"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={images[selectedIndex]}
          alt={`${title} - image ${selectedIndex + 1}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-10 w-10 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-full shadow-sm">
            <ZoomIn className="h-5 w-5 text-foreground" />
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <Carousel
          setApi={setEmblaThumbsApi}
          opts={{ align: "start", loop: true, dragFree: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {images.map((image, index) => (
              <CarouselItem
                key={index}
                className="pl-2 basis-1/4 sm:basis-1/5 md:basis-1/6"
              >
                <div
                  className={cn(
                    "relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300",
                    selectedIndex === index
                      ? "border-primary ring-2 ring-primary/30 opacity-100 scale-95"
                      : "border-transparent opacity-70 hover:opacity-100 hover:border-primary/50"
                  )}
                  onClick={() => handleSelect(index)}
                >
                  <Image
                    src={image}
                    alt={`${title} - thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 4 && (
            <CarouselPrevious className="left-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
          {images.length > 4 && (
            <CarouselNext className="right-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </Carousel>
      )}

      <LightboxModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        selectedIndex={selectedIndex}
        onPrev={handlePrevious}
        onNext={handleNext}
        title={title}
      />
    </div>
  );
}
