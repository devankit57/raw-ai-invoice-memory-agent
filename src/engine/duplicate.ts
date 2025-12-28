import { db } from "../storage/sqlite.js";


export function isDuplicateInvoice(
  vendor: string,
  invoiceNumber: string
): boolean {
  const row = db
    .prepare(
      "SELECT 1 FROM processed_invoices WHERE vendor=? AND invoice_number=?"
    )
    .get(vendor, invoiceNumber);

  return !!row;
}


export function markInvoiceProcessed(
  vendor: string,
  invoiceNumber: string
) {
  db.prepare(
    `INSERT OR IGNORE INTO processed_invoices
     (vendor, invoice_number, created_at)
     VALUES (?, ?, ?)`
  ).run(vendor, invoiceNumber, new Date().toISOString());
}
