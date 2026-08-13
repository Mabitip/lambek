export const BRAND = {
  name: "Lambek Coffee",
  legalName: "Lambek Coffee Ltd",
  wordmark: "LAMBEK",
  tagline: "Ethiopian Origin. Distinctive Coffee. Global Connection.",
  colors: {
    olive: "#3F4B1F",
    gold: "#C9A961",
    ivory: "#F7F5EE",
    charcoal: "#24271A",
    beige: "#D9CDAF",
    white: "#FFFFFF",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/coffee", label: "Coffee" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const FOOTER_NAV_LINKS = NAV_LINKS;

export const MOBILE_BOTTOM_NAV = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/coffee", label: "Coffee", icon: "coffee" as const },
  { href: "/contact", label: "Contact", icon: "mail" as const },
] as const;

export const MOBILE_MORE_LINKS = [
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
] as const;

export const INQUIRY_TYPES = [
  { value: "GREEN_COFFEE", label: "Green Coffee" },
  { value: "SAMPLE", label: "Sample" },
  { value: "WHOLESALE", label: "Wholesale" },
  { value: "EXPORT", label: "Export" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "OTHER", label: "Other" },
] as const;

export const SAMPLE_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "APPROVED", label: "Approved" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
] as const;

export const PERMISSIONS = [
  "MANAGE_USERS",
  "MANAGE_COFFEE",
  "MANAGE_ORIGIN",
  "MANAGE_JOURNAL",
  "MANAGE_INQUIRIES",
  "MANAGE_SAMPLES",
  "MANAGE_MEDIA",
  "MANAGE_SETTINGS",
] as const;

export type PermissionName = (typeof PERMISSIONS)[number];
