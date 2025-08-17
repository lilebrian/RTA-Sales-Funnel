// DataContext.js
import React, { createContext, useEffect, useMemo, useState } from "react";

// ✅ Use CRA env var so Vercel can inject it (Settings → Environment Variables)
const API_URL = process.env.REACT_APP_SHEETBEST_URL=https://api.sheetbest.com/sheets/478f9c3e-5b45-4f46-aacf-958cc41d1dc9


export const DataContext = createContext();

function monthKeyFromLabel(label) {
  // Accepts "Jan 2025", "January 2025", "2025-01", etc. -> returns "2025-01"
  if (!label) return "";
  const s = String(label).trim();

  // Already ISO-like?
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

  const parts = s.split(/\s+/); // ["Jan","2025"] or ["January","2025"]
  if (parts.length >= 2) {
    const m = monthsMap[parts[0].toLowerCase()];
    const y = parseInt(parts[1], 10);
    if (m && y) return `${y}-${String(m).padStart(2, "0")}`;
  }

  // Fallback: try Date parsing
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

export const DataProvider = ({ children }) => {
  // Feel free to parameterize these via props if needed
  const [clientName] = useState("RTA Consulting");

  // ✅ Use consistent *labels* for UI…
  const months = useMemo(
    () => [
      "January 2025", "February 2025", "March 2025", "April 2025",
      "May 2025", "June 2025", "July 2025", "August 2025",
      "September 2025", "October 2025", "November 2025", "December 2025",
    ],
    []
  );

  const personas = useMemo(
    () => ["Biotech", "Greentech/Sustainability"],
    []
  );

  // …and normalize them internally for keys
  const [selectedMonth, setSelectedMonth] = useState("January 2025");
  const [selectedPersona, setSelectedPersona] = useState("Biotech");

  const [counts, setCounts] = useState([0, 0, 0, 0, 0, 0]);
  const [data, setData] = useState({});
  // data shape: { `${client}__${yyyy-mm}__${personaKey}`: [outreach,...,contracts] }

  function keyOf(client, monthLabel, personaLabel) {
    const mk = monthKeyFromLabel(monthLabel);
    const pk = personaKey(personaLabel);
    return `${client}__${mk}__${pk}`;
  }

  const updateData = async (client, monthLabel, personaLabel, newCounts, weekOf) => {
    const k = keyOf(client, monthLabel, personaLabel);
    const merged = { ...data, [k]: newCounts };
    setData(merged);

    const payload = {
      "Client Name": client,
      "Month": monthKeyFromLabel(monthLabel), // store canonical month
      "Week of": weekOf || "",
      "Persona": personaLabel,
      "Outreach": toNumber(newCounts[0]),
      "Connections": toNumber(newCounts[1]),
      "Replies": toNumber(newCounts[2]),
      "Meetings": toNumber(newCounts[3]),
      "Proposals": toNumber(newCounts[4]),
      "Contracts": toNumber(newCounts[5]),
    };

    try {
      if (!API_URL) throw new Error("Missing REACT_APP_SHEETBEST_URL");
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`POST ${resp.status}: ${txt}`);
      }
      const result = await resp.json();
      console.log("✅ Sheet.best response:", result);
    } catch (err) {
      console.error("❌ Error saving data:", err);
    }
  };

  const loadData = async () => {
    try {
      if (!API_URL) throw new Error("Missing REACT_APP_SHEETBEST_URL");
      const resp = await fetch(API_URL);
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`GET ${resp.status}: ${txt}`);
      }
      const rows = await resp.json();

      const aggregated = {};
      rows.forEach((row) => {
        const client = row["Client Name"] || "";
        const mk = monthKeyFromLabel(row["Month"]);
        const pk = personaKey(row["Persona"]);
        if (!client || !mk) return; // skip incomplete lines

        const k = `${client}__${mk}__${pk}`;

        const cts = [
          toNumber(row["Outreach"]),
          toNumber(row["Connections"]),
          toNumber(row["Replies"]),
          toNumber(row["Meetings"]),
          toNumber(row["Proposals"]),
          toNumber(row["Contracts"]),
        ];

        if (!aggregated[k]) aggregated[k] = [0, 0, 0, 0, 0, 0];
        aggregated[k] = aggregated[k].map((v, i) => v + cts[i]);
      });

      setData(aggregated);
      console.log("📊 Aggregated data:", aggregated);
    } catch (err) {
      console.error("❌ Error loading data:", err);
    }
  };

  // ✅ Load once on mount
  useEffect(() => {
    loadData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        clientName,
        months,
        personas,
        selectedMonth,
        setSelectedMonth,
        selectedPersona,
        setSelectedPersona,
        counts,
        setCounts,
        updateData,
        loadData,
        data,
        setData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
