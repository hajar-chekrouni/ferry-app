import { NextRequest } from "next/server";
import { SearchQuerySchema } from "@/lib/operators/types";
import { aggregateSearch, SortKey } from "@/lib/search/aggregator";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const raw = {
    departurePortCode: sp.get("from") ?? "",
    arrivalPortCode: sp.get("to") ?? "",
    departureDate: sp.get("date") ?? "",
    returnDate: sp.get("returnDate") ?? undefined,
    passengers: {
      adults: Number(sp.get("adults") ?? 1),
      children: Number(sp.get("children") ?? 0),
      infants: Number(sp.get("infants") ?? 0),
    },
    vehicle: sp.get("vehicleCategory")
      ? {
          category: sp.get("vehicleCategory"),
          lengthCm: sp.get("vehicleLengthCm")
            ? Number(sp.get("vehicleLengthCm"))
            : undefined,
          heightCm: sp.get("vehicleHeightCm")
            ? Number(sp.get("vehicleHeightCm"))
            : undefined,
        }
      : undefined,
  };

  const parsed = SearchQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid search parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const validSorts: SortKey[] = ["price", "departure", "duration", "arrival"];
  const sortParam = sp.get("sort") ?? "departure";
  const sort: SortKey = validSorts.includes(sortParam as SortKey)
    ? (sortParam as SortKey)
    : "departure";

  const result = await aggregateSearch(parsed.data, sort);

  return Response.json(result);
}
