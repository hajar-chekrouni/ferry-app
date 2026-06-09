import { NormalisedSailing, SearchQuery } from "../operators/types";
import { getAllAdapters } from "../operators/registry";

export type SortKey = "price" | "departure" | "duration" | "arrival";

export interface SearchResult {
  sailings: NormalisedSailing[];
  totalCount: number;
  minPriceEur: number;
  maxPriceEur: number;
  operators: { id: string; name: string }[];
}

const cache = new Map<string, { result: NormalisedSailing[]; expiresAt: number }>();
const CACHE_TTL_MS = 60_000; // 1 minute

function cacheKey(query: SearchQuery): string {
  return JSON.stringify(query);
}

/**
 * Query all adapters in parallel, normalise and merge results.
 * Errors in individual adapters are swallowed — they return [].
 */
export async function aggregateSearch(
  query: SearchQuery,
  sort: SortKey = "departure"
): Promise<SearchResult> {
  const key = cacheKey(query);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return buildResult(cached.result, sort);
  }

  const adapters = getAllAdapters();
  const settled = await Promise.allSettled(
    adapters.map((a) => a.searchSailings(query))
  );

  const sailings: NormalisedSailing[] = settled.flatMap((r) =>
    r.status === "fulfilled" ? r.value : []
  );

  cache.set(key, { result: sailings, expiresAt: Date.now() + CACHE_TTL_MS });

  return buildResult(sailings, sort);
}

function buildResult(sailings: NormalisedSailing[], sort: SortKey): SearchResult {
  const sorted = [...sailings].sort((a, b) => {
    switch (sort) {
      case "price":
        return a.totalPriceEur - b.totalPriceEur;
      case "departure":
        return a.departureAt.localeCompare(b.departureAt);
      case "arrival":
        return a.arrivalAt.localeCompare(b.arrivalAt);
      case "duration":
        return a.durationMinutes - b.durationMinutes;
    }
  });

  const prices = sailings.map((s) => s.totalPriceEur);

  const operatorSet = new Map<string, string>();
  for (const s of sailings) {
    operatorSet.set(s.operatorId, s.operatorName);
  }

  return {
    sailings: sorted,
    totalCount: sorted.length,
    minPriceEur: prices.length ? Math.min(...prices) : 0,
    maxPriceEur: prices.length ? Math.max(...prices) : 0,
    operators: Array.from(operatorSet.entries()).map(([id, name]) => ({
      id,
      name,
    })),
  };
}
