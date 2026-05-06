const serviceType = document.getElementById("serviceType");
const propertyName = document.getElementById("propertyName");
const districtInput = document.getElementById("districtInput");
const districtSuggestions = document.getElementById("districtSuggestions");

const liveProjectTitle = document.getElementById("liveProjectTitle");
const jobCardNo = document.getElementById("jobCardNo");
const shortCode = document.getElementById("shortCode");

const relationshipPills = document.querySelectorAll(".relationship-pill");
const relationshipDisplay = document.getElementById("relationshipDisplay");
const entityLabel = document.getElementById("entityLabel");
const entityName = document.getElementById("entityName");

const labourMethod = document.getElementById("labourMethod");
const startDate = document.getElementById("startDate");
const targetDate = document.getElementById("targetDate");
const actualDate = document.getElementById("actualDate");

const summaryProject = document.getElementById("summaryProject");
const summaryEntity = document.getElementById("summaryEntity");
const summaryLabour = document.getElementById("summaryLabour");
const summaryTimeline = document.getElementById("summaryTimeline");
const summaryShortCode = document.getElementById("summaryShortCode");

const previewBtn = document.getElementById("previewBtn");
const resetBtn = document.getElementById("resetBtn");
const previewModal = document.getElementById("previewModal");
const closePreviewBtn = document.getElementById("closePreviewBtn");

let selectedRelationship = "Client";

const sriLankanDistricts = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya"
];

function generateJobCardNumber() {
  const year = 2026;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `JC-${year}-${random}`;
}

