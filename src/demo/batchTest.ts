import { recall } from "../engine/recall.js";
import { applyMemory } from "../engine/apply.js";
import { decide } from "../engine/decide.js";
import { learn } from "../engine/learn.js";
import {
  isDuplicateInvoice,
  markInvoiceProcessed
} from "../engine/duplicate.js";

// ---- Config ----
const TOTAL_INVOICES = 100;
const VENDOR = "Supplier GmbH";

// ---- Metrics ----
let escalated = 0;
let autoAccepted = 0;
let duplicates = 0;

function runInvoice(invoice: any) {
  const audit: any[] = [];

  if (isDuplicateInvoice(invoice.vendor, invoice.invoiceNumber)) {
    duplicates++;
    return { isDuplicate: true };
  }

  const mem = recall(invoice, audit);
  const applied = applyMemory(invoice, mem, audit);
  const review = decide(applied.confidence, audit);

  markInvoiceProcessed(invoice.vendor, invoice.invoiceNumber);

  if (review) escalated++;
  else autoAccepted++;

  return { applied, review, audit, isDuplicate: false };
}

// ---- Run Batch ----
console.log("\n🚀 Running 100-invoice batch test...\n");

for (let i = 1; i <= TOTAL_INVOICES; i++) {
  const invoice = {
    invoiceNumber: `INV-A-${String(i).padStart(3, "0")}`,
    vendor: VENDOR,
    fields: {
      Leistungsdatum: `2024-11-${(i % 28) + 1}`
    }
  };

  const result = runInvoice(invoice);

  // Simulate human approval ONLY when escalated & not duplicate
  if (!result.isDuplicate && result.review) {
    learn(
      invoice.vendor,
      "Leistungsdatum",
      "serviceDate",
      true,
      []
    );
  }

  // Print milestone snapshots
  if (i === 1 || i === 5 || i === 10 || i === 25 || i === 50 || i === 100) {
    console.log(`📄 Invoice ${i}`);
    console.log({
      escalated,
      autoAccepted,
      duplicates
    });
    console.log("------");
  }
}

// ---- Final Summary ----
console.log("\n📊 FINAL SUMMARY");
console.log({
  totalInvoices: TOTAL_INVOICES,
  escalated,
  autoAccepted,
  duplicates
});
