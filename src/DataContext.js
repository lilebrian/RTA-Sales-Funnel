/* eslint-disable */
import React, { createContext, useContext, useEffect, useState } from "react";

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

  function load(){
    const url = API_URL + "?ts=" + Date.now();
    return fetch(url, { headers: { "Cache-Control":"no-cache", "Pragma":"no-cache" } })
      .then(r => r.json())
      .then(rows => {
        const out = {};
        for (let i=0;i<rows.length;i++){
          const row = rows[i];
          const key = norm(row["Client Name"]) + "_" + norm(row["Month"]) + "_" + norm(row["Persona"]);
          out[key] = FIELDS.map(f => parseInt(row[f],10) || 0);
        }
        setData(out);
      })
      .catch(e => console.error("Read error:", e));
  }

  useEffect(() => { load(); const id = setInterval(load,30000); return () => clearInterval(id); }, []);

  async function updateData(c,m,p,counts){
    const key = norm(c) + "_" + norm(m) + "_" + norm(p);
    const nd = { ...data, [key]: counts }; setData(nd);
    const row = [{ "Client Name": c, "Month": m, "Persona": p,
      "Outreach": counts && counts[0] != null ? counts[0] : 0,
      "Connections": counts && counts[1] != null ? counts[1] : 0,
      "Replies": counts && counts[2] != null ? counts[2] : 0,
      "Meetings": counts && counts[3] != null ? counts[3] : 0,
      "Proposals": counts && counts[4] != null ? counts[4] : 0,
      "Contracts": counts && counts[5] != null ? counts[5] : 0 }];

    try {
      const res = await fetch(API_URL, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(row) });
      if (!res.ok) { console.error("Sheetbest write failed:", res.status, await res.text()); }
      else { await res.json().catch(()=>null); await load(); }
    } catch (e) { console.error("Write error:", e); }
  }

  function refresh(){ return load(); }
  function getCounts(c,m,p){ const key = norm(c)+"_"+norm(m)+"_"+norm(p); return data[key] || [0,0,0,0,0,0]; }

  return React.createElement(DataContext.Provider, { value:{ data, updateData, refresh, getCounts } }, children);
}
export default DataContext;
