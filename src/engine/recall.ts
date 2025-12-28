import { recallVendorMemory } from "../memory/vendorMemory.js";
import { Invoice } from "../types.js";

export function recall(invoice: Invoice, audit: any[]) {
  const vendorMem = recallVendorMemory(invoice.vendor);
  audit.push({
    step: "recall",
    timestamp: new Date().toISOString(),
    details: `Found ${vendorMem.length} vendor memories`
  });
  return vendorMem;
}
