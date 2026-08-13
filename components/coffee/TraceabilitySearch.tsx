"use client";

import { useState } from "react";
import { CoffeePassport } from "@/components/coffee/CoffeePassport";
import type { CoffeeWithRelations } from "@/lib/repositories/coffee.repository";

interface LotResult {
  id: string;
  lotId: string;
  harvest?: string | null;
  cupProfile?: string | null;
  coffee: CoffeeWithRelations;
}

export function TraceabilitySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LotResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await fetch(`/api/traceability?query=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message);
      setResults(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mx-auto max-w-xl">
        <label className="mb-2 block text-center text-xs uppercase tracking-[0.3em] text-foreground/60">
          Enter Coffee Lot ID
        </label>
        <div className="flex gap-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Lot ID, coffee name, origin..."
            className="h-14 flex-1 border border-border bg-card px-4 text-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-14 bg-primary px-8 text-sm uppercase tracking-widest text-white transition hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "..." : "Search Lot"}
          </button>
        </div>
      </form>

      {error && <p className="mt-4 text-center text-red-600">{error}</p>}

      {searched && results.length === 0 && !loading && !error && (
        <p className="mt-12 text-center text-foreground/60">No lots found matching your search.</p>
      )}

      <div className="mt-12 space-y-8">
        {results.map((lot) => (
          <div key={lot.id} className="mx-auto max-w-lg">
            <CoffeePassport coffee={lot.coffee} lotId={lot.lotId} />
          </div>
        ))}
      </div>
    </div>
  );
}
