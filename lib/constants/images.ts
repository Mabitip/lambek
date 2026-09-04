/** Local site imagery — Ethiopian coffee origin photography. */
export const SITE_IMAGES = {
  hero: "/images/ethiopian-highlands-origin.jpg",
  origin: "/images/ethiopian-highlands-origin.jpg",
  processing: "/images/coffee-cherries-ripe.jpg",
  quality: "/images/green-coffee-beans.jpg",
  farm: "/images/coffee-farmers-harvest.jpg",
  drying: "/images/coffee-drying-beds.jpg",
  harvest: "/images/coffee-farmers-harvest.jpg",
  export: "/images/coffee-sorting-export.jpg",
  washedStation: "/images/washed-coffee-station.jpg",
  washedBeans: "/images/washed-coffee-beans.jpg",
  greenBeans: "/images/green-coffee-beans.jpg",
  cherriesRipe: "/images/coffee-cherries-ripe.jpg",
  blogJourney: "/images/blog-coffee-journey.jpg",
  blogTradition: "/images/blog-ethiopian-tradition.jpg",
  placeholder: "/images/green-coffee-beans.jpg",
  logo: "/logos/logo-horizontal-darkgreen.png",
  logoDarkGreen: "/logos/logo-horizontal-darkgreen.png",
  logoWhite: "/logos/logo-horizontal-white.png",
  logoGold: "/logos/logo-horizontal-gold.png",
  logoBlack: "/logos/logo-horizontal-black.png",
  logoVerticalDarkGreen: "/logos/logo-vertical-darkgreen.png",
  logoVerticalWhite: "/logos/logo-vertical-white.png",
  logoVerticalGold: "/logos/logo-vertical-gold.png",
  logoCenteredDarkGreen: "/logos/logo-centered-darkgreen.png",
  logoCenteredWhite: "/logos/logo-centered-white.png",
  logoNameGold: "/logos/logo-name-gold.png",
  logoNameWhite: "/logos/logo-name-white.png",
  logoNameDarkGreen: "/logos/logo-name-darkgreen.png",
  emblem: "/logos/emblem-darkgreen.png",
  emblemDarkGreen: "/logos/emblem-darkgreen.png",
  emblemGold: "/logos/emblem-gold.png",
  emblemWhite: "/logos/emblem-white.png",
} as const;

export type SiteImageKey = keyof typeof SITE_IMAGES;

/** Homepage hero carousel slides showcasing unroasted green coffee, washed processing, cherries & terroir */
export const HERO_SLIDES = [
  {
    type: "video" as const,
    videoSrc: "/videos/hero-lambek.mp4",
    src: SITE_IMAGES.hero,
    poster: SITE_IMAGES.hero,
    alt: "Lambek Coffee origin video - Ethiopian highland coffee production",
    tag: "Where Traditions Meet Aroma",
    title: "The Ethiopian Origin",
  },
  {
    type: "image" as const,
    src: SITE_IMAGES.quality,
    alt: "Specialty Grade 1 Ethiopian green coffee beans",
    tag: "Specialty Green Beans · Grade 1 & 2",
    title: "Pristine Green Coffee",
  },
  {
    type: "image" as const,
    src: SITE_IMAGES.washedStation,
    alt: "Washed coffee processing station in Ethiopian highlands",
    tag: "Wet Processing · Mountain Spring Water",
    title: "Artisanal Washed Stations",
  },
  {
    type: "image" as const,
    src: SITE_IMAGES.cherriesRipe,
    alt: "Ripe red coffee cherries on shade-grown tree branches",
    tag: "Peak Cherry Ripeness · 2,200 MASL",
    title: "Shade-Grown Arabica Cherries",
  },
  {
    type: "image" as const,
    src: SITE_IMAGES.drying,
    alt: "Elevated African raised coffee drying beds in Yirgacheffe",
    tag: "Raised-Bed Sun Drying · 21 Days",
    title: "Sun-Cured On African Beds",
  },
  {
    type: "image" as const,
    src: SITE_IMAGES.harvest,
    alt: "Ethiopian farmers selective hand harvesting coffee cherries",
    tag: "Smallholder Farmers · Agroforestry Heritage",
    title: "Tradition & Hand-Harvesting",
  },
  {
    type: "image" as const,
    src: SITE_IMAGES.export,
    alt: "Hand sorting and export preparation of green coffee beans",
    tag: "Optical & Manual Grading · Export Ready",
    title: "Export Quality Inspection",
  },
] as const;

/** Gallery page curated images with comprehensive origin categories */
export const GALLERY_IMAGES = [
  {
    src: SITE_IMAGES.quality,
    alt: "Raw, unroasted Ethiopian specialty green coffee beans in cupping preparation",
    category: "Green Coffee Beans",
    description: "Jade-green, high-density Grade 1 Arabica beans prepared for specialty roasters worldwide.",
  },
  {
    src: SITE_IMAGES.washedStation,
    alt: "Washed coffee fermentation channels and washing station in Gedeo",
    category: "Washing & Wet Mill",
    description: "Natural mountain spring water channels separating dense beans during washed processing.",
  },
  {
    src: SITE_IMAGES.washedBeans,
    alt: "Freshly washed wet parchment coffee beans in processing channels",
    category: "Washed Coffee",
    description: "Pristine washed coffee beans glistening after clean-water pulp removal and fermentation.",
  },
  {
    src: SITE_IMAGES.cherriesRipe,
    alt: "Vibrant crimson and red coffee cherries ripening on heirloom Arabica tree",
    category: "Coffee Cherries",
    description: "Selective hand-picking ensures only fully ripe cherries at peak brix sugar content are harvested.",
  },
  {
    src: SITE_IMAGES.harvest,
    alt: "Ethiopian coffee farming families hand-harvesting ripe cherries in shade forest",
    category: "Farms & Farmers",
    description: "Generational smallholder farmers practicing sustainable agroforestry under indigenous tree canopies.",
  },
  {
    src: SITE_IMAGES.drying,
    alt: "African raised drying beds filled with drying parchment across green hills",
    category: "Drying Beds",
    description: "Carefully aerated elevated drying beds turned hourly to achieve optimal 10–11.5% moisture content.",
  },
  {
    src: SITE_IMAGES.export,
    alt: "Skilled Ethiopian coffee technicians hand-sorting green beans on inspection tables",
    category: "Sorting & Export",
    description: "Meticulous optical and manual sorting to remove physical defects before bagging in GrainPro liners.",
  },
  {
    src: SITE_IMAGES.origin,
    alt: "Misty terraced coffee hills in the high-elevation Yirgacheffe Gedeo zone",
    category: "Highlands & Terroir",
    description: "2,000–2,200 MASL elevation with nutrient-rich volcanic soil producing signature floral aromatics.",
  },
  {
    src: SITE_IMAGES.blogJourney,
    alt: "Visual transformation of Ethiopian coffee from ripe red cherry to sorted green bean",
    category: "Coffee Journey",
    description: "The complete journey of specialty coffee: cherry, wet parchment, dried parchment, and green bean.",
  },
] as const;

/** Tiny blur placeholder for next/image (warm neutral tone). */
export const IMAGE_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";