function cleanWords(text) {
  return text
    .replace(/&/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function generateShortCode(service, property) {
  const serviceWords = cleanWords(service).split(" ").filter(Boolean);
  const propertyWords = cleanWords(property).split(" ").filter(Boolean);

  const serviceCode = serviceWords.slice(0, 2).map(word => word[0]?.toUpperCase() || "").join("");
  const propertyCode = propertyWords.slice(0, 2).map(word => word[0]?.toUpperCase() || "").join("");

  return `${serviceCode || "SV"}-${propertyCode || "PR"}-2026`;
}

function buildProjectTitle() {
  const service = serviceType.value.trim() || "Service";
  const property = propertyName.value.trim() || "Property";
  const district = districtInput.value.trim() || "District";
  return `${service} Works at ${property} at ${district}`;
}

function updateProjectData() {
  const projectTitle = buildProjectTitle();
  const code = generateShortCode(serviceType.value, propertyName.value);

  liveProjectTitle.textContent = projectTitle;
  shortCode.value = code;

  const start = formatDateForDisplay(startDate.value);
  const target = formatDateForDisplay(targetDate.value);
  const actual = formatDateForDisplay(actualDate.value);

  const timelineParts = [];
  if (start) timelineParts.push(`Start: ${start}`);
  if (target) timelineParts.push(`Target: ${target}`);
  if (actual) timelineParts.push(`Actual: ${actual}`);

  if (summaryProject) {
    summaryProject.textContent = projectTitle;
  }
  if (summaryEntity) {
    summaryEntity.textContent = entityName.value.trim()
      ? `${selectedRelationship}: ${entityName.value.trim()}`
      : "—";
  }
  if (summaryLabour) {
    summaryLabour.textContent = labourMethod.value || "—";
  }
  if (summaryShortCode) {
    summaryShortCode.textContent = code;
  }
  if (summaryTimeline) {
    summaryTimeline.textContent = timelineParts.length ? timelineParts.join(" | ") : "—";
  }
}

function formatDateForDisplay(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function updateRelationshipUI(newValue) {
  selectedRelationship = newValue;
  relationshipDisplay.textContent = newValue;
  entityLabel.textContent = `${newValue} Name`;

  relationshipPills.forEach(btn => {
    btn.classList.toggle("active-pill", btn.dataset.value === newValue);
  });

  updateProjectData();
}

function handleDistrictSuggestions() {
  const value = districtInput.value.trim().toLowerCase();

  if (!value) {
    districtSuggestions.innerHTML = "";
    districtSuggestions.classList.add("hidden");
    return;
  }

  const matches = sriLankanDistricts.filter(district =>
    district.toLowerCase().includes(value)
  );

  if (!matches.length) {
    districtSuggestions.innerHTML = "";
    districtSuggestions.classList.add("hidden");
    return;
  }

  districtSuggestions.innerHTML = matches
    .map(district => `<button type="button" data-district="${district}">${district}</button>`)
    .join("");

  districtSuggestions.classList.remove("hidden");
}

function toggleActualCompletionState() {
  if (startDate.value) {
    actualDate.disabled = false;
    actualDate.classList.remove("bg-slate-800/60", "text-slate-400", "cursor-not-allowed");
    actualDate.classList.add("bg-slate-900/70", "text-white");
  } else {
    actualDate.disabled = true;
    actualDate.value = "";
    actualDate.classList.add("bg-slate-800/60", "text-slate-400", "cursor-not-allowed");
    actualDate.classList.remove("bg-slate-900/70", "text-white");
  }
}

function openPreview() {
  const projectTitle = buildProjectTitle();
  const entityValue = entityName.value.trim();

  document.getElementById("previewProjectTitle").textContent = projectTitle;
  document.getElementById("previewJobCardNo").textContent = jobCardNo.value;
  document.getElementById("previewShortCode").textContent = shortCode.value;

  document.getElementById("previewClient").textContent =
    selectedRelationship === "Client" ? entityValue : "";
  document.getElementById("previewConsultant").textContent =
    selectedRelationship === "Consultant" ? entityValue : "";
  document.getElementById("previewContractor").textContent =
    selectedRelationship === "Contractor" ? entityValue : "";

  document.getElementById("previewStart").textContent = formatDateForDisplay(startDate.value);
  document.getElementById("previewTarget").textContent = formatDateForDisplay(targetDate.value);
  document.getElementById("previewActual").textContent = formatDateForDisplay(actualDate.value);
  document.getElementById("previewLabour").textContent = labourMethod.value || "";

  previewModal.classList.remove("hidden");
  previewModal.classList.add("flex");
}

function closePreview() {
  previewModal.classList.add("hidden");
  previewModal.classList.remove("flex");
}

function resetForm() {
  serviceType.value = "Waterproofing";
  propertyName.value = "";
  districtInput.value = "";
  entityName.value = "";
  labourMethod.value = "";
  startDate.value = "";
  targetDate.value = "";
  actualDate.value = "";

  updateRelationshipUI("Client");
  toggleActualCompletionState();
  updateProjectData();
}

function init() {
  jobCardNo.value = generateJobCardNumber();
  toggleActualCompletionState();
  updateProjectData();
}

serviceType.addEventListener("change", updateProjectData);
propertyName.addEventListener("input", updateProjectData);
districtInput.addEventListener("input", () => {
  handleDistrictSuggestions();
  updateProjectData();
});
entityName.addEventListener("input", updateProjectData);
labourMethod.addEventListener("change", updateProjectData);

startDate.addEventListener("change", () => {
  toggleActualCompletionState();
  updateProjectData();
});

targetDate.addEventListener("change", updateProjectData);
actualDate.addEventListener("change", updateProjectData);

relationshipPills.forEach(btn => {
  btn.addEventListener("click", () => {
    updateRelationshipUI(btn.dataset.value);
  });
});

districtSuggestions.addEventListener("click", (e) => {
  const button = e.target.closest("button[data-district]");
  if (!button) return;

  districtInput.value = button.dataset.district;
  districtSuggestions.classList.add("hidden");
  updateProjectData();
});

document.addEventListener("click", (e) => {
  if (!districtInput.contains(e.target) && !districtSuggestions.contains(e.target)) {
    districtSuggestions.classList.add("hidden");
  }
});

if (previewBtn) {
  previewBtn.addEventListener("click", openPreview);
}

if (closePreviewBtn) {
  closePreviewBtn.addEventListener("click", closePreview);
}

if (resetBtn) {
  resetBtn.addEventListener("click", resetForm);
}

if (previewModal) {
  previewModal.addEventListener("click", (e) => {
    if (e.target === previewModal) closePreview();
  });
}



init();


const addMaterialRowBtn = document.getElementById("addMaterialRowBtn");
const materialsTableBody = document.getElementById("materialsTableBody");

const materialsDB = {
  "Cement - 50kg": "Bags",
  "Sand": "Cube",
  "X Inject EP 200": "Ltr",
  "Masking tape": "Nos",
  "X pruf Elastocem (2 component)": "25kg bags",
  "X Shield Reinforcing Fabric": "Mtr",
  "Grinder wheel": "Nos",
  "Grinder": "Day",
  "Construction Grout": "Bags"
};

const materialNames = Object.keys(materialsDB);

const issueLogsMap = new Map();
let materialRowCounter = 0;
let currentIssueRowId = null;

function createMaterialRow(defaultData = {}) {
  const tr = document.createElement("tr");
  tr.className = "material-row";

  const rowId = `mat-row-${++materialRowCounter}`;
  tr.dataset.rowId = rowId;
  issueLogsMap.set(rowId, []);

  tr.innerHTML = `
    <td class="table-cell text-center">
      <div class="item-no-badge js-item-no">1</div>
    </td>

    <td class="table-cell">
      <div class="material-search-wrap">
        <input
          type="text"
          class="table-input js-material-input"
          placeholder="Search or type material..."
          value="${defaultData.material || ""}"
          autocomplete="off"
        />
        <div class="material-suggestions hidden js-material-suggestions"></div>
      </div>
    </td>

    <td class="table-cell">
      <input
        type="number"
        min="0"
        step="any"
        class="table-input js-allocated-input"
        placeholder="0"
        value="${defaultData.allocatedQty ?? ""}"
      />
    </td>

    <td class="table-cell">
      <span class="unit-badge js-unit-badge empty">—</span>
    </td>

    <td class="table-cell cumulative-issue-cell">
      <span class="js-cumulative-display cumulative-display">0</span>
      <div class="cumulative-btn-group">
        <button type="button" class="btn-issue-now">Issue Now</button>
        <button type="button" class="btn-view-list">View List</button>
      </div>
    </td>

    <td class="table-cell">
      <input
        type="text"
        readonly
        class="table-input readonly-input js-balance-input"
        placeholder="0"
      />
    </td>

    <td class="table-cell text-center">
      <button type="button" class="icon-btn js-delete-row" aria-label="Delete row">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18"></path>
          <path d="M8 6V4h8v2"></path>
          <path d="M19 6l-1 14H6L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
        </svg>
      </button>
    </td>
  `;

  materialsTableBody.appendChild(tr);
  bindMaterialRowEvents(tr);
  updateUnitBadge(tr);
  updateBalance(tr);
  reindexMaterialRows();
}

function reindexMaterialRows() {
  const rows = materialsTableBody.querySelectorAll(".material-row");
  rows.forEach((row, index) => {
    const itemNo = row.querySelector(".js-item-no");
    itemNo.textContent = index + 1;
  });
}

function parseNumber(value) {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

function updateUnitBadge(row) {
  const materialInput = row.querySelector(".js-material-input");
  const unitBadge = row.querySelector(".js-unit-badge");
  const selectedMaterial = materialInput.value.trim();

  if (materialsDB[selectedMaterial]) {
    unitBadge.textContent = materialsDB[selectedMaterial];
    unitBadge.classList.remove("empty");
  } else {
    unitBadge.textContent = "—";
    unitBadge.classList.add("empty");
  }
}

function getCumulativeIssued(rowId) {
  const logs = issueLogsMap.get(rowId) || [];
  return logs.reduce((sum, entry) => sum + entry.qty, 0);
}

function updateCumulativeDisplay(rowId) {
  const row = materialsTableBody.querySelector(`[data-row-id="${rowId}"]`);
  if (!row) return;
  const display = row.querySelector(".js-cumulative-display");
  const total = getCumulativeIssued(rowId);
  display.textContent = Number.isInteger(total) ? total : total.toFixed(2);
}

function formatDateTime(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

function updateBalance(row) {
  const allocatedInput = row.querySelector(".js-allocated-input");
  const balanceInput = row.querySelector(".js-balance-input");
  const rowId = row.dataset.rowId;

  const allocated = parseNumber(allocatedInput.value);
  const cumulative = rowId ? getCumulativeIssued(rowId) : 0;
  const balance = allocated - cumulative;

  balanceInput.value = Number.isInteger(balance) ? balance : balance.toFixed(2);

  if (balance < 0) {
    balanceInput.classList.add("balance-alert");
  } else {
    balanceInput.classList.remove("balance-alert");
  }
}

function showMaterialSuggestions(row, query) {
  const suggestionsBox = row.querySelector(".js-material-suggestions");
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.add("hidden");
    return;
  }

  const matches = materialNames.filter(name =>
    name.toLowerCase().includes(normalized)
  );

  if (!matches.length) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.add("hidden");
    return;
  }

  suggestionsBox.innerHTML = matches
    .map(name => `
      <button type="button" class="material-suggestion-btn" data-material="${name}">
        ${name}
      </button>
    `)
    .join("");

  suggestionsBox.classList.remove("hidden");
}

function hideSuggestions(row) {
  const suggestionsBox = row.querySelector(".js-material-suggestions");
  if (!suggestionsBox) return;
  suggestionsBox.classList.add("hidden");
}

function setActiveRow(row) {
  document.querySelectorAll(".material-row").forEach(r => r.classList.remove("active-row"));
  row.classList.add("active-row");
}

function bindMaterialRowEvents(row) {
  const materialInput = row.querySelector(".js-material-input");
  const allocatedInput = row.querySelector(".js-allocated-input");
  const suggestionsBox = row.querySelector(".js-material-suggestions");
  const deleteBtn = row.querySelector(".js-delete-row");
  const issueBtn = row.querySelector(".btn-issue-now");
  const viewBtn = row.querySelector(".btn-view-list");
  const rowId = row.dataset.rowId;

  materialInput.addEventListener("focus", () => {
    setActiveRow(row);
    showMaterialSuggestions(row, materialInput.value);
  });

  materialInput.addEventListener("input", () => {
    setActiveRow(row);
    showMaterialSuggestions(row, materialInput.value);
    updateUnitBadge(row);
  });

  allocatedInput.addEventListener("input", () => {
    setActiveRow(row);
    updateBalance(row);
  });

  issueBtn.addEventListener("click", () => openIssueNowModal(rowId));
  viewBtn.addEventListener("click", () => openViewListModal(rowId));

  suggestionsBox.addEventListener("click", (e) => {
    const button = e.target.closest("[data-material]");
    if (!button) return;

    materialInput.value = button.dataset.material;
    updateUnitBadge(row);
    updateBalance(row);
    hideSuggestions(row);
    materialInput.dispatchEvent(new Event("change"));
  });

  deleteBtn.addEventListener("click", () => {
    issueLogsMap.delete(rowId);
    row.remove();
    reindexMaterialRows();

    const remainingRows = materialsTableBody.querySelectorAll(".material-row");
    if (!remainingRows.length) {
      createMaterialRow();
    }
  });

  row.addEventListener("click", () => {
    setActiveRow(row);
  });

  row.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", () => setActiveRow(row));
  });
}

document.addEventListener("click", (e) => {
  if (!materialsTableBody) return;

  materialsTableBody.querySelectorAll(".material-row").forEach(row => {
    const wrap = row.querySelector(".material-search-wrap");
    if (!wrap) return;

    if (!wrap.contains(e.target)) {
      hideSuggestions(row);
    }
  });
});

addMaterialRowBtn.addEventListener("click", () => {
  createMaterialRow();
});

// --- Issue Tracking Modal Logic ---

function openIssueNowModal(rowId) {
  const row = materialsTableBody.querySelector(`[data-row-id="${rowId}"]`);
  if (!row) return;

  const materialName = row.querySelector(".js-material-input").value || "Unnamed Material";
  const allocated = parseNumber(row.querySelector(".js-allocated-input").value);
  const cumulative = getCumulativeIssued(rowId);
  const remaining = allocated - cumulative;

  document.getElementById("issueNowMaterialName").textContent = materialName;
  document.getElementById("issueNowBalanceInfo").textContent = `Available to issue: ${Number.isInteger(remaining) ? remaining : remaining.toFixed(2)}`;
  document.getElementById("issueQtyInput").value = "";
  document.getElementById("issueNowError").style.display = "none";

  currentIssueRowId = rowId;
  document.getElementById("issueNowModal").style.display = "flex";
  document.getElementById("issueQtyInput").focus();
}

function confirmIssue() {
  const input = document.getElementById("issueQtyInput");
  const errorEl = document.getElementById("issueNowError");
  const qty = parseFloat(input.value);

  if (!qty || qty <= 0) {
    errorEl.textContent = "Please enter a valid quantity greater than 0.";
    errorEl.style.display = "block";
    return;
  }

  const row = materialsTableBody.querySelector(`[data-row-id="${currentIssueRowId}"]`);
  if (!row) return;

  const allocated = parseNumber(row.querySelector(".js-allocated-input").value);
  const cumulative = getCumulativeIssued(currentIssueRowId);
  const remaining = allocated - cumulative;

  if (qty > remaining) {
    errorEl.textContent = `Cannot issue more than available balance (${Number.isInteger(remaining) ? remaining : remaining.toFixed(2)} remaining).`;
    errorEl.style.display = "block";
    return;
  }

  const logs = issueLogsMap.get(currentIssueRowId);
  logs.push({ qty: qty, datetime: formatDateTime(new Date()) });

  updateCumulativeDisplay(currentIssueRowId);
  updateBalance(row);
  closeModal(document.getElementById("issueNowModal"));
}

function openViewListModal(rowId) {
  const row = materialsTableBody.querySelector(`[data-row-id="${rowId}"]`);
  if (!row) return;

  const materialName = row.querySelector(".js-material-input").value || "Unnamed Material";
  document.getElementById("viewListMaterialName").textContent = materialName;

  const logs = issueLogsMap.get(rowId) || [];
  const tbody = document.getElementById("issueLogTableBody");
  const emptyMsg = document.getElementById("viewListEmpty");
  const table = document.getElementById("issueLogTable");

  tbody.innerHTML = "";

  if (!logs.length) {
    emptyMsg.style.display = "block";
    table.style.display = "none";
  } else {
    emptyMsg.style.display = "none";
    table.style.display = "table";
    logs.forEach((entry, i) => {
      const parts = entry.datetime.split(" ");
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${Number.isInteger(entry.qty) ? entry.qty : entry.qty.toFixed(2)}</td>
        <td>${parts[0]}</td>
        <td>${parts[1]}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("viewListModal").style.display = "flex";
}

function closeModal(modalEl) {
  modalEl.style.display = "none";
}

(function initModals() {
  const issueModal = document.getElementById("issueNowModal");
  const viewModal = document.getElementById("viewListModal");

  document.getElementById("confirmIssueBtn").addEventListener("click", confirmIssue);
  document.getElementById("cancelIssueBtn").addEventListener("click", () => closeModal(issueModal));
  document.getElementById("issueNowClose").addEventListener("click", () => closeModal(issueModal));
  document.getElementById("closeViewListBtn").addEventListener("click", () => closeModal(viewModal));
  document.getElementById("viewListClose").addEventListener("click", () => closeModal(viewModal));

  issueModal.addEventListener("click", (e) => { if (e.target === issueModal) closeModal(issueModal); });
  viewModal.addEventListener("click", (e) => { if (e.target === viewModal) closeModal(viewModal); });

  document.getElementById("issueQtyInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirmIssue();
  });
})();

if (materialsTableBody) {
  createMaterialRow({
    material: "Cement - 50kg",
    allocatedQty: 14
  });
}

const addToolRowBtn = document.getElementById("addToolRowBtn");
const toolsTableBody = document.getElementById("toolsTableBody");

const toolsDB = {
  "20L Empty Bucket": "Nos",
  "Grinder Machine (4.5'')": "Nos",
  "Cup Wheel (4.5'')": "Nos",
  "Cutting wheel 4.5 inch": "Nos",
  "Wire Code 50m": "Mtr",
  "Baby Drill machine (Speed control Machine)": "Nos",
  "Mixing Paddle": "Nos",
  "Hammer": "Nos",
  "Chissel": "Nos",
  "1L Measuring Cup": "Nos",
  "Coir Brush": "Nos",
  "Face Shield": "Nos",
  "Gogles": "Nos",
  "Rubber Gloves": "Pair",
  "Cotton Gloves": "Pair",
  "Safety Helmert": "Nos",
  "Safety Jacket": "Nos",
  "Safety Boots set": "Set",
  "Thinner": "Ltr",
  "Cotton Waste": "Kg",
  "Wire Brush": "Nos",
  "6\" Paint Brush": "Nos",
  "Hose for water injection to the core cut Machine": "Mtr",
  "Mason trowel (Normal)": "Nos",
  "Smallest size (1\") Mason trowel": "Nos",
  "1\" Brush": "Nos",
  "Hoe": "Nos",
  "Shovel": "Nos",
  "Roller Brush": "Nos",
  "Permenent Marker": "Nos",
  "Blower Machine": "Nos",
  "2\" Scraper": "Nos",
  "Ball Hammer": "Nos",
  "Empty Fertilizer Bag": "Nos",
  "Sealent Gun": "Nos"
};

const toolNames = Object.keys(toolsDB);

function createToolRow(defaultData = {}) {
  const tr = document.createElement("tr");
  tr.className = "material-row";

  tr.innerHTML = `
    <td class="table-cell text-center">
      <div class="item-no-badge js-tool-item-no">1</div>
    </td>

    <td class="table-cell">
      <div class="material-search-wrap">
        <input
          type="text"
          class="table-input js-tool-input"
          placeholder="Search or type tool / machinery..."
          value="${defaultData.tool || ""}"
          autocomplete="off"
        />
        <div class="material-suggestions hidden js-tool-suggestions"></div>
      </div>
    </td>

    <td class="table-cell">
      <input
        type="number"
        min="0"
        step="any"
        class="table-input js-tool-allocated-input"
        placeholder="0"
        value="${defaultData.allocatedQty ?? ""}"
      />
    </td>

    <td class="table-cell">
      <span class="unit-badge js-tool-unit-badge empty">—</span>
    </td>

    <td class="table-cell">
      <input
        type="number"
        min="0"
        step="any"
        class="table-input js-tool-cumulative-input"
        placeholder="0"
        value="${defaultData.cumulativeIssuedQty ?? ""}"
      />
    </td>

    <td class="table-cell">
      <input
        type="number"
        min="0"
        step="any"
        class="table-input js-tool-used-input"
        placeholder="0"
        value="${defaultData.usedQty ?? ""}"
      />
    </td>

    <td class="table-cell">
      <input
        type="text"
        readonly
        class="table-input readonly-input js-tool-balance-input"
        placeholder="0"
      />
    </td>

    <td class="table-cell text-center">
      <button type="button" class="icon-btn js-tool-delete-row" aria-label="Delete row">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18"></path>
          <path d="M8 6V4h8v2"></path>
          <path d="M19 6l-1 14H6L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
        </svg>
      </button>
    </td>
  `;

  toolsTableBody.appendChild(tr);
  bindToolRowEvents(tr);
  updateToolUnitBadge(tr);
  updateToolBalance(tr);
  reindexToolRows();
}

function reindexToolRows() {
  const rows = toolsTableBody.querySelectorAll(".material-row");
  rows.forEach((row, index) => {
    const itemNo = row.querySelector(".js-tool-item-no");
    itemNo.textContent = index + 1;
  });
}

function updateToolUnitBadge(row) {
  const toolInput = row.querySelector(".js-tool-input");
  const unitBadge = row.querySelector(".js-tool-unit-badge");
  const selectedTool = toolInput.value.trim();

  if (toolsDB[selectedTool]) {
    unitBadge.textContent = toolsDB[selectedTool];
    unitBadge.classList.remove("empty");
  } else {
    unitBadge.textContent = "—";
    unitBadge.classList.add("empty");
  }
}

function updateToolBalance(row) {
  const allocatedInput = row.querySelector(".js-tool-allocated-input");
  const usedInput = row.querySelector(".js-tool-used-input");
  const balanceInput = row.querySelector(".js-tool-balance-input");

  const allocated = parseNumber(allocatedInput.value);
  const used = parseNumber(usedInput.value);
  const balance = allocated - used;

  balanceInput.value = Number.isInteger(balance) ? balance : balance.toFixed(2);

  if (balance < 0) {
    balanceInput.classList.add("balance-alert");
  } else {
    balanceInput.classList.remove("balance-alert");
  }
}

function showToolSuggestions(row, query) {
  const suggestionsBox = row.querySelector(".js-tool-suggestions");
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.add("hidden");
    return;
  }

  const matches = toolNames.filter(name =>
    name.toLowerCase().includes(normalized)
  );

  if (!matches.length) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.add("hidden");
    return;
  }

  suggestionsBox.innerHTML = matches
    .map(name => `
      <button type="button" class="material-suggestion-btn" data-tool="${name}">
        ${name}
      </button>
    `)
    .join("");

  suggestionsBox.classList.remove("hidden");
}

function hideToolSuggestions(row) {
  const suggestionsBox = row.querySelector(".js-tool-suggestions");
  if (!suggestionsBox) return;
  suggestionsBox.classList.add("hidden");
}

function bindToolRowEvents(row) {
  const toolInput = row.querySelector(".js-tool-input");
  const allocatedInput = row.querySelector(".js-tool-allocated-input");
  const usedInput = row.querySelector(".js-tool-used-input");
  const cumulativeInput = row.querySelector(".js-tool-cumulative-input");
  const suggestionsBox = row.querySelector(".js-tool-suggestions");
  const deleteBtn = row.querySelector(".js-tool-delete-row");



   toolInput.addEventListener("focus", () => {
    setActiveToolRow(row);
    showToolSuggestions(row, toolInput.value);
  });

  toolInput.addEventListener("input", () => {
    setActiveToolRow(row);
    showToolSuggestions(row, toolInput.value);
    updateToolUnitBadge(row);
  });

  allocatedInput.addEventListener("input", () => {
    setActiveToolRow(row);
    updateToolBalance(row);
  });

  usedInput.addEventListener("input", () => {
    setActiveToolRow(row);
    updateToolBalance(row);
  });

  cumulativeInput.addEventListener("input", () => {
    setActiveToolRow(row);
  });

  suggestionsBox.addEventListener("click", (e) => {
    const button = e.target.closest("[data-tool]");
    if (!button) return;

    toolInput.value = button.dataset.tool;
    updateToolUnitBadge(row);
    updateToolBalance(row);
    hideToolSuggestions(row);
    toolInput.dispatchEvent(new Event("change"));
  });

  deleteBtn.addEventListener("click", () => {
    row.remove();
    reindexToolRows();

    const remainingRows = toolsTableBody.querySelectorAll(".material-row");
    if (!remainingRows.length) {
      createToolRow();
    }
  });

  row.addEventListener("click", () => {
    setActiveToolRow(row);
  });

  row.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", () => setActiveToolRow(row));
  });
}

