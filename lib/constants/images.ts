/** Local site imagery — Ethiopian coffee origin photography (Unsplash, free license). */
export const SITE_IMAGES = {
  hero: "/images/hero-highlands.jpg",
  origin: "/images/origin-gedeo.jpg",
  processing: "/images/processing-cherries.jpg",
  quality: "/images/green-coffee-beans.jpg",
  farm: "/images/coffee-farm.jpg",
  drying: "/images/drying-beds.jpg",
  harvest: "/images/harvest-hands.jpg",
  export: "/images/export-beans.jpg",
  placeholder: "/images/green-coffee-beans.jpg",
} as const;

export type SiteImageKey = keyof typeof SITE_IMAGES;

/** Homepage hero carousel slides */
export const HERO_SLIDES = [
  { src: SITE_IMAGES.hero, alt: "Ethiopian coffee highlands" },
  { src: SITE_IMAGES.origin, alt: "Gedeo highland landscape" },
  { src: SITE_IMAGES.farm, alt: "Coffee farm in the Gedeo zone" },
  { src: SITE_IMAGES.processing, alt: "Ripe coffee cherries on branch" },
  { src: SITE_IMAGES.drying, alt: "Coffee drying on raised beds" },
] as const;

/** Gallery page images with categories */
export const GALLERY_IMAGES = [
  { src: SITE_IMAGES.hero, alt: "Ethiopian coffee highlands", category: "Highlands" },
  { src: SITE_IMAGES.origin, alt: "Gedeo highland landscape", category: "Origin" },
  { src: SITE_IMAGES.farm, alt: "Coffee farm in the Gedeo zone", category: "Farm" },
  { src: SITE_IMAGES.processing, alt: "Ripe coffee cherries on branch", category: "Processing" },
  { src: SITE_IMAGES.drying, alt: "Coffee drying on raised beds", category: "Drying" },
  { src: SITE_IMAGES.harvest, alt: "Hand harvesting coffee cherries", category: "Harvest" },
  { src: SITE_IMAGES.quality, alt: "Green coffee beans macro", category: "Quality" },
  { src: SITE_IMAGES.export, alt: "Sorted green coffee for export", category: "Export" },
] as const;

/** Tiny blur placeholder for next/image (warm neutral tone). */
export const IMAGE_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";
