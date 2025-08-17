import React, { useContext, useState } from "react";
import { DataContext } from "./DataContext";

export default function AdminPanel() {
  const {
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
  } = useContext(DataContext);

  const [weekOf, setWeekOf] = useState("");

  const handleCountChange = (index, value) => {
    const updated = [...counts];
    updated[index] = parseInt(value) || 0;
    setCounts(updated);
  };

  const handleSave = () => {
    updateData(clientName, selectedMonth, selectedPersona, counts, weekOf);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "20rem",
        padding: "1.5rem",
        backgroundColor: "#0B111D",
        borderRight: "1px solid #2c2c2c",
        borderRadius: "0.5rem",
        fontFamily: "sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          color: "white",
        }}
      >
        Admin Panel
      </h2>

      <label style={labelStyle}>Month</label>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        style={inputStyle}
      >
        {months.map((month) => (
          <option key={month}>{month}</option>
        ))}
      </select>

      <label style={labelStyle}>Persona</label>
      <select
        value={selectedPersona}
        onChange={(e) => setSelectedPersona(e.target.value)}
        style={inputStyle}
      >
        {personas.map((persona) => (
          <option key={persona}>{persona}</option>
        ))}
      </select>

      <label style={labelStyle}>Week of</label>
      <input
        type="text"
        value={weekOf}
        onChange={(e) => setWeekOf(e.target.value)}
        placeholder="e.g. May 20–26"
        style={inputStyle}
      />

      {["Outreach", "Connections", "Replies", "Meetings", "Proposals", "Contracts"].map(
        (label, i) => (
          <div key={i}>
            <label style={labelStyle}>{label}</label>
            <input
              type="number"
              value={counts[i]}
              onChange={(e) => handleCountChange(i, e.target.value)}
              style={inputStyle}
            />
          </div>
        )
      )}

      <button onClick={handleSave} style={buttonStyle}>
        Save
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  marginBottom: "1rem",
  borderRadius: "5px",
  backgroundColor: "#1D2739",
  color: "white",
  border: "1px solid #39455D",
  fontSize: "0.95rem",
};

const labelStyle = {
  color: "white",
  marginBottom: "0.25rem",
  fontSize: "0.9rem",
  display: "block",
};

const buttonStyle = {
  marginTop: "1rem",
  width: "100%",
  backgroundColor: "#C44528",
  color: "white",
  fontWeight: "bold",
  padding: "0.6rem",
  borderRadius: "5px",
  border: "none",
  fontSize: "1rem",
  cursor: "pointer",
};
