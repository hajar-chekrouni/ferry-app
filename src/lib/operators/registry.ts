import { FerryOperatorAdapter } from "./types";
import { MockOperatorAdapter } from "./mock-adapter";
import { OPERATORS } from "../seed/data";

const registry = new Map<string, FerryOperatorAdapter>();

for (const op of OPERATORS) {
  registry.set(op.id, new MockOperatorAdapter(op.id));
}

export function getAdapter(operatorId: string): FerryOperatorAdapter | undefined {
  return registry.get(operatorId);
}

export function getAllAdapters(): FerryOperatorAdapter[] {
  return Array.from(registry.values());
}

/**
 * Register a custom adapter (used in tests or when adding real operator integrations).
 */
export function registerAdapter(adapter: FerryOperatorAdapter): void {
  registry.set(adapter.operatorId, adapter);
}