function setActiveToolRow(row) {
  toolsTableBody.querySelectorAll(".material-row").forEach(r => r.classList.remove("active-row"));
  row.classList.add("active-row");
}

document.addEventListener("click", (e) => {
  toolsTableBody.querySelectorAll(".material-row").forEach(row => {
    const wrap = row.querySelector(".material-search-wrap");
    if (!wrap.contains(e.target)) {
      hideToolSuggestions(row);
    }
  });
});

addToolRowBtn.addEventListener("click", () => {
  createToolRow();
});

if (toolsTableBody) {
  createToolRow({
    tool: "20L Empty Bucket",
    allocatedQty: 2,
    cumulativeIssuedQty: "",
    usedQty: ""
  });
}

const remarksInput = document.getElementById("remarksInput");

const preparedByDate = document.getElementById("preparedByDate");
const preparedByName = document.getElementById("preparedByName");
const preparedBySuggestions = document.getElementById("preparedBySuggestions");

const approvedByDate = document.getElementById("approvedByDate");
const approvedByName = document.getElementById("approvedByName");
const approvedBySuggestions = document.getElementById("approvedBySuggestions");

const sriLankanNames = [
  "Anjana Perera",
  "Prageeth Fernando",
  "Kasun Silva",
  "Nadeesha Jayawardena",
  "Sahan Kumara",
  "Ishara Madushani",
  "Chamara Wijesinghe",
  "Tharindu Lakshan",
  "Dilshan Peris",
  "Ashan Fernando",
  "Dinesh Rathnayake",
  "Kavindi Sewwandi",
  "Madhusha Perera",
  "Chathura Sandaruwan",
  "Supun Nishan",
  "Rashmi Fernando",
  "Dinuka Jayasinghe",
  "Sachini Peiris",
  "Isuru Maduranga",
  "Udari Wickramasinghe",
  "Nipun Abeysekara",
  "Sanduni Perera",
  "Raveen Senanayake",
  "Thilini Rajapaksha",
  "Bhanuka Kariyawasam"
];

