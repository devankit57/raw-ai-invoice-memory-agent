import { Invoice } from "../types.js";

export function applyMemory(
  invoice: Invoice,
  vendorMemory: any[],
  audit: any[]
) {
  const normalized = { ...invoice.fields };
  const proposals: string[] = [];
  let confidence = 0;

  for (const mem of vendorMemory) {
    if (invoice.fields[mem.raw_label]) {
      if (mem.confidence >= 0.6) {
        normalized[mem.normalized_field] = invoice.fields[mem.raw_label];
        delete normalized[mem.raw_label];

        proposals.push(
          `Mapped ${mem.raw_label} → ${mem.normalized_field} (confidence ${mem.confidence.toFixed(
            2
          )})`
        );
        confidence = Math.max(confidence, mem.confidence);
      }
    }
  }

  audit.push({
    step: "apply",
    timestamp: new Date().toISOString(),
    details: proposals.join("; ") || "No memory applied"
  });

  return { normalized, proposals, confidence };
}
