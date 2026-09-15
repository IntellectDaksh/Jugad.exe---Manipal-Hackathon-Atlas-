// CashPulse State & Persistence Manager
// Guarantees persistence of portfolios, borrowers, restructuring changes, and audit trail.

import { DEFAULT_PORTFOLIOS } from "./demoData.js";

const PORTFOLIOS_KEY = "cashpulse_portfolios_v1";
const AUDIT_KEY = "cashpulse_audit_trail_v1";
const ACTIVE_PORTFOLIO_KEY = "cashpulse_active_portfolio_id_v1";

export class StorageManager {
  constructor() {
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify(event, data) {
    this.subscribers.forEach(cb => {
      try {
        cb(event, data);
      } catch (err) {
        console.error("Storage subscriber error:", err);
      }
    });
  }

  loadPortfolios() {
    try {
      const serialized = localStorage.getItem(PORTFOLIOS_KEY);
      if (!serialized) {
        this.savePortfolios(DEFAULT_PORTFOLIOS, {
          action: "Initialize Demo Data",
          details: "Loaded initial field portfolios (Mysuru and Dharwad clusters)"
        });
        return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIOS));
      }
      const parsed = JSON.parse(serialized);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIOS));
    } catch (e) {
      console.warn("Error loading from localStorage, returning default portfolios:", e);
      return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIOS));
    }
  }

  savePortfolios(portfolios, auditInfo = null) {
    try {
      localStorage.setItem(PORTFOLIOS_KEY, JSON.stringify(portfolios));
      if (auditInfo) {
        this.logAudit(auditInfo.action, auditInfo.details);
      }
      this.notify("save", { portfolios, auditInfo });
      return true;
    } catch (e) {
      console.error("Failed to save portfolios to localStorage:", e);
      return false;
    }
  }

  loadActivePortfolioId() {
    try {
      return localStorage.getItem(ACTIVE_PORTFOLIO_KEY);
    } catch {
      return null;
    }
  }

  saveActivePortfolioId(id) {
    try {
      localStorage.setItem(ACTIVE_PORTFOLIO_KEY, id);
    } catch (e) {
      console.error("Failed to save active portfolio id:", e);
    }
  }

  loadAuditLog() {
    try {
      const raw = localStorage.getItem(AUDIT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  logAudit(action, details) {
    try {
      const logs = this.loadAuditLog();
      const newEntry = {
        id: "audit-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toISOString(),
        action,
        details
      };
      logs.unshift(newEntry);
      // Keep up to 200 recent actions
      if (logs.length > 200) logs.pop();
      localStorage.setItem(AUDIT_KEY, JSON.stringify(logs));
      this.notify("audit", newEntry);
    } catch (e) {
      console.error("Failed to append audit log:", e);
    }
  }

  exportData() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      portfolios: this.loadPortfolios(),
      auditLog: this.loadAuditLog()
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.portfolios)) {
        throw new Error("Invalid format: 'portfolios' array missing.");
      }
      this.savePortfolios(parsed.portfolios, {
        action: "Imported Data",
        details: `Restored ${parsed.portfolios.length} portfolios from JSON backup`
      });
      if (Array.isArray(parsed.auditLog)) {
        localStorage.setItem(AUDIT_KEY, JSON.stringify(parsed.auditLog));
      }
      return { success: true, count: parsed.portfolios.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  resetToDefault() {
    try {
      localStorage.removeItem(PORTFOLIOS_KEY);
      localStorage.removeItem(ACTIVE_PORTFOLIO_KEY);
      this.savePortfolios(DEFAULT_PORTFOLIOS, {
        action: "System Reset",
        details: "Restored baseline field portfolios and borrowers"
      });
      return true;
    } catch (err) {
      console.error("Failed to reset:", err);
      return false;
    }
  }
}

export const storage = new StorageManager();