function formatDateForInput(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function showNameSuggestions(inputEl, suggestionEl, query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    suggestionEl.innerHTML = "";
    suggestionEl.classList.add("hidden");
    return;
  }

  const matches = sriLankanNames.filter(name =>
    name.toLowerCase().includes(normalized)
  );

  if (!matches.length) {
    suggestionEl.innerHTML = "";
    suggestionEl.classList.add("hidden");
    return;
  }

  suggestionEl.innerHTML = matches
    .map(name => `<button type="button" class="person-suggestion-btn" data-name="${name}">${name}</button>`)
    .join("");

  suggestionEl.classList.remove("hidden");
}

function hideNameSuggestions(suggestionEl) {
  suggestionEl.classList.add("hidden");
}

function bindNameAutocomplete(inputEl, suggestionEl) {
  inputEl.addEventListener("focus", () => {
    showNameSuggestions(inputEl, suggestionEl, inputEl.value);
  });

  inputEl.addEventListener("input", () => {
    showNameSuggestions(inputEl, suggestionEl, inputEl.value);
  });

  suggestionEl.addEventListener("click", (e) => {
    const button = e.target.closest("[data-name]");
    if (!button) return;

    inputEl.value = button.dataset.name;
    hideNameSuggestions(suggestionEl);
  });
}

