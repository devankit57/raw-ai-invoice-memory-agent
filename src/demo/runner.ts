import { recall } from "../engine/recall.js";
import { applyMemory } from "../engine/apply.js";
import { decide } from "../engine/decide.js";
import { learn } from "../engine/learn.js";
import {
  isDuplicateInvoice,
  markInvoiceProcessed
} from "../engine/duplicate.js";
import { matchPO } from "../engine/poMatch.js";

/**
 * Runs one invoice through the decision pipeline.
 * Each invoice has its own audit trail.
 */
function runInvoice(invoice: any) {
  const audit: any[] = [];
  const extraCorrections: string[] = [];

  // Block duplicates early and skip all learning
  if (isDuplicateInvoice(invoice.vendor, invoice.invoiceNumber)) {
    audit.push({
      step: "decide",
      timestamp: new Date().toISOString(),
      details:
        "Duplicate invoice detected (same vendor and invoice number). Escalating and skipping memory."
    });

    return {
      applied: {
        normalized: invoice.fields,
        proposals: [],
        confidence: 0
      },
      review: true,
      audit,
      isDuplicate: true
    };
  }

  // Recall existing vendor memory
  const mem = recall(invoice, audit);

  // Suggest PO only if the vendor is already known
  if (mem.length > 0) {
    const matchedPO = matchPO(invoice);

    if (matchedPO) {
      invoice.poNumber = matchedPO;

      extraCorrections.push(
        `Auto-suggested PO match: ${matchedPO} (single vendor PO with matching items)`
      );

      audit.push({
        step: "apply",
        timestamp: new Date().toISOString(),
        details: `Auto-suggested PO match: ${matchedPO} (single vendor PO with matching items)`
      });
    }
  }

  // Apply learned memory (field normalization, corrections)
  const applied = applyMemory(invoice, mem, audit);

  // Merge PO suggestion into proposed corrections
  applied.proposals.unshift(...extraCorrections);

  // Final decision
  const review = decide(applied.confidence, audit);

  // Mark invoice as processed so duplicates can be detected later
  markInvoiceProcessed(invoice.vendor, invoice.invoiceNumber);

  return {
    applied,
    review,
    audit,
    isDuplicate: false
  };
}

// Invoice 1: first time seeing the vendor
const invoice1 = {
  invoiceNumber: "INV-A-001",
  vendor: "Supplier GmbH",
  poNumber: null,
  items: [{ sku: "ITEM-1", qty: 10 }],
  fields: {
    Leistungsdatum: "2024-11-01"
  }
};

console.log("\n--- Processing Invoice 1 ---");

const r1 = runInvoice(invoice1);

console.log({
  normalizedInvoice: r1.applied.normalized,
  proposedCorrections: r1.applied.proposals,
  requiresHumanReview: r1.review,
  auditTrail: r1.audit
});

// Simulate human approval and store learning
if (!r1.isDuplicate) {
  learn(
    invoice1.vendor,
    "Leistungsdatum",
    "serviceDate",
    true,
    []
  );
}

// Invoice 2: same vendor, learning should apply
const invoice2 = {
  invoiceNumber: "INV-A-003",
  vendor: "Supplier GmbH",
  poNumber: null,
  items: [{ sku: "ITEM-1", qty: 10 }],
  fields: {
    Leistungsdatum: "2024-11-15"
  }
};

console.log("\n--- Processing Invoice 2 ---");

const r2 = runInvoice(invoice2);

console.log({
  normalizedInvoice: r2.applied.normalized,
  proposedCorrections: r2.applied.proposals,
  requiresHumanReview: r2.review,
  auditTrail: r2.audit
});

// Invoice 1 again to demonstrate duplicate handling
console.log("\n--- Processing Invoice 1 AGAIN (Duplicate) ---");

const r3 = runInvoice(invoice1);

console.log({
  requiresHumanReview: r3.review,
  auditTrail: r3.audit
});
