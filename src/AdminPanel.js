import React, { useState } from 'react';
import { useData } from './DataContext';

const stages = ["Outreach", "Connections", "Replies", "Meetings", "Proposals", "Contracts"];
const months = [
  "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025",
  "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"
];
const personas = ["BioTech High Priority", "BioTech Low Priority", "Sustainability/Greentech High Priority", "Sustainability/Greentech Low Priority"];

export default function AdminPanel() {
  const { data, updateData } = useData();
  const [selectedMonth, setSelectedMonth] = useState("Jan 2025");
  const [selectedPersona, setSelectedPersona] = useState("Operations");
  const [clientName, setClientName] = useState("RTA Consulting");

  const key = `${clientName}_${selectedMonth}_${selectedPersona}`;
  const initialCounts = data[key] || [0, 0, 0, 0, 0, 0];
  const [counts, setCounts] = useState([...initialCounts]);

  const handleChange = (index, value) => {
    const updated = [...counts];
    updated[index] = parseInt(value) || 0;
    setCounts(updated);
  };

  const handleSave = async () => {
    await updateData(clientName, selectedMonth, selectedPersona, counts);
    alert("Data saved to Google Sheet!");
  };

  return (
    <div style={{ backgroundColor: "#1D2739", padding: "1.5rem", borderRadius: "1rem", marginBottom: "2rem" }}>
      <h3 style={{ color: "#C44528", textAlign: "center", marginBottom: "1rem" }}>
        Admin Panel – Update Funnel Data
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={dropdownStyle}>
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>

          <select value={selectedPersona} onChange={(e) => setSelectedPersona(e.target.value)} style={dropdownStyle}>
            {personas.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {stages.map((stage, i) => (
          <label key={stage} style={{ display: "flex", flexDirection: "column", color: "white" }}>
            {stage}
            <input
              type="number"
              value={counts[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              style={inputStyle}
            />
          </label>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: "#C44528",
            color: "white",
            border: "none",
            padding: "0.75rem 2rem",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "0.5rem",
  backgroundColor: "#2A3548",
  color: "white",
  border: "1px solid #39455D",
  borderRadius: "5px"
};

const dropdownStyle = {
  ...inputStyle,
  width: "100%"
};