bindNameAutocomplete(preparedByName, preparedBySuggestions);
bindNameAutocomplete(approvedByName, approvedBySuggestions);

document.addEventListener("click", (e) => {
  const preparedWrap = preparedByName.parentElement;
  const approvedWrap = approvedByName.parentElement;

  if (!preparedWrap.contains(e.target)) {
    hideNameSuggestions(preparedBySuggestions);
  }

  if (!approvedWrap.contains(e.target)) {
    hideNameSuggestions(approvedBySuggestions);
  }
});

preparedByDate.value = formatDateForInput();
approvedByDate.value = formatDateForInput();

preparedByName.value = "Anjana Perera";
approvedByName.value = "Prageeth Fernando";
remarksInput.value = "Tool list to be sent by PM.";

const deleteBtn = document.getElementById("deleteBtn");
const saveDraftBtn = document.getElementById("saveDraftBtn");
const printPdfBtn = document.getElementById("printPdfBtn");
const publishBtn = document.getElementById("publishBtn");

function safeText(value) {
  return value && String(value).trim() ? String(value).trim() : "-";
}

function getRelationshipValues() {
  const entity = safeText(entityName?.value);
  return {
    client: selectedRelationship === "Client" ? entity : "-",
    consultant: selectedRelationship === "Consultant" ? entity : "-",
    contractor: selectedRelationship === "Contractor" ? entity : "-"
  };
}

