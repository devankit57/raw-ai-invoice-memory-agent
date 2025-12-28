# RAW AI – Invoice Memory Agent 🤖

A memory-driven learning layer for invoice automation that improves over time using explainable, confidence-gated heuristics.

---

## 📌 Overview

This project implements an **AI agent-style memory layer** that sits *after invoice data extraction*.  
It learns from historical corrections and applies them safely to future invoices while maintaining full auditability.

The system is **rule-based and deterministic** (no ML training), making every decision transparent and suitable for enterprise financial workflows.

---

## 🎯 Problem Statement

Invoice processing systems often face:
- Repeated vendor-specific corrections
- Manual effort that does not translate into learning
- Risky automation without explainability

**Goal:**  
Design a system that:
- Learns reusable insights from past invoices  
- Applies them conservatively to new invoices  
- Avoids unsafe automation  
- Explains every decision  

---

## 🏗️ System Architecture

```
Extracted Invoice Data
        ↓
Duplicate Detection
        ↓
Memory Recall (Vendor Memory)
        ↓
Deterministic Rules (PO Matching)
        ↓
Memory Application (Normalization)
        ↓
Decision Engine (Auto / Suggest / Escalate)
        ↓
Learning Engine (Confidence Update)
```

Key principles:
- Safety before automation
- Deterministic rules before learned memory
- Confidence-gated decisions
- Persistent, auditable memory

---

## 🧠 Memory Types Implemented

### 1. Vendor Memory
- Stores vendor-specific normalization patterns
- Example: `Leistungsdatum → serviceDate`
- Confidence increases with repeated human approvals

### 2. Correction Logic (PO Matching)
- Deterministic PO matching when:
  - Vendor is already known
  - Exactly one PO exists
  - Line items match

### 3. Duplicate Protection
- Detects duplicates using `(vendor + invoiceNumber)`
- Always escalates duplicates
- Prevents learning from repeated invoices

---

## ⚖️ Decision Logic

| Confidence Score | Action |
|-----------------|--------|
| < 0.60 | Escalate |
| 0.60 – 0.85 | Suggest correction |
| ≥ 0.85 | Auto-correct |

This ensures gradual, safe automation.

---

## 📜 Audit Trail

Every invoice produces a structured audit trail with steps like:
- recall
- apply
- decide
- learn

Example:
```json
{
  "step": "apply",
  "details": "Mapped Leistungsdatum → serviceDate (confidence 0.65)"
}
```

---

## 🧪 Demo Flow

1. Invoice #1  
   - No memory → escalated

2. Human correction  
   - Memory stored with confidence

3. Invoice #2  
   - Vendor memory recalled  
   - PO auto-matched  
   - Field normalized  

4. Duplicate invoice  
   - Detected early  
   - Escalated  
   - Excluded from learning

---

## 📊 Batch Learning Demonstration

A batch test of **100 invoices** was executed.

### Results:
```json
{
  "totalInvoices": 100,
  "escalated": 5,
  "autoAccepted": 95,
  "duplicates": 0
}
```

This demonstrates controlled learning and improved automation over time.

---

## 💾 Persistence

- SQLite used for memory persistence
- Vendor memory and processed invoices survive restarts
- Ensures realistic long-term learning behavior

---

## 🛠️ Tech Stack

- **Language:** TypeScript (strict mode)
- **Runtime:** Node.js
- **Storage:** SQLite
- **Architecture:** Rule-based agent with memory

---

## 🚀 How to Run

```bash
npm install

# Reset memory for clean demo
rm data/memory.db

# Run interactive demo
npm run demo

# Run batch test
npm run batch
```

---

## 🔮 Future Improvements

- Resolution memory (approved vs rejected corrections)
- Vendor-specific tax logic (VAT inclusive handling)
- Confidence decay over time
- Semantic SKU normalization
- Memory visualization dashboards
- ERP system integration

---

## 🏁 Conclusion

This project demonstrates how **agentic memory systems** can responsibly improve invoice automation.

By combining deterministic rules, confidence-based learning, and strong safeguards, the system improves efficiency while remaining transparent, auditable, and safe for real-world financial workflows.

---

**Author:** Ankit Mishra  
**Assignment:** AI Agent Intern – Invoice Memory Layer
