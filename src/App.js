import './index.css';
import { useState } from 'react';
import { useData, DataProvider } from './DataContext';
import FunnelVisualizer from './FunnelChart';
import AdminPanel from './AdminPanel';

const months = [
  "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025",
  "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"
];
const personas = ["BioTech High Priority", "BioTech Low Priority", "Sustainability/Greentech High Priority", "Sustainability/Greentech Low Priority"];
const stages = ["Outreach", "Connections", "Replies", "Meetings", "Proposals", "Contracts"];

function Dashboard({ selectedMonth, selectedPersona, clientName, onMonthChange, onPersonaChange, onClientChange }) {
  const { data } = useData();
  const key = `${clientName}_${selectedMonth}_${selectedPersona}`;
  const counts = data[key] || [0, 0, 0, 0, 0, 0];

  const conversionRates = counts.map((count, i) => {
    if (i === 0) return "";
    return counts[i - 1] > 0
      ? ((count / counts[i - 1]) * 100).toFixed(1) + "%"
      : "0%";
  });

  const winRate =
    counts[0] > 0 ? ((counts[5] / counts[0]) * 100).toFixed(1) + "%" : "0%";

  return (
    <div style={{ flex: 2, backgroundColor: "#0B111D", padding: "2rem", borderRadius: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <img src="/logo-dark.jpg.jpg" alt="SalesFire Consulting Logo" style={{ height: "100px" }} />
      </div>
      <h2 style={{ textAlign: "center", color: "#C44528", marginBottom: "2rem" }}>
        Sales Funnel Dashboard
      </h2>

      {/* Filter Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => onClientChange(e.target.value)}
          style={dropdownStyle}
        />

        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          style={dropdownStyle}
        >
          {months.map((month) => (
            <option key={month}>{month}</option>
          ))}
        </select>

        <select
          value={selectedPersona}
          onChange={(e) => onPersonaChange(e.target.value)}
          style={dropdownStyle}
        >
          {personas.map((persona) => (
            <option key={persona}>{persona}</option>
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
          {stages.map((stage, i) => (
            <tr key={stage} style={{ backgroundColor: "#1D2739", color: "white" }}>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>{stage}</td>
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
  const [selectedMonth, setSelectedMonth] = useState("Jan 2025");
  const [selectedPersona, setSelectedPersona] = useState("Operations");
  const [clientName, setClientName] = useState("RTA Consulting");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0B111D", color: "white", padding: "2rem" }}>
      <DataProvider>
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ flex: 1, marginTop: "18rem" }}>
            <AdminPanel />
          </div>
          <Dashboard
            clientName={clientName}
            selectedMonth={selectedMonth}
            selectedPersona={selectedPersona}
            onClientChange={setClientName}
            onMonthChange={setSelectedMonth}
            onPersonaChange={setSelectedPersona}
          />
        </div>
      </DataProvider>
    </div>
  );
}


