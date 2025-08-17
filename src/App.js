import "./index.css";
import { useState } from "react";
import { DataProvider } from "./DataContext";
import AdminPanel from "./AdminPanel";
import Dashboard from "./Dashboard";

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState("January 2025");
  const [selectedPersona, setSelectedPersona] = useState("Biotech");
  const clientName = "AboveAllStaffing";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0B111D",
        color: "white",
        padding: "2rem",
      }}
    >
      <DataProvider clientName={clientName}>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "flex-start",
            maxWidth: "1200px",
            margin: "0 auto",
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
