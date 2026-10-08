"use client";

import { useCallback, useState } from "react";
import { imageSrcSet, sizedImage } from "@/lib/images";
import { photoFit } from "@/lib/photo-fit";
import { cn } from "@/lib/utils";
import { CategoryGlyph } from "./category-glyph";
import type { CategorySlug } from "@/lib/types";
import { PLATE_SIZES } from "./plate-sizes";


export interface PlateImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  category: CategorySlug;
  sizes?: string;
  /** Above-the-fold: eager + high priority, never fades. */
  priority?: boolean;
  /** Eager without high fetch priority (the first row after the LCP image). */
  eager?: boolean;
  /** Fallback glyph size in px (category icon on the tint). */
  glyph?: number;
  className?: string;
}

/**
 * The <img> inside a `.plate`. The plate element itself (tint, radius, aspect) is rendered by
 * the parent so it is server HTML; this island only adds load/error state.
 * Fade-in is CSS: `.reveal-ready .plate:not([data-eager]) > img:not([data-loaded])` is transparent.
 */
export function PlateImage({ src, alt, width, height, category, sizes = PLATE_SIZES.grid, priority, eager, glyph = 40, className }: PlateImageProps) {
  const [failed, setFailed] = useState(false);

  const ref = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    const done = () => img.setAttribute("data-loaded", "");
    if (img.complete && img.naturalWidth > 0) done();
    else if (img.complete) setFailed(true);
    else {
      img.addEventListener("load", done, { once: true });
    }
  }, []);

  if (!src || failed) {
    return (
      <span className="absolute inset-0 grid place-items-center text-(--cat-ink) opacity-40" aria-hidden="true">
        <CategoryGlyph category={category} size={glyph} />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Shopify CDN resizes; no optimiser costs (ENGINEERING "Images")
    <img
      ref={ref}
      src={sizedImage(src, 480)}
      srcSet={imageSrcSet(src)}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      data-fit={photoFit(width, height)}
      loading={priority || eager ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={cn(className)}
    />
  );
}
