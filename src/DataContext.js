/* eslint-disable */
import { createContext, useContext, useEffect, useState } from "react";

const API_URL = "https://api.sheetbest.com/sheets/372acb1a-2bfe-450a-92e9-d309cdec338b";
const FIELDS = ["Outreach","Connections","Replies","Meetings","Proposals","Contracts"];

function norm(v){ return (v == null ? "" : String(v)).trim(); }

const DataContext = createContext({
  data: {},
  updateData: function(){},
  refresh: function(){},
  getCounts: function(){ return [0,0,0,0,0,0]; }
});

export const useData = () => useContext(DataContext);

export function DataProvider({ children }) {
  const [data, setData] = useState({});

  function structure(rows){
    const out = {};
    rows.forEach(function(row){
      const key = norm(row["Client Name"]) + "_" + norm(row["Month"]) + "_" + norm(row["Persona"]);
      out[key] = FIELDS.map(function(f){ return parseInt(row[f], 10) || 0; });
    });
    return out;
  }

  function load(){
    const url = API_URL + "?ts=" + Date.now(); // cache-bust
    return fetch(url, { headers: { "Cache-Control":"no-cache", "Pragma":"no-cache" } })
      .then(function(r){ return r.json(); })
      .then(function(rows){ setData(structure(rows)); })
      .catch(function(e){ console.error("Read error:", e); });
  }

  useEffect(function(){
    load();
    const id = setInterval(load, 30000); // poll every 30s
    return function(){ clearInterval(id); };
  }, []);

  async function updateData(clientName, month, persona, counts){
    const key = norm(clientName) + "_" + norm(month) + "_" + norm(persona);
    const nd = {}; for (const k in data) nd[k] = data[k]; nd[key] = counts;
    setData(nd);

    const row = [{
      "Client Name": clientName,
      "Month": month,
      "Persona": persona,
      "Outreach": counts && counts[0] != null ? counts[0] : 0,
      "Connections": counts && counts[1] != null ? counts[1] : 0,
      "Replies": counts && counts[2] != null ? counts[2] : 0,
      "Meetings": counts && counts[3] != null ? counts[3] : 0,
      "Proposals": counts && counts[4] != null ? counts[4] : 0,
      "Contracts": counts && counts[5] != null ? counts[5] : 0
    }];

    try{
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row)
      });
      if(!res.ok){
        const text = await res.text();
        console.error("Sheetbest write failed:", res.status, text);
      } else {
        await res.json().catch(function(){ return null; });
        await load(); // refresh after save
      }
    } catch(e){
      console.error("Write error:", e);
    }
  }

  function refresh(){ return load(); }

  function getCounts(clientName, month, persona){
    const key = norm(clientName) + "_" + norm(month) + "_" + norm(persona);
    return data[key] || [0,0,0,0,0,0];
  }

  return (
    <DataContext.Provider value={{ data, updateData, refresh, getCounts }}>
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;
