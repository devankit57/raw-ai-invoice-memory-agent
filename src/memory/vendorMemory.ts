import { db } from "../storage/sqlite.js";

/**
 * Explicit row shape for vendor_memory table
 * This fixes strict-mode TypeScript errors
 */
interface VendorMemoryRow {
  vendor: string;
  raw_label: string;
  normalized_field: string;
  confidence: number;
  seen_count: number;
  last_used: string;
}

/**
 * Recall all vendor-specific memories
 */
export function recallVendorMemory(vendor: string): VendorMemoryRow[] {
  return db
    .prepare("SELECT * FROM vendor_memory WHERE vendor = ?")
    .all(vendor) as VendorMemoryRow[];
}

/**
 * Reinforce or create vendor memory entry
 */
export function reinforceVendorMemory(
  vendor: string,
  rawLabel: string,
  normalized: string,
  approved: boolean
): number {
  const existing = db
    .prepare(
      "SELECT * FROM vendor_memory WHERE vendor=? AND raw_label=?"
    )
    .get(vendor, rawLabel) as VendorMemoryRow | undefined;

  let confidence = existing?.confidence ?? 0.6;

  // Reinforcement / decay
  confidence += approved ? 0.05 : -0.1;
  confidence = Math.min(1, Math.max(0, confidence));

  if (existing) {
    db.prepare(
      `UPDATE vendor_memory
       SET confidence = ?, seen_count = seen_count + 1, last_used = ?
       WHERE vendor = ? AND raw_label = ?`
    ).run(confidence, new Date().toISOString(), vendor, rawLabel);
  } else {
    db.prepare(
      `INSERT INTO vendor_memory
       (vendor, raw_label, normalized_field, confidence, seen_count, last_used)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      vendor,
      rawLabel,
      normalized,
      confidence,
      1,
      new Date().toISOString()
    );
  }

  return confidence;
}
