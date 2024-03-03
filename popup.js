"use strict";

browser.runtime.sendMessage({ action: "getRootCertStats" }, response => {
  displayTable(response.certStats);
});


function displayTable(certStats) {
  let entries = Object.keys(certStats);
  if (entries.length > 0) {  
    let noData = document.querySelector(".no-data");
    noData.classList.add("hidden");
    let entryTable = document.querySelector(".root-cert-table");
    entryTable.classList.remove("hidden");
  
    for (let entry of entries) {
      let entryTR = document.createElement("tr");
      let entryName =  document.createElement("td");
      let entryValue =  document.createElement("td");
      entryName.textContent = entry;
      entryValue.textContent = certStats[entry];
  
      entryTR.appendChild(entryName);
      entryTR.appendChild(entryValue);
      entryTable.appendChild(entryTR);
    }
  }
}
