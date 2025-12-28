import fs from "fs";
import path from "path";

interface PO {
  poNumber: string;
  vendor: string;
  items: { sku: string; qty: number }[];
}

// Load POs once (demo-safe)
const poData: PO[] = JSON.parse(
  fs.readFileSync(
    path.resolve("data/purchase_orders.json"),
    "utf-8"
  )
);

/**
 * Try to find a matching PO for an invoice
 */
export function matchPO(invoice: any) {
  if (invoice.poNumber) return null;

  const vendorPOs = poData.filter(
    po => po.vendor === invoice.vendor
  );

  if (vendorPOs.length !== 1) return null;

  const po = vendorPOs[0];

  const poItems = JSON.stringify(po.items);
  const invoiceItems = JSON.stringify(invoice.items || []);

  if (poItems === invoiceItems) {
    return po.poNumber;
  }

  return null;
}
