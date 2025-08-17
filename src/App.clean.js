import "./index.css";
import { useContext, useMemo, useEffect } from "react";
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
const personaKey = (p) => String(p |
