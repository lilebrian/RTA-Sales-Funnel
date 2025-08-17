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

  // Build key in the same way DataContext normalizes it
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
  const counts = data?.[key] || [0, 0, 0, 0, 0,]()
