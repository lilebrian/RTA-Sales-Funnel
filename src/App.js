import "./index.css";
import { useState, useEffect, useContext } from "react";
import { DataProvider, DataContext } from "./DataContext";
import FunnelVisualizer from "./FunnelChart";
import AdminPanel from "./AdminPanel";

const months = [
  "January 2025", "February 2025", "March 2025", "April 2025",
  "May 2025", "June 2025", "July 2025", "August 2025",
  "September 2025", "October 2025", "November 2025", "December 2025",
];

const personas = ["Biotech", "Greentech/Sustainability"];
const stages = ["Outreach", "Connections", "Replies", "Meetings", "Proposals", "Contracts"];

function Dashboard({ selectedMonth, selectedPersona, clientName, onMonthChange, onPersonaChange }) {
  const { data, loadData } = useContext(DataContext);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const monthKeyFromLabel = (label) => {
    const map = {
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
    const parts = String(label || "").trim().split(/\s+/);
    if (parts.length >= 2) {
      const m = map[parts[0].toLowerCase()];
      const y = parseInt(parts[1], 10);
      if (m && y) return `${y}-${String(m).padStart(2, "0")}`;
    }
    return String(label || "");
  };

  const personaKey = (p) => String(p || "").trim().toLowerCase();

  const k = `${clientName}__${monthKeyFromLabel(selectedMonth)}__${personaKey(selectedPersona)}`;
  const counts = data?.[k] || [0, 0, 0, 0, 0, 0];

  const conversionRates = counts.map((count, i) =>
    i === 0 ? "" : (counts[i - 1] > 0 ? ((count / counts[i - 1]) * 100).toFixed(1) + "%" : "0%")
  );
  const winRate = counts[0] > 0 ? ((counts[5] / counts[0]) * 100).toFixed(1) + "%" : "0%";

  return (
    <div style={{ flex: 2, backgroundColor: "#0B111D", padding: "2rem", borderRadius: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <img src="/logo-dark.jpg" alt="SalesFire Consulting Logo" style={{ height: "100px" }} />
      </div>
      <h2 style={{ textAlign: "center", color: "#C44528", marginBottom: "2re