function buildPrintRowsFromTable(type = "materials") {
  let rows = [];

  if (type === "materials" && materialsTableBody) {
    const materialRows = materialsTableBody.querySelectorAll(".material-row");
    materialRows.forEach((row, index) => {
      rows.push({
        no: index + 1,
        description: safeText(row.querySelector(".js-material-input")?.value),
        allocated: safeText(row.querySelector(".js-allocated-input")?.value),
        unit: safeText(row.querySelector(".js-unit-badge")?.textContent).replace("—", "-"),
        cumulative: safeText(row.querySelector(".js-cumulative-display")?.textContent),
        balance: safeText(row.querySelector(".js-balance-input")?.value)
      });
    });
  }

  if (type === "tools" && toolsTableBody) {
    const toolRows = toolsTableBody.querySelectorAll(".material-row");
    toolRows.forEach((row, index) => {
      rows.push({
        no: index + 1,
        description: safeText(row.querySelector(".js-tool-input")?.value),
        allocated: safeText(row.querySelector(".js-tool-allocated-input")?.value),
        unit: safeText(row.querySelector(".js-tool-unit-badge")?.textContent).replace("—", "-"),
        cumulative: safeText(row.querySelector(".js-tool-cumulative-input")?.value),
        used: safeText(row.querySelector(".js-tool-used-input")?.value),
        balance: safeText(row.querySelector(".js-tool-balance-input")?.value)
      });
    });
  }

  return rows;
}

