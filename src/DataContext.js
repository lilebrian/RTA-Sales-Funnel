import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

const API_URL = "https://api.sheetbest.com/sheets/372acb1a-2bfe-450a-92e9-d309cdec338b";
const FIELDS = ["Outreach","Connections","Replies","Meetings","Proposals","Contracts"];
const FETCH_INTERVAL_MS = 30000; // poll every 30s

function norm(v) { return (v == null ? "" : String(v)).trim(); }

export function DataProvider({ children }) {
  const [data, setData] = useState({});

  function structureRows(rows) {
    var structured = {};
    rows.forEach(function (row) {
      var key = norm(row["Client Name"]) + "_" + norm(row["Month"]) + "_" + norm(row["Persona"]);
      structured[key] = FIELDS.map(function (f) { return parseInt(row[f], 10) || 0; });
    });
    return structured;
  }

  function load() {
    var url = API_URL + "?ts=" + Date.now(); // cache-bust
    return fetch(url, { headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" } })
      .then(function (res) { return res.json(); })
      .then(function (rows) { setData(structureRows(rows)); })
      .catch(function (e) { console.error("Read error:", e); });
  }

  useEffect(function () {
    var mounted = true;
    load();
    var id = setInterval(function () { if (mounted) load(); }, FETCH_INTERVAL_MS);
    return function () { mounted = false; clearInterval(id); };
  }, []);

  async function updateData(clientName, month, persona, counts) {
    var key = norm(clientName) + "_" + norm(month) + "_" + norm(persona);
    var newData = {};
    for (var k in data) newData[k] = data[k];
    newData[key] = counts;
    setData(newData);

    var outreach = counts && counts[0] != null ? counts[0] : 0;
    var connections = counts && counts[1] != null ? counts[1] : 0;
    var replies = counts && counts[2] != null ? counts[2] : 0;
    var meetings = counts && counts[3] != null ? counts[3] : 0;
    var proposals = counts && counts[4] != null ? counts[4] : 0;
    var contracts = counts && counts[5] != null ? counts[5] : 0;

    var row = [{
      "Client Name": clientName,
      "Month": month,
      "Persona": persona,
      "Outreach": outreach,
      "Connections": connections,
      "Replies": replies,
      "Meetings": meetings,
      "Proposals": proposals,
      "Contracts": contracts
    }];

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row)
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Sheetbest write failed:", res.status, text);
      } else {
        await res.json().catch(function () { return null; });
        await load(); // immediate refresh after save
      }
    } catch (e) {
      console.error("Write error:", e);
    }
  }

  function refresh() { return load(); }

  function getCounts(clientName, month, persona) {
    var key = norm(clientName) + "_" + norm(month) + "_" + norm(persona);
    return data[key] || [0,0,0,0,0,0];
  }

  return (
    <DataContext.Provider value={{ data, updateData, refresh, getCounts }}>
      {children}
    </DataContext.Provider>
  );
}

}


