import { NormalisedSailing } from "../operators/types";

export interface FilterState {
  operators: string[]; // empty = all
  maxPriceEur: number | null;
  minDepartureHour: number; // 0-23
  maxDepartureHour: number; // 0-23
  maxDurationMinutes: number | null;
}

export function defaultFilters(): FilterState {
  return {
    operators: [],
    maxPriceEur: null,
    minDepartureHour: 0,
    maxDepartureHour: 23,
    maxDurationMinutes: null,
  };
}

export function applyFilters(
  sailings: NormalisedSailing[],
  filters: FilterState
): NormalisedSailing[] {
  return sailings.filter((s) => {
    if (filters.operators.length > 0 && !filters.operators.includes(s.operatorId)) {
      return false;
    }
    if (filters.maxPriceEur !== null && s.totalPriceEur > filters.maxPriceEur) {
      return false;
    }
    if (filters.maxDurationMinutes !== null && s.durationMinutes > filters.maxDurationMinutes) {
      return false;
    }
    const hour = new Date(s.departureAt).getUTCHours();
    if (hour < filters.minDepartureHour || hour > filters.maxDepartureHour) {
      return false;
    }
    return true;
  });
}
