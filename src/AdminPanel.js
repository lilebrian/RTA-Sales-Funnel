import { useContext, useState } from "react";
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
    loadData,
  } = useContext(DataContext);

  const [weekOf, setWeekOf] = useState("");

  const handleCount = (i, val) => {
    const n = parseInt(val, 10);
    const safe = isNaN(n) ? 0 : n;
    const next = [...counts];
    next[i] = safe;
    setCounts(next);
  };

  const handleSave = async () => {
    await updateData(clientName, selectedMonth, selectedPersona, counts, weekOf);
    await loadData(); // refresh aggregated totals so Dashboard updates
  };

  return (
    <div style={{ flex: 1, backgroundColor: "#111827", padding: "1rem", borderRadius: "1rem" }}>
      <h3 style={{ marginTop: 0 }}>Admin</h3>

      <div style={{ display: "grid", gap: "0.5rem" }}>
        <label>
          Month:
          <select value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)} style={selectStyle}>
            {months.map((m)=> <option key={m}>{m}</option>)}
          </select>
        </label>

        <label>
          Persona:
          <select value={selectedPersona} onChange={(e)=>setSelectedPersona(e.target.value)} style={selectStyle}>
            {personas.map((p)=> <option key={p}>{p}</option>)}
          </select>
        </label>

        <label>
          Week of (optional):
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            value={weekOf}
            onChange={(e)=>setWeekOf(e.target.value)}
            style={inputStyle}
          />
        </label>

        {["Outreach","Connections","Replies","Meetings","Proposals","Contracts"].map((label, i) => (
          <label key={label}>
            {label}:
            <input
              type="number"
              min="0"
              value={counts[i]}
              onChange={(e)=>handleCount(i, e.target.value)}
              style={inputStyle}
            />
          </label>
        ))}

        <button onClick={handleSave} style={buttonStyle}>Save</button>
      </div>
    </div>
  );
}

const selectStyle = { marginLeft: "0.5rem", padding: "0.25rem" };
const inputStyle  = { marginLeft: "0.5rem", padding: "0.25rem", width: "8rem" };
const buttonStyle = {
  marginTop: "0.5rem",
  padding: "0.5rem 0.75rem",
  background: "#C44528",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
