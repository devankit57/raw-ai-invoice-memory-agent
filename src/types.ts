export interface Invoice {
  invoiceNumber: string;
  vendor: string;
  fields: Record<string, any>;
  rawText?: string;
}

export interface AuditStep {
  step: "recall" | "apply" | "decide" | "learn";
  timestamp: string;
  details: string;
}
