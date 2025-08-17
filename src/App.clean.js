import "./index.css";
import { useContext, useMemo, useEffect, useState } from "react";
import { DataProvider, DataContext } from "./DataContext";
import AdminPanel from "./AdminPanel";
import FunnelVisualizer from "./FunnelChart";

const STAGES = ["Outreach","Connections","Replies","Meetings","Proposals","Contracts"];

function monthKey(label) {
  const parts = String(label || "").trim().split(" ");
  if (parts.length === 2) {
    const map = {
      January:"01", February:"02", March:"03", April:"04", May:"05", June:"06",
      July:"07", August:"08", September:"09", October:"10", November:"11", December:"12",
    };
    return `${parts[1]}-${map[parts[0]]}`;
  }
  return String(label || "");
}
const personaKey = (p) => String(p || "").trim().toLowerCase();

function Dashboard() {
  const {
    clientName,
    months,
    personas,
    selectedMonth,
    setSelectedMonth,
    selectedPersona,
    setSelectedPersona,
    data,
    loadData,
  } = useContext(DataContext);

  const [viewMode, setViewMode] = useState("MONTH"); // "MONTH" | "YTD"

  useEffect(() => { loadData(); }, [loadData]);

  const monthKeyStr = monthKey(selectedMonth);
  const selectedYear = monthKeyStr.slice(0, 4); // e.g., "2025"
  const personaKeyStr = personaKey(selectedPersona);

  const counts = useMemo(() => {
    if (viewMode === "YTD" && selectedYear) {
      // Sum across all months in the selected year for this client + persona
      const zero = [0,0,0,0,0,0];
      return Object.entries(data || {})
        .filter(([k]) =>
          k.startsWith(`${clientName}__${selectedYear}-`) &&
          k.endsWith(`__${personaKeyStr}`)
        )
        .reduce((acc, [, arr]) => acc.map((v, i) => v + (arr?.[i] || 0)), zero);
    }
    // Default: month view
    const key = `${clientName}__${monthKeyStr}__${personaKeyStr}`;
    return (data && data[key]) ? data[key] : [0,0,0,0,0,0];
  }, [viewMode, selectedYear, data, clientName, monthKeyStr, personaKeyStr]);

  const conversionRates = counts.map((_, i) =>
    i === 0 ? "" : counts[i-1] > 0 ? ((counts[i]/counts[i-1])*100).toFixed(1) + "%" : "0%"
  );
  const winRate = counts[0] > 0 ? ((counts[5]/counts[0])*100).toFixed(1) + "%" : "0%";

  const viewLabel = viewMode === "YTD" && selectedYear ? `Year-to-Date ${selectedYear}` : selectedMonth;

  return (
    <div style={{ flex: 2, backgroundColor: "#0B111D", padding: "2rem", borderRadius: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <img src="/logo-dark.jpg" alt="SalesFire Consulting Logo" style={{ height: "100px" }} />
      </div>

      <h2 style={{ textAlign: "center", color: "#C44528", marginBottom: "0.5rem" }}>
        Sales Funnel Dashboard
      </h2>
      <div style={{ textAlign: "center", color: "#92A0B4", marginBottom: "1.25rem" }}>
        View: <span style={{ fontWeight: 600 }}>{viewLabel}</span> — Persona: <span style={{ fontWeight: 600 }}>{selectedPersona}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
        <select value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)} style={dropdownStyle}>
          {months.map((m)=> <option key={m}>{m}</option>)}
        </select>
        <select value={selectedPersona} onChange={(e)=>setSelectedPersona(e.target.value)} style={dropdownStyle}>
          {personas.map((p)=> <option key={p}>{p}</option>)}
        </select>
        <select value={viewMode} onChange={(e)=>setViewMode(e.target.value)} style={dropdownStyle}>
          <option value="MONTH">Month</option>
          <option value="YTD">Year-to-Date</option>
        </select>
      </div>

      <FunnelVisualizer data={counts} stages={STAGES} />

      <table style={{ width: "100%", textAlign: "left", borderSpacing: "0 10px" }}>
        <thead>
          <tr style={{ color: "#ccc", fontSize: "0.9rem" }}>
            <th>Stage</th><th>Count</th><th>Conversion Rate</th>
          </tr>
        </thead>
        <tbody>
          {STAGES.map((s, i) => (
            <tr key={s} style={{ backgroundColor: "#1D2739", color: "white" }}>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>{s}</td>
              <td style={{ padding: "0.5rem" }}>{counts[i]}</td>
              <td style={{ padding: "0.5rem" }}>{conversionRates[i]}</td>
            </tr>
          ))}
          <tr style={{ backgroundColor: "#202B3D", color: "white", fontWeight: "bold" }}>
            <td style={{ padding: "0.5rem" }}>Win Rate</td>
            <td style={{ padding: "0.5rem" }} colSpan="2">{winRate}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const dropdownStyle = {
  padding: "0.5rem",
  backgroundColor: "#1D2739",
  color: "white",
  border: "1px solid #39455D",
  borderRadius: "5px"
};

export default function App() {
  // IMPORTANT: must match "Client Name" in your Sheet rows exactly
  const clientName = "RTA Consulting";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0B111D", color: "white", padding: "2rem" }}>
      <DataProvider clientName={clientName}>
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", maxWidth: "1200px", margin: "0 auto" }}>
          <AdminPanel />
          <Dashboard />
        </div>
      </DataProvider>
    </div>
  );
}
