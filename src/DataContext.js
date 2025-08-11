import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

const API_URL = "https://api.sheetbest.com/sheets/9b1d9cfc-cf54-483a-a7d5-4bb7663a65e4";

export function DataProvider({ children }) {
  const [data, setData] = useState({});

  useEffect(function () {
    fetch(API_URL)
      .then(function (res) { return res.json(); })
      .then(function (rows) {
        var structured = {};
        rows.forEach(function (row) {
          var key = (row["Client Name"] || "") + "_" + (row["Month"] || "") + "_" + (row["Persona"] || "");
          structured[key] = [
            row["Outreach"],
            row["Connections"],
            row["Replies"],
            row["Meetings"],
            row["Proposals"],
            row["Contracts"]
          ].map(function (n) { return parseInt(n, 10) || 0; });
        });
        setData(structured);
      })
      .catch(function (e) { console.error("Read error:", e); });
  }, []);

  async function updateData(clientName, month, persona, counts) {
    var key = clientName + "_" + month + "_" + persona;
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
      }
    } catch (e) {
      console.error("Write error:", e);
    }
  }

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
}


