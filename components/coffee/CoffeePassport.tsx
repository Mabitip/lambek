import type { CoffeeWithRelations } from "@/lib/repositories/coffee.repository";
import { Badge } from "@/components/ui/badge";

interface CoffeePassportProps {
  coffee: CoffeeWithRelations;
  lotId?: string;
}

export function CoffeePassport({ coffee, lotId }: CoffeePassportProps) {
  const availability = coffee.availability[0]?.status ?? "Contact for availability";

  const fields = [
    { label: "Lot", value: lotId },
    { label: "Origin", value: coffee.origin?.name ?? coffee.region },
    { label: "Region", value: coffee.region },
    { label: "Micro Region", value: coffee.microRegion },
    { label: "Country", value: coffee.country },
    { label: "Process", value: coffee.process?.name },
    { label: "Variety", value: coffee.variety?.name },
    {
      label: "Altitude",
      value:
        coffee.altitudeMin || coffee.altitudeMax
          ? `${coffee.altitudeMin ?? "?"}–${coffee.altitudeMax ?? "?"} masl`
          : null,
    },
    { label: "Harvest", value: coffee.harvestPeriod },
    { label: "Cup Score", value: coffee.cupScore?.toString() },
    { label: "Availability", value: String(availability).replace(/_/g, " ") },
  ].filter((f) => f.value);

  return (
    <div className="sticky top-24 border-2 border-primary/20 bg-card p-8">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <h3 className="font-serif text-2xl uppercase tracking-wider text-primary">
          Coffee Passport
        </h3>
        <Badge variant="gold">QR Ready</Badge>
      </div>
      <dl className="space-y-4">
        {fields.map((field) => (
          <div key={field.label} className="grid grid-cols-[120px_1fr] gap-4 border-b border-border/50 pb-3">
            <dt className="text-xs uppercase tracking-wider text-foreground/50">{field.label}</dt>
            <dd className="text-sm font-medium text-foreground">{field.value}</dd>
          </div>
        ))}
      </dl>
      {coffee.tastingNotes.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs uppercase tracking-wider text-foreground/50">Tasting Notes</p>
          <div className="flex flex-wrap gap-2">
            {coffee.tastingNotes.map((note) => (
              <Badge key={note} variant="outline">
                {note}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
