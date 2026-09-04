import {
  coffeeRepository,
  originRepository,
  processRepository,
  varietyRepository,
  lotRepository,
  settingsRepository,
} from "@/lib/repositories/coffee.repository";
import type { CoffeeFilters } from "@/lib/repositories/coffee.repository";
import { coffeeFilterSchema } from "@/lib/validations/schemas";
import { resolveContactInfo } from "@/lib/constants/contact";

export const coffeeService = {
  async getPublished(filters: Partial<CoffeeFilters>) {
    const parsed = coffeeFilterSchema.parse(filters);
    return coffeeRepository.findMany(parsed);
  },

  async getFeatured(limit = 6) {
    return coffeeRepository.findFeatured(limit);
  },

  async getBySlug(slug: string) {
    const coffee = await coffeeRepository.findBySlug(slug);
    if (!coffee?.published) return null;
    return coffee;
  },

  async getBySlugAdmin(slug: string) {
    return coffeeRepository.findBySlug(slug);
  },

  async getById(id: string) {
    return coffeeRepository.findById(id);
  },

  async getAdminList(page = 1, search?: string) {
    return coffeeRepository.findAllAdmin(page, 20, search);
  },

  async getFilterOptions() {
    const [origins, processes, varieties] = await Promise.all([
      originRepository.findAll(),
      processRepository.findAll(),
      varietyRepository.findAll(),
    ]);
    return { origins, processes, varieties };
  },

  async searchTraceability(query: string) {
    const lot = await lotRepository.findByLotId(query);
    if (lot) return [lot];
    return lotRepository.search(query);
  },
};

export const settingsService = {
  async getAll() {
    try {
      return await settingsRepository.getAll();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[settingsService.getAll] Database unavailable (ECONNREFUSED) — using default brand settings.");
      }
      return {};
    }
  },

  async get(key: string) {
    try {
      return await settingsRepository.get(key);
    } catch {
      return null;
    }
  },

  async getContactInfo() {
    try {
      const settings = await settingsRepository.getAll();
      return resolveContactInfo(settings);
    } catch {
      if (process.env.NODE_ENV === "development") {
        console.warn("[settingsService.getContactInfo] Database unavailable — using default contact info.");
      }
      return resolveContactInfo({});
    }
  },

  async getHeroContent() {
    try {
      const settings = await settingsRepository.getAll();
      const headline =
        settings.hero_headline && settings.hero_headline !== "FROM THE HIGHLANDS\nOF YIRGACHEFFE"
          ? settings.hero_headline
          : "WHERE TRADITIONS\nMEET AROMA";
      return {
        headline,
        subtext:
          settings.hero_subtext ??
          "Exceptional Ethiopian coffee, carefully processed and prepared for the world.",
      };
    } catch {
      return {
        headline: "WHERE TRADITIONS\nMEET AROMA",
        subtext:
          "Exceptional Ethiopian coffee, carefully processed and prepared for the world.",
      };
    }
  },
};
