export const DEFAULT_CONTACT = {
  emails: ["info@Lambekcoffee.com", "Kongacoffee153@gmail.com"],
  phones: ["+251911210468", "+251911112156", "+251982980000"],
  address: "Ejigayhu Dibaba bldg, 5th Floor",
  mapsUrl: "https://maps.app.goo.gl/qEWCGMyrrPZ6tNVe8",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.4746300098573!2d38.853731700000004!3d9.0203937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b9b12490d4923%3A0x5e34c8fef09a7377!2zRWppZ2F5ZWh1IERpYmFiYSBCdWlsZGluZyB8IOGKpeGMheGMi-GLqOGIgSDhi7LhiaPhiaMg4YiF4YqV4Y2D!5e0!3m2!1sen!2set!4v1786630119930!5m2!1sen!2set",
  workingHours: "Monday–Friday: 8:30 – 17:30",
  primaryEmail: "info@Lambekcoffee.com",
} as const;

export interface ContactInfo {
  emails: string[];
  phones: string[];
  address: string;
  mapsUrl: string;
  workingHours: string;
  primaryEmail: string;
  primaryPhone: string;
}

function parseList(value: string | undefined, fallback: readonly string[]): string[] {
  if (!value?.trim()) return [...fallback];
  const items = value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : [...fallback];
}

export function resolveContactInfo(settings: Record<string, string> = {}): ContactInfo {
  const emails = settings.emails
    ? parseList(settings.emails, DEFAULT_CONTACT.emails)
    : settings.email
      ? [settings.email]
      : [...DEFAULT_CONTACT.emails];

  const phones = settings.phones
    ? parseList(settings.phones, DEFAULT_CONTACT.phones)
    : settings.phone
      ? [settings.phone]
      : [...DEFAULT_CONTACT.phones];

  return {
    emails,
    phones,
    address: settings.address ?? DEFAULT_CONTACT.address,
    mapsUrl: settings.maps_url ?? DEFAULT_CONTACT.mapsUrl,
    workingHours: settings.working_hours ?? DEFAULT_CONTACT.workingHours,
    primaryEmail: emails[0] ?? DEFAULT_CONTACT.primaryEmail,
    primaryPhone: phones[0] ?? DEFAULT_CONTACT.phones[0],
  };
}