function renderPrintTableRows(targetBodyId, rows, emptyMessage, type) {
  const tbody = document.getElementById(targetBodyId);
  if (!tbody) return;

  const cols = type === "materials" ? 6 : 7;

  if (!rows.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="${cols}" class="empty-print-row">${emptyMessage}</td>
      </tr>
    `;
    return;
  }

  if (type === "materials") {
    tbody.innerHTML = rows.map(row => `
      <tr>
        <td>${row.no}</td>
        <td>${row.description}</td>
        <td>${row.allocated}</td>
        <td>${row.unit}</td>
        <td>${row.cumulative}</td>
        <td>${row.balance}</td>
      </tr>
    `).join("");
  } else {
    tbody.innerHTML = rows.map(row => `
      <tr>
        <td>${row.no}</td>
        <td>${row.description}</td>
        <td>${row.allocated}</td>
        <td>${row.unit}</td>
        <td>${row.cumulative}</td>
        <td>${row.used}</td>
        <td>${row.balance}</td>
      </tr>
    `).join("");
  }
}

function populatePrintLayout() {
  const relationshipValues = getRelationshipValues();

  document.getElementById("printJobCardNo").textContent = safeText(jobCardNo?.value);
  document.getElementById("printShortCode").textContent = safeText(shortCode?.value);
  document.getElementById("printProjectTitle").textContent = safeText(buildProjectTitle());
  document.getElementById("printServiceType").textContent = safeText(serviceType?.value);
  document.getElementById("printDistrict").textContent = safeText(districtInput?.value);
  document.getElementById("printPropertyName").textContent = safeText(propertyName?.value);
  document.getElementById("printLabourMethod").textContent = safeText(labourMethod?.value);

  document.getElementById("printClientName").textContent = relationshipValues.client;
  document.getElementById("printConsultantName").textContent = relationshipValues.consultant;
  document.getElementById("printContractorName").textContent = relationshipValues.contractor;
  document.getElementById("printRelationshipType").textContent = safeText(selectedRelationship);

  document.getElementById("printStartDate").textContent = safeText(formatDateForDisplay(startDate?.value));
  document.getElementById("printTargetDate").textContent = safeText(formatDateForDisplay(targetDate?.value));
  document.getElementById("printActualDate").textContent = safeText(formatDateForDisplay(actualDate?.value));

  const materialRows = buildPrintRowsFromTable("materials");
  const toolRows = buildPrintRowsFromTable("tools");

  renderPrintTableRows("printMaterialsBody", materialRows, "No material items added", "materials");
  renderPrintTableRows("printToolsBody", toolRows, "No tools or machinery items added", "tools");

  document.getElementById("printRemarks").textContent = safeText(remarksInput?.value);
  document.getElementById("printPreparedByName").textContent = safeText(preparedByName?.value);
  document.getElementById("printPreparedByDate").textContent = safeText(formatDateForDisplay(preparedByDate?.value));
  document.getElementById("printApprovedByName").textContent = safeText(approvedByName?.value);
  document.getElementById("printApprovedByDate").textContent = safeText(formatDateForDisplay(approvedByDate?.value));
}

function handlePrintPdf() {
  console.log("PRINT CLICKED");
  populatePrintLayout();
  window.print();
}

function handleMockAction(actionName) {
  alert(`${actionName} is a mock action for this prototype.`);
}

function handleDeleteMock() {
  const confirmed = confirm("This Delete button is a mock action for the prototype. Do you want to continue?");
  if (confirmed) {
    alert("Delete is currently a mock action.");
  }
}

if (printPdfBtn) {
  printPdfBtn.addEventListener("click", handlePrintPdf);
}

if (saveDraftBtn) {
  saveDraftBtn.addEventListener("click", () => handleMockAction("Save as Draft"));
}

if (publishBtn) {
  publishBtn.addEventListener("click", () => handleMockAction("Publish"));
}

if (deleteBtn) {
  deleteBtn.addEventListener("click", handleDeleteMock);
}