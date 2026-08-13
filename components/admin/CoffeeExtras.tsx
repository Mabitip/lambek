"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";

interface Lot {
  id: string;
  lotId: string;
  harvest?: string | null;
  cupProfile?: string | null;
  published: boolean;
}

interface Availability {
  id: string;
  status: string;
  notes?: string | null;
}

interface CoffeeExtrasProps {
  coffeeId: string;
  lots: Lot[];
  availability: Availability[];
  onAddLot: (data: { lotId: string; harvest?: string; cupProfile?: string }) => Promise<void>;
  onUpdateAvailability: (status: string, notes?: string) => Promise<void>;
}

export function CoffeeExtras({ coffeeId, lots, availability, onAddLot, onUpdateAvailability }: CoffeeExtrasProps) {
  const [lotId, setLotId] = useState("");
  const [harvest, setHarvest] = useState("");
  const [status, setStatus] = useState(availability[0]?.status ?? "AVAILABLE");
  const [notes, setNotes] = useState(availability[0]?.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function handleAddLot(e: React.FormEvent) {
    e.preventDefault();
    if (!lotId.trim()) return;
    setSaving(true);
    await onAddLot({ lotId, harvest, cupProfile: undefined });
    setLotId("");
    setHarvest("");
    setSaving(false);
  }

  async function handleAvailability(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onUpdateAvailability(status, notes);
    setSaving(false);
  }

  return (
    <div className="mt-12 grid gap-8 border-t border-border pt-8 lg:grid-cols-2">
      <section>
        <h2 className="font-serif text-xl text-primary">Coffee Lots</h2>
        <p className="mt-1 text-sm text-foreground/60">Manage traceability lot IDs for this coffee.</p>

        {lots.length > 0 && (
          <ul className="mt-4 space-y-2">
            {lots.map((lot) => (
              <li key={lot.id} className="flex items-center justify-between border border-border bg-muted/30 p-3 text-sm">
                <span className="font-medium">{lot.lotId}</span>
                {lot.harvest && <span className="text-foreground/50">{lot.harvest}</span>}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddLot} className="mt-4 space-y-3">
          <div>
            <Label>Lot ID</Label>
            <Input value={lotId} onChange={(e) => setLotId(e.target.value)} placeholder="e.g. KC-2024-001" className="mt-1" />
          </div>
          <div>
            <Label>Harvest</Label>
            <Input value={harvest} onChange={(e) => setHarvest(e.target.value)} className="mt-1" />
          </div>
          <Button type="submit" size="sm" disabled={saving}>Add Lot</Button>
        </form>
      </section>

      <section>
        <h2 className="font-serif text-xl text-primary">Availability</h2>
        <p className="mt-1 text-sm text-foreground/60">Current availability status for this coffee.</p>

        {availability[0] && (
          <div className="mt-4">
            <StatusBadge status={availability[0].status} />
          </div>
        )}

        <form onSubmit={handleAvailability} className="mt-4 space-y-3">
          <div>
            <Label>Status</Label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1">
              <option value="AVAILABLE">Available</option>
              <option value="LIMITED">Limited</option>
              <option value="PREORDER">Pre-order</option>
              <option value="SOLD_OUT">Sold Out</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </Select>
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" />
          </div>
          <Button type="submit" size="sm" disabled={saving}>Update Availability</Button>
        </form>
      </section>
    </div>
  );
}
