import { reinforceVendorMemory } from "../memory/vendorMemory.js";

export function learn(
  vendor: string,
  rawLabel: string,
  normalized: string,
  approved: boolean,
  audit: any[]
) {
  const newConfidence = reinforceVendorMemory(
    vendor,
    rawLabel,
    normalized,
    approved
  );

  audit.push({
    step: "learn",
    timestamp: new Date().toISOString(),
    details: `Vendor memory updated. New confidence: ${newConfidence.toFixed(
      2
    )}`
  });

  return newConfidence;
}
