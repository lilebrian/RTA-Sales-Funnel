// DataContext.js
import React, { createContext, useEffect, useMemo, useState } from "react";

const API_URL = process.env.REACT_APP_SHEETBEST_URL;

export const DataContext = createContext();

function monthKeyFromLabel(label) {
  if (!label) return "";
  const s = String(label).trim();
  if (/^\d{4}-\d{2}$/.test(s)) return s;

  const monthsMap = {
    jan: 1, january: 1,
    feb: 2, february: 2,
    mar: 3, march: 3,
    apr: 4, april: 4,
    may: 5,
    jun: 6, june: 6,
    jul: 7, july: 7,
    aug: 8, august: 8,
    sep: 9, sept: 9, september: 9,
    oct: 10, october: 10,
    nov: 11, november: 11,
    dec: 12, december: 12,
  };

  const parts = s.split(/\s+/);
  if (parts.length >= 2) {
    const m = monthsMap[parts[0].toLowerCase()];
    const y = parseInt(parts[1], 10);
    if (m && y) return `${y}-${String(m).padStart(2, "0")}`;
  }

  const d = new Date(s);
  if (!isNaN(d)) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  return "";
}

function personaKey(p) {
  return String(p || "").trim().toLowerCase();
}

function toNumber(v) {
  const n = parseInt(String(v ?? "").trim(), 10);
  return isNaN(n) ? 0 : n;
}

export const DataProvider = ({ children, clientName = "DefaultClient" }) => {
  const months = useMemo(
    () => [
      "January 2025", "February 2025", "March 2025", "April 2025",
