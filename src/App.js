import "./index.css";
import { useState, useContext, useEffect } from "react";
import { DataProvider, DataContext } from "./DataContext";
import FunnelVisualizer from "./FunnelChart";
import AdminPanel from "./AdminPanel";

const months = [
  "January 2025",
  "February 2025",
  "March 2025",
  "April 2025",
  "May 2025",
  "June 2025",
  "July 2025",
  "August 2025",
  "September 2025",
  "October 2025",
  "November 2025",
  "December 2025"
];

const personas = ["Biotech", "Greentech/Sustainability"];
const stages = ["Outreach", "Connections", "Replies", "Meetings", "Proposals", "Contracts"];

function Dashboard({ selectedMonth, selectedPersona, clientName, onMonthChange, onPersonaChange }) {
  const { data, loadData } = useContext(DataContext);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Build key exactly the same way DataContext does
  const monthKey = (label) => {
    const parts = String(label || "").split(" ");
    if (parts.length === 2) {
      const monthMap = {
        January: "01",
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12"
      };
      return `${parts[1]}-${monthMap[parts[0]]}`;
    }
    return label;
  };

  const personaKey = (p) => String(p || "").toLowerCase();
  const key = `${clientName}__${monthKey(selectedMonth)}__${personaKey(selectedPersona)}`;
  const counts = data?.[key] || [0, 0, 0, 0, 0, 0];

  const conversionRates = counts.map((count, i) =>
    i === 0 ? "" : counts[i - 1] > 0 ? ((count / counts[i - 1]) * 100).toFixed(1) + "%" : "0%"
  );
  const winRate = counts[0] > 0 ? ((counts[5] / counts[0]) * 100).toFixed(1) + "%" : "0%";

  return (
    <div style={{ flex: 2, backgroundColor: "#0B111D", padding: "2rem", borderRadius: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <img src="/logo-dark.jpg" alt="SalesFire Consulting Logo" style={{ height: "100px" }} />
      </div>
      <h2 style={{ textAlign: "center", color: "#C44528", marginBottom: "2rem" }}>
        Sales Funnel Dashboard
      </h2>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
        <select value={selectedMonth} onChange={(e) => onMonthChange(e.target.value)} style={dropdownStyle}>
          {months.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select value={selectedPersona} onChange={(e) => onPersonaChange(e.target.value)} style={dropdownStyle}>
          {personas.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      <FunnelVisualizer data={counts} stages={stages} />

      <table style={{ width: "100%", textAlign: "left", borderSpacing: "0 10px" }}>
        <thead>
          <tr style={{ color: "#ccc", fontSize: "0.9rem" }}>
            <th>Stage</th>
            <th>Count</th>
            <th>Conversion Rate</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((s, i) => (
            <tr key={s} style={{ backgroundColor: "#1D2739", color: "white" }}>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>{s}</td>
              <td style={{ padding: "0.5rem" }}>{counts[i]}</td>
              <td style={{ padding: "0.5rem" }}>{conversionRates[i]}</td>
            </tr>
          ))}
          <tr style={{ backgroundColor: "#202B3D", color: "white", fontWeight: "bold" }}>
            <td style={{ padding: "0.5rem" }}>Win Rate</td>
            <td style={{ padding: "0.5rem" }} colSpan="2">
              {winRate}
            </td>
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
  const [selectedMonth, setSelectedMonth] = useState("January 2025");
  const [selectedPersona, setSelectedPersona] = useState("Biotech");
  const clientName = "AboveAllStaffing";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0B111D", color: "white", padding: "2rem" }}>
      <DataProvider clientName={clientName}>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "flex-start",
            maxWidth: "1200px",
            margin: "0 auto"
          }}
        >
          <AdminPanel />
          <Dashboard
            clientName={clientName}
            selectedMonth={selectedMonth}
            selectedPersona={selectedPersona}
            onMonthChange={setSelectedMonth}
            onPersonaChange={setSelectedPersona}
          />
        </div>
      </DataProvider>
    </div>
  );
}
