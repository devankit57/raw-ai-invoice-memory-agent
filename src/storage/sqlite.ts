import Database from "better-sqlite3";

export const db = new Database("data/memory.db");

db.exec(`
CREATE TABLE IF NOT EXISTS vendor_memory (
  vendor TEXT,
  raw_label TEXT,
  normalized_field TEXT,
  confidence REAL,
  seen_count INTEGER,
  last_used TEXT
);

CREATE TABLE IF NOT EXISTS correction_memory (
  pattern TEXT PRIMARY KEY,
  action TEXT,
  confidence REAL,
  success INTEGER,
  failure INTEGER
);

CREATE TABLE IF NOT EXISTS resolution_memory (
  issue TEXT PRIMARY KEY,
  approved INTEGER,
  rejected INTEGER
);

CREATE TABLE IF NOT EXISTS processed_invoices (
  vendor TEXT,
  invoice_number TEXT,
  created_at TEXT,
  PRIMARY KEY (vendor, invoice_number)
);

`);
