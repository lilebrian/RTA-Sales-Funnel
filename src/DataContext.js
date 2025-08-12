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

export function DataProvider(props) {
  const children = props.children;
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
    return fetch(url,
