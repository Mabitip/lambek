"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface FilterOption {
  slug: string;
  name: string;
}

interface CoffeeFilterProps {
  origins: FilterOption[];
  processes: FilterOption[];
  varieties: FilterOption[];
}

const availabilityOptions = [
  { slug: "AVAILABLE", name: "Available" },
  { slug: "LIMITED", name: "Limited" },
  { slug: "PREORDER", name: "Pre-order" },
];

export function CoffeeFilter({ origins, processes, varieties }: CoffeeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`/coffee?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="mb-10 grid gap-4 border border-border bg-card p-6 md:grid-cols-2 lg:grid-cols-5">
      <FilterSelect
        label="Origin"
        value={searchParams.get("origin") ?? ""}
        options={origins}
        onChange={(v) => updateFilter("origin", v)}
      />
      <FilterSelect
        label="Process"
        value={searchParams.get("process") ?? ""}
        options={processes}
        onChange={(v) => updateFilter("process", v)}
      />
      <FilterSelect
        label="Variety"
        value={searchParams.get("variety") ?? ""}
        options={varieties}
        onChange={(v) => updateFilter("variety", v)}
      />
      <FilterSelect
        label="Availability"
        value={searchParams.get("availability") ?? ""}
        options={availabilityOptions}
        onChange={(v) => updateFilter("availability", v)}
      />
      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-foreground/60">
          Search
        </label>
        <input
          type="search"
          defaultValue={searchParams.get("search") ?? ""}
          placeholder="Name, notes..."
          className="h-11 w-full border border-border px-3 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateFilter("search", (e.target as HTMLInputElement).value);
            }
          }}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-wider text-foreground/60">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full border border-border bg-card px-3 text-sm"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.slug} value={opt.slug}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
