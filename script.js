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

const stockProductsDB = {
  "10 X 90MM BOLT HDG": { unit: "NOS", price: 180.5 },
  "6MM CARRIAGE BOLT WITH NUT AND WASHER": { unit: "NOS", price: 120.34 },
  "M10 HDG FLAT WASHERS": { unit: "NOS", price: 8.21 },
  "M10 HDG THREADED BAR": { unit: "NOS", price: 670.72 },
  "M8 HDG FLAT WASHERS": { unit: "NOS", price: 5.48 },
  "M8 GALVANIZED DROP IN ANCHOR": { unit: "NOS", price: 57.49 },
  "M8 HDG HEXAGON NUT": { unit: "NOS", price: 8.21 },
  "M10 HDG HEXAGON NUT": { unit: "NOS", price: 19.16 },
  "10MM HDG DROP ANCHOR": { unit: "NOS", price: 0.0 },
  "M8 HDG THREADED BAR": { unit: "NOS", price: 533.84 },
  "M12 ELECTRO GALVANIZED DROP IN ACHORS": { unit: "NOS", price: 120.46 },
  "M12 HDG FLAT WASHERS": { unit: "NOS", price: 10.95 },
  "M12 HDG HEXAGON NUTS": { unit: "NOS", price: 30.11 },
  "M12 HDG THREADED BAR": { unit: "NOS", price: 1081.36 },
  "160MM U BOLT - HDG": { unit: "NOS", price: 0.0 },
  "M10 DROP ANCHOR": { unit: "NOS", price: 70.98 },
  "1/2\" SPLIT CLAMP WITH EPDM RUBBER LINING 20MM": { unit: "NOS", price: 85.94 },
  "2 1/2\" SPLIT CLAMP CLAMP WITH EPDM RUBBER LIING": { unit: "NOS", price: 215.67 },
  "110MM DIA HDG PIPE CLAMP": { unit: "NOS", price: 427.07 },
  "160MM DIA HDG PIPE CLAMP": { unit: "NOS", price: 535.78 },
  "200MM HDG SLIPT CLAMP WITH LINNNG": { unit: "NOS", price: 848.66 },
  "20MM DIA HDG PIPE CLAMP": { unit: "NOS", price: 136.74 },
  "225MM HDG SLIPT CLAMP WITH LINNNG": { unit: "NOS", price: 873.59 },
  "25MM HDG SLIPT CLAMP WITH LINNNG": { unit: "NOS", price: 153.31 },
  "280MM HDG SLIPT CLAMP WITH LINNNG": { unit: "NOS", price: 1223.57 },
  "32MM DIA HDG PIPE CLAMP": { unit: "NOS", price: 172.47 },
  "40MM HDG SLIPT CLAMP WITH LINNNG": { unit: "NOS", price: 197.1 },
  "50MM DIA HDG PIPE CLAMP": { unit: "NOS", price: 219.06 },
  "54MM HDG CLAMP": { unit: "NOS", price: 0.0 },
  "63MM DIA HDG PIPE CLAMP": { unit: "NOS", price: 275.0 },
  "75MM HDG SLIPT CLAMP WITH LINNNG": { unit: "NOS", price: 287.45 },
  "90MM HDG SLIPT CLAMP WITH LINNNG": { unit: "NOS", price: 369.64 },
  "10MM HDG THREADED BAR 2M": { unit: "NOS", price: 0.0 },
  "110MM U BOLT HDG": { unit: "NOS", price: 932.6 },
  "160MM U BOLT HDG": { unit: "NOS", price: 1263.52 },
  "32MM U BOLT HDG": { unit: "NOS", price: 361.01 },
  "75MM U BOLT HDG": { unit: "NOS", price: 887.47 },
  "X SHIELD FLEX PRUF LIQUID COMPONENT 5 KG": { unit: "KG", price: 0.0 },
  "X SHIELD FLEX PRUF POWDER COMPONENT 17 KG": { unit: "NOS", price: 0.0 },
  "X TITE CONSTRUCTION GROUT 25KG (INNOVATE PRODUCTION)": { unit: "NOS", price: 0.0 },
  "99MS -61186-01BI Guard  1200Liner": { unit: "NOS", price: 1771255.85 },
  "C7W M 16 Diamond Saw  1200x4.6x60": { unit: "NOS", price: 355228.05 },
  "99ms-60136-05 V Swivel Track Foot": { unit: "NOS", price: 310824.54 },
  "C7W M 16 Diamond Saw  800X4.6X60": { unit: "NOS", price: 177614.03 },
  "10992000-FSEB11P/400V16A50Hz": { unit: "NOS", price: 0.0 },
  "34670493-EOGU 800mm Universal Blade 800x10x25.4m": { unit: "NOS", price: 0.0 },
  "FSE811P/400V16A50Hz": { unit: "NOS", price: 2484642.11 },
  "EOGU 800mm Universala Blade 800x10x25.4m": { unit: "NOS", price: 0.0 },
  "DRYTEX PU": { unit: "NOS", price: 37061.92 },
  "DRYTEX PU400": { unit: "NOS", price: 47163.4 },
  "DRYTEX P2000": { unit: "KG", price: 2688.39 },
  "Flamebar BW 11 35 Kg": { unit: "NOS", price: 67667.57 },
  "FLAMEBAR INTUMESCENT ACRYLIC SEALNT 310ML": { unit: "NOS", price: 800.0 },
  "FLAMEBAR CLASS C 15MM X  6MM X 15 METRES (GASKET)": { unit: "m", price: -317.9 },
  "BETOFLEX TROCHORN ROLL PBS (4MM X 1M X 10M)": { unit: "ROLL", price: 12367.8 },
  "BETOFLEX TROCHORN ROLL SLATED GRANULAR (4MM X 1M X 10M)": { unit: "ROLL", price: 16102.73 },
  "KIT, REPAIR, A CARTRIDGE": { unit: "EA", price: 0.0 },
  "KIT, REPAIR, B CARTRIDGE": { unit: "EA", price: 0.0 },
  "KIT, REPAIR, CKECK VALVE, ISO": { unit: "EA", price: 0.0 },
  "KIT, REPAIR, CKECK VALVE, ASSY": { unit: "EA", price: 0.0 },
  "KIT, BULK, CK VLV RAD SEAL": { unit: "EA", price: 0.0 },
  "KIT, BULK, CK VLV FACE ORING": { unit: "EA", price: 0.0 },
  "BULK O-RING KIT": { unit: "EA", price: 0.0 },
  "SEAL O-RING, 6 PACK": { unit: "EA", price: 0.0 },
  "KIT, REPAIR, CARTRIDGE SEAL": { unit: "EA", price: 0.0 },
  "KIT, REPAIR, SCREEN, 40 MESH": { unit: "EA", price: 0.0 },
  "SPRING, CHECK VALVE": { unit: "EA", price: 0.0 },
  "PIN, VISE": { unit: "EA", price: 0.0 },
  "KIT, DRILL, FUSION": { unit: "EA", price: 0.0 },
  "SENSOR PRESSURE, FLUID OUTLET": { unit: "EA", price: 0.0 },
  "KIT, HEATER RTD": { unit: "EA", price: 0.0 },
  "KIT, FTS, RTD, SINGLE, HOSE": { unit: "EA", price: 0.0 },
  "DRYER, CARTRIDGE": { unit: "EA", price: 0.0 },
  "MANIFOLD, ASSEMBLY": { unit: "EA", price: 0.0 },
  "JACKET, SCUFF, 50FT": { unit: "EA", price: 0.0 },
  "KIT, LUBRICANT, FUSION, 10PK": { unit: "EA", price: 0.0 },
  "WOODEN PALLETS": { unit: "NOS", price: 750.0 },
  "AKZO NOBEL INTERGRAVEL 4.25L": { unit: "NOS", price: 2600.0 },
  "BABY ROLL": { unit: "NOS", price: 147.1 },
  "BACKER ROD 12MM": { unit: "m", price: 29.0 },
  "BACKER ROD 10MM": { unit: "m", price: 29.0 },
  "BACKER ROD 15MM": { unit: "m", price: 14.66 },
  "BACKER ROD 30MM": { unit: "m", price: 70.0 },
  "HEMPATHALE TOP COAT 55210": { unit: "NOS", price: 0.0 },
  "PAINT BRUSH 1/2\"": { unit: "NOS", price: 120.0 },
  "PAINT BRUSH 1\"": { unit: "NOS", price: 320.6 },
  "PAINT BRUSH 2\"": { unit: "NOS", price: 405.49 },
  "PAINT BRUSH 3\"": { unit: "NOS", price: 610.05 },
  "PAINT BRUSH 4\"": { unit: "NOS", price: 876.44 },
  "PAINT BRUSH 5\"": { unit: "NOS", price: 1175.0 },
  "PAINT HANDLE": { unit: "NOS", price: 250.0 },
  "CHRYSO TL 420": { unit: "KG", price: 2002.01 },
  "CHRYSO TP 422": { unit: "NOS", price: 173.61 },
  "SIKA TOP SEAL 109 - MY": { unit: "NOS", price: 11268.0 },
  "THINNER": { unit: "LTR", price: 559.34 },
  "TOKYO SUPER BOND (TILE ADHESIVE)25 KG": { unit: "NOS", price: 1413.0 },
  "PURE INJECT 1C 115 ECO CAT": { unit: "NOS", price: 8350.0 },
  "CHRYSO EXCEM PMC 40": { unit: "NOS", price: 3800.0 },
  "TROCHORN ROLL": { unit: "NOS", price: 5038.0 },
  "DI OCTYL PHTHALATE (DOP)": { unit: "LTR", price: 944.01 },
  "KETONE - MK SL - SINGAP (MEK)": { unit: "LTR", price: 969.41 },
  "4 1/2\" DIAMOND CUTTING WHEEL": { unit: "NOS", price: 1167.17 },
  "PLYWOOD SHEET  8X4 - 5MM": { unit: "NOS", price: 2550.0 },
  "PLYWOOD SHEET  8X4 - 18MM": { unit: "NOS", price: 6290.0 },
  "4\" MASON TROWEL": { unit: "NOS", price: 345.0 },
  "STRIP LEVEL": { unit: "NOS", price: 900.0 },
  "PLASTIC BASKET": { unit: "NOS", price: 650.0 },
  "HOSE JOINT": { unit: "NOS", price: 30.0 },
  "HOSE NOZZEL": { unit: "NOS", price: 52.0 },
  "HOSE CLIP": { unit: "NOS", price: 42.73 },
  "PAD LOCKS": { unit: "NOS", price: 455.44 },
  "PLASTIC BUCKET 11L": { unit: "NOS", price: 201.2 },
  "PLASTIC BUCKET 5L EMPTY": { unit: "NOS", price: 220.0 },
  "PLASTIC BUCKET 20L EMPTY": { unit: "NOS", price: 630.0 },
  "8*2 STF SS (A2-304)": { unit: "NOS", price: 16.2 },
  "8*3/4 SDF": { unit: "NOS", price: 3.6 },
  "POLYTHENE": { unit: "KG", price: 241.64 },
  "SCREW  6X 1 1/2 (CIK)": { unit: "NOS", price: 8.2 },
  "SCREW 8X 1 1/2 (CSk)": { unit: "NOS", price: 12.93 },
  "INDUSTRIAL INSULATION FEMALE SOCKET (3PIN) 16A": { unit: "NOS", price: 1005.77 },
  "INDUSTRIAL INSULATION SOCKET ( 4 PIN)": { unit: "NOS", price: 1500.0 },
  "BROOM": { unit: "NOS", price: 366.97 },
  "WIPER": { unit: "NOS", price: 275.0 },
  "SEALENT GUN": { unit: "NOS", price: 0.0 },
  "2\" CONCRETE NAILS": { unit: "NOS", price: 0.0 },
  "SCISSOR": { unit: "NOS", price: 552.2 },
  "PLASTIC BASIN 60L": { unit: "NOS", price: 1780.0 },
  "SPONCH PIECE": { unit: "NOS", price: 60.93 },
  "FLOOR CARPET - HEAVY DUTY": { unit: "NOS", price: 12670.0 },
  "EAR PLUG": { unit: "NOS", price: 95.21 },
  "LADDER 10FT": { unit: "NOS", price: 17238.26 },
  "FAN HOOKS - 12MM": { unit: "NOS", price: 200.0 },
  "INDUSTRIAL INSULATION MALE SOCKET - 3 PIN - 16A": { unit: "NOS", price: 681.33 },
  "INDSTRIAL INSULATION FEMALE SOCKET- 3 PIN 16A": { unit: "NOS", price: 1041.67 },
  "GAS TANK 12.KG": { unit: "NOS", price: 4115.0 },
  "PLUG BASE 13A": { unit: "NOS", price: 731.09 },
  "SAFETY SHOES": { unit: "NOS", price: 6138.63 },
  "OVERALL KIT": { unit: "NOS", price: 3215.83 },
  "LEATHER GLOVES": { unit: "NOS", price: 1500.0 },
  "MEASURING CUP 1L": { unit: "NOS", price: 372.32 },
  "COTTON GLOVES": { unit: "NOS", price: 75.19 },
  "MEASURING TAPE": { unit: "NOS", price: 900.0 },
  "SCREW SS 316 35MM": { unit: "NOS", price: 0.0 },
  "MASKING TAPE 2\"": { unit: "NOS", price: 334.63 },
  "SAFETY JACKET - GREEN": { unit: "NOS", price: 279.34 },
  "PERMANENT MARKER PEN": { unit: "NOS", price: 112.53 },
  "KNIFE 8\"": { unit: "NOS", price: 624.16 },
  "PAPER CUTTER": { unit: "NOS", price: 67.5 },
  "DUST MASK OXYPURA": { unit: "NOS", price: 6000.0 },
  "RUBBER GLOVES": { unit: "NOS", price: 80.3 },
  "CHRYSO EXCEM PMC 60 (25KG BAG)": { unit: "NOS", price: 3559.33 },
  "PLUG TOP 13A": { unit: "NOS", price: 378.78 },
  "GRINDER BRUSH": { unit: "NOS", price: 578.57 },
  "FUNNEL": { unit: "NOS", price: 540.0 },
  "MASON TROWEL 6\"": { unit: "NOS", price: 388.87 },
  "MASON TROWEL 8\"": { unit: "NOS", price: 460.0 },
  "MASON TROWEL 10\"": { unit: "NOS", price: 490.0 },
  "POTTY SCRAPER 10\"": { unit: "NOS", price: 650.0 },
  "COMBINATION PLIER": { unit: "NOS", price: 903.29 },
  "MASKING TAPE 1\"": { unit: "NOS", price: 111.7 },
  "LED BULB": { unit: "NOS", price: 750.0 },
  "CLEAR TAPE": { unit: "NOS", price: 316.31 },
  "4.5 FLAP DISC": { unit: "NOS", price: 159.21 },
  "3 CORE WIRE": { unit: "m", price: 259.12 },
  "PAINT ROLLER BRUSH 9\"": { unit: "NOS", price: 556.37 },
  "BALL PIN HAMMER": { unit: "NOS", price: 1757.57 },
  "4 FEET SPRIT LEAVE": { unit: "NOS", price: 4750.0 },
  "SDS PLUS HILTY BIT": { unit: "NOS", price: 850.0 },
  "SURGICAL MASK": { unit: "NOS", price: 42.73 },
  "PLASTIC BOTTLE": { unit: "NOS", price: 70.0 },
  "NAILS": { unit: "NOS", price: 3.0 },
  "KONDI PATTAM": { unit: "NOS", price: 380.0 },
  "HINGERS": { unit: "NOS", price: 150.0 },
  "CEBRIS BAG": { unit: "NOS", price: 60.0 },
  "SINGLE DOT COTTON GLOVES": { unit: "NOS", price: 93.93 },
  "DRILL BRUSH": { unit: "NOS", price: 550.0 },
  "SCREW DRIVE FLAT": { unit: "NOS", price: 561.09 },
  "SCREW DRIVE PHILIP": { unit: "NOS", price: 494.52 },
  "SCREW BITS": { unit: "NOS", price: 175.0 },
  "PACKING TAPE 2\"": { unit: "NOS", price: 363.22 },
  "POLYTHENE BAG": { unit: "NOS", price: 11.33 },
  "FIVE BUCKLE JACKET GREEN": { unit: "NOS", price: 900.0 },
  "SDS HILTY DRILL BIT": { unit: "NOS", price: 1100.0 },
  "6MM DRILL BIT SDS PLUS": { unit: "NOS", price: 152.2 },
  "17MM HEX FLAT CHISEL": { unit: "NOS", price: 598.5 },
  "17MM HEX POINTED CHISEL": { unit: "NOS", price: 750.0 },
  "VALVE SOCKET": { unit: "NOS", price: 2150.0 },
  "SANSTHA CEMENT": { unit: "NOS", price: 0.0 },
  "GREASE NOZZEL": { unit: "NOS", price: 126.0 },
  "SILICON GUN": { unit: "NOS", price: 1050.0 },
  "EMPTY TIN 1/2L": { unit: "NOS", price: 95.29 },
  "6MM WALL BRACKET NUT": { unit: "NOS", price: 6.0 },
  "DECK BRUSH": { unit: "NOS", price: 450.0 },
  "CUTTER BLADE": { unit: "NOS", price: 25.0 },
  "3/4 FLAT ALUMINIUM STRIP": { unit: "NOS", price: 325.37 },
  "1 1/2*8 STF SS (A2-304)": { unit: "NOS", price: 15.0 },
  "DULUX BUTTER MILK 1L (PAINT)": { unit: "NOS", price: 2300.0 },
  "DULUX ULTRA FILLER 1L (PAINT)": { unit: "NOS", price: 965.75 },
  "DULUX PURE WHITE 1L (PAINT)": { unit: "NOS", price: 2277.0 },
  "DULUX BUTTER MILK 4L (PAINT)": { unit: "NOS", price: 7461.0 },
  "CHRYSO CRYSTAL SEAL (20KG BAG)": { unit: "NOS", price: 18382.5 },
  "BABY ROLL HANDLE": { unit: "NOS", price: 250.0 },
  "EMPTY TIN 1L": { unit: "NOS", price: 116.11 },
  "FACE SHIELD": { unit: "NOS", price: 96.75 },
  "CORONA UNIFORM": { unit: "NOS", price: 600.0 },
  "SAFETY HELMET YELLOW": { unit: "NOS", price: 450.0 },
  "CANVAS SHOES": { unit: "NOS", price: 2200.0 },
  "SCRAPER 2\"": { unit: "NOS", price: 179.96 },
  "COTTON WASTE SMALLPCS": { unit: "KG", price: 117.96 },
  "COTTON WASTE LARGEPCS": { unit: "KG", price: 95.0 },
  "2 WAY SUN BOX": { unit: "NOS", price: 154.67 },
  "COMBINATION KEY 10MM": { unit: "NOS", price: 277.14 },
  "COMBINATION KEY 11MM": { unit: "NOS", price: 324.0 },
  "COMBINATION KEY 12MM": { unit: "NOS", price: 334.0 },
  "COMBINATION KEY 13MM": { unit: "NOS", price: 366.0 },
  "COMBINATION KEY 14MM": { unit: "NOS", price: 398.0 },
  "COMBINATION KEY 15MM": { unit: "NOS", price: 416.0 },
  "COMBINATION KEY 17MM": { unit: "NOS", price: 550.0 },
  "T KEY 10MM": { unit: "NOS", price: 312.14 },
  "SHIFTER 10\"": { unit: "NOS", price: 1132.2 },
  "NAIL HAMMER": { unit: "NOS", price: 1016.67 },
  "STEEL TAPE 5M": { unit: "NOS", price: 650.0 },
  "SYLINGER 20ML": { unit: "NOS", price: 85.0 },
  "SYLINGER 50ML": { unit: "NOS", price: 165.0 },
  "PIPE WRINCH 18\"": { unit: "NOS", price: 1215.0 },
  "SAFETY HELMET WHITE": { unit: "NOS", price: 450.0 },
  "WIRE BRUSH": { unit: "NOS", price: 503.3 },
  "XYLENE": { unit: "LTR", price: 565.8 },
  "4 1/2\" STEEL CUTTING WHEEL": { unit: "NOS", price: 177.61 },
  "WIRE CORD": { unit: "NOS", price: 0.0 },
  "DROP IN ANCHOR 10M": { unit: "NOS", price: 0.0 },
  "PVC 200 INSUWRAP": { unit: "NOS", price: 0.0 },
  "GARDEN HOSE": { unit: "NOS", price: 31334.75 },
  "1 TON CHAIN BLOCK": { unit: "NOS", price: 76815.6 },
  "12MM EYE BOLT": { unit: "NOS", price: 280.0 },
  "3 TON CV HOOK": { unit: "NOS", price: 1900.0 },
  "1 TON THICK ROPE": { unit: "NOS", price: 5850.0 },
  "GREEN THICK ROPE": { unit: "NOS", price: 0.0 },
  "7\" CUTTING WHEEL": { unit: "NOS", price: 0.0 },
  "INJECTION PACKERS": { unit: "NOS", price: 400.0 },
  "SAFETY BOOTS": { unit: "NOS", price: 4500.0 },
  "2 CORE WIRE": { unit: "m", price: 125.0 },
  "LED FLASH LIGHT 50W": { unit: "NOS", price: 5300.0 },
  "TESTER": { unit: "NOS", price: 394.63 },
  "WATER BOTTLE": { unit: "NOS", price: 300.0 },
  "CENTER BOLT WITH PLATES": { unit: "NOS", price: 2677.08 },
  "BABY ROLL SLEEVE": { unit: "NOS", price: 344.65 },
  "4 CORE WIRE": { unit: "m", price: 2250.0 },
  "INDUSTRIAL MALE SOCKET 4 PIN 32A": { unit: "NOS", price: 725.0 },
  "INDUSTRIAL FEMALE SOCKET 4 PIN 32A": { unit: "NOS", price: 975.0 },
  "SWITCH BOX": { unit: "NOS", price: 300.0 },
  "INSULATION TAPE (BLACK)": { unit: "NOS", price: 136.91 },
  "PLUG & SWITCH 13A": { unit: "NOS", price: 615.0 },
  "PLASTIC DINNING CHAIR": { unit: "NOS", price: 1575.0 },
  "SOUDAL SUPER BOND": { unit: "NOS", price: 277.0 },
  "PAINT BRUSH 9\"": { unit: "NOS", price: 478.26 },
  "SCRAPER 4\"": { unit: "NOS", price: 233.21 },
  "GAS TORCH": { unit: "NOS", price: 0.0 },
  "SILICA SAND": { unit: "KG", price: 15.0 },
  "16MM SDS PLUS DRILL BIT": { unit: "NOS", price: 32.37 },
  "SCRAPER 1\"": { unit: "NOS", price: 130.52 },
  "EYE GOGGLE SAFETY": { unit: "NOS", price: 125.66 },
  "PAINT BRUSH 1.5\"": { unit: "NOS", price: 495.0 },
  "SCREW 6MM": { unit: "NOS", price: 2.5 },
  "PAINT REMOVER": { unit: "LTR", price: 1100.0 },
  "DELO GEAR EP 5 (FOR WALL SAW MACHINE)": { unit: "LTR", price: 3100.0 },
  "TILE": { unit: "NOS", price: 1076.0 },
  "STEEL TAPE 7.5M": { unit: "NOS", price: 1080.0 },
  "FLEX PRUF LIQUID": { unit: "LTR", price: 0.0 },
  "DRILL BIT 12MM SDS PLUS": { unit: "NOS", price: 572.88 },
  "DRILL BIT 14MM SDS PLUS": { unit: "NOS", price: 209.94 },
  "4\" END CAP": { unit: "NOS", price: 275.0 },
  "1\" ELBOW PVC": { unit: "NOS", price: 0.0 },
  "SLON GUM": { unit: "NOS", price: 350.0 },
  "POP RIVERT": { unit: "NOS", price: 4.0 },
  "1\" GI CLIP": { unit: "NOS", price: 12.5 },
  "HOLE SAW SET": { unit: "NOS", price: 1450.0 },
  "DULUX MINERVA GREY (PENTALITE) (PAINT)": { unit: "LTR", price: 2961.67 },
  "1\" PVC PIPE": { unit: "m", price: 324.33 },
  "ROLL PLUG 6MM": { unit: "NOS", price: 0.0 },
  "HACKSAW BLADE": { unit: "NOS", price: 40.97 },
  "DROP IN ANCHOR 12M": { unit: "NOS", price: 42.0 },
  "CORE CUTTING BIT 89MM": { unit: "NOS", price: 5386.0 },
  "CORE BIT ADAPTER": { unit: "NOS", price: 4635.0 },
  "STEEL MEASURING TAPE 10M": { unit: "NOS", price: 1599.15 },
  "DEMON DRILL WITH WAT": { unit: "NOS", price: 122574.1 },
  "BITUMINOUS BOARD (PROTECT BOARD) 4FT X 8FT": { unit: "NOS", price: 2468.75 },
  "GEOTEXTILES (6MX100M)": { unit: "m", price: 585.61 },
  "HOT AIR GUN": { unit: "NOS", price: 6000.0 },
  "SUNGLASS": { unit: "NOS", price: 300.0 },
  "RATCHET 17''": { unit: "NOS", price: 1815.0 },
  "DUCT TAPE": { unit: "NOS", price: 524.99 },
  "4.5\" GRINDER NUT": { unit: "NOS", price: 75.0 },
  "BLOWER MACHINE": { unit: "NOS", price: 3850.0 },
  "BABY DRILL": { unit: "NOS", price: 0.0 },
  "4\" CONCRETE NAILS": { unit: "g", price: 0.93 },
  "POP RIVERT GUN": { unit: "NOS", price: 1200.0 },
  "COMBINATION KEY 17\"": { unit: "NOS", price: 91.67 },
  "SPONGE SHEET 6' X 3'  (5MM THICK)": { unit: "NOS", price: 255.0 },
  "LEVEL BOX BAR": { unit: "NOS", price: 1675.0 },
  "CAUSEWAY BRILLIANT (LACKER) (PAINT)": { unit: "LTR", price: 2470.0 },
  "4.5\" GRINDER": { unit: "NOS", price: 9444.43 },
  "1 1/2\" PVC PIPE": { unit: "m", price: 412.57 },
  "1 1/2 PVC ELBOW": { unit: "NOS", price: 295.0 },
  "1 1/2 GI CLIP": { unit: "NOS", price: 18.5 },
  "4\" PVC PIPE (G400)": { unit: "m", price: 1044.64 },
  "1\" PVC ELBOW": { unit: "NOS", price: 100.0 },
  "EYE BOLT 16MM": { unit: "NOS", price: 814.42 },
  "RUBBER COATED COTTON GLOUSE": { unit: "NOS", price: 142.34 },
  "DRILL BIT 20MM SDS PLUS": { unit: "NOS", price: 1800.0 },
  "PAPER CUTTER BLADE": { unit: "NOS", price: 12.42 },
  "HIGH PRESSURE WATER GUN": { unit: "NOS", price: 18500.0 },
  "BITU PRIMER": { unit: "LTR", price: 451.58 },
  "INDUSTRIAL MASK": { unit: "NOS", price: 660.0 },
  "DROP IN ANCHOR 16M": { unit: "NOS", price: 0.0 },
  "4.5\" CUP WHEEL": { unit: "NOS", price: 791.19 },
  "SAFETY JACKET ORANGE": { unit: "NOS", price: 267.51 },
  "REJIFORM MANIS": { unit: "NOS", price: 112.6 },
  "BINDING WIRE": { unit: "KG", price: 375.0 },
  "INDUSTRIAL SOCKET MALE 3 PIN 32A": { unit: "NOS", price: 750.0 },
  "INDUSRIAL SOCKET FEMALE 3 PIN 32A": { unit: "NOS", price: 750.0 },
  "KEROSINE": { unit: "LTR", price: 208.0 },
  "STEEL CHAIN": { unit: "m", price: 440.0 },
  "COMBINATION KEY 18MM": { unit: "NOS", price: 626.67 },
  "COMBINATION KEY 19MM": { unit: "NOS", price: 666.67 },
  "BARRIGATE ROLL": { unit: "KG", price: 1287.5 },
  "GUM BOOTS": { unit: "NOS", price: 1468.0 },
  "STEEL PAPER CUTTER": { unit: "NOS", price: 1625.0 },
  "HEAVY PAPER CUTTER": { unit: "NOS", price: 279.78 },
  "HELMET HARNESS SAFETY": { unit: "NOS", price: 202.78 },
  "MULTIBORN 304": { unit: "LTR", price: 12921.54 },
  "4.5\" CUP BRUSH": { unit: "NOS", price: 290.0 },
  "SAND PAPER (WHITE) SIZE 60": { unit: "NOS", price: 220.0 },
  "SAND PAPER (WHITE) SIZE 120": { unit: "NOS", price: 220.0 },
  "TARPAULIN SHEET 20M X 15M": { unit: "NOS", price: 3750.0 },
  "3/4\" PVC PIPE": { unit: "NOS", price: 1050.0 },
  "3/4\" ELBOW": { unit: "NOS", price: 100.0 },
  "GAS REGULATOR": { unit: "NOS", price: 2375.0 },
  "REDUCER 1 1/2\" X 3/4\"": { unit: "NOS", price: 380.0 },
  "3/4\" SOCKET": { unit: "NOS", price: 150.0 },
  "ASMACO FOIL TAPE": { unit: "NOS", price: 650.0 },
  "HIGH POWER DUCT TAPE": { unit: "NOS", price: 575.0 },
  "HIGH POWER FOIL TAPE": { unit: "NOS", price: 420.0 },
  "TARPAULIN 8FT X 90M ROLL": { unit: "m", price: 169.44 },
  "FLASH LIGHT 100W": { unit: "NOS", price: 5316.67 },
  "POLYTHENE NORMAL": { unit: "KG", price: 290.32 },
  "EMPTY CAN 5L": { unit: "NOS", price: 150.0 },
  "5 CORE FLEXIBLE WIRE 32 A (4MM)": { unit: "m", price: 1752.33 },
  "9\" CUTTING WHEEL": { unit: "NOS", price: 3000.0 },
  "STYROFOAM SHEET 3\" X 3\" X 1\"": { unit: "NOS", price: 536.19 },
  "RUST REMOVER": { unit: "LTR", price: 0.0 },
  "SAFETY NET 10FTX 6FT": { unit: "NOS", price: 0.0 },
  "WATER PLUG (GREENSEAL FLASH)": { unit: "KG", price: 1464.4 },
  "SIKA GROUT 214LK 25 KG BAG": { unit: "NOS", price: 4500.0 },
  "THREAD SEAL TAPE": { unit: "NOS", price: 60.67 },
  "SUN BOX SINGLE": { unit: "NOS", price: 150.0 },
  "MASON TROWEL 7\"": { unit: "NOS", price: 544.99 },
  "EMPTY BUCKET 4L": { unit: "NOS", price: 189.8 },
  "MIXING PADDLE": { unit: "NOS", price: 1140.0 },
  "SIKA LATEX 4 LK": { unit: "LTR", price: 562.5 },
  "PRESSURE GAUGE BAR 250": { unit: "NOS", price: 5945.0 },
  "UREA BAG": { unit: "NOS", price: 37.72 },
  "NITROGEN GAS CYLINDER": { unit: "NOS", price: 0.0 },
  "REGULATOR OXYGEN PRESSCOTT": { unit: "NOS", price: 7250.0 },
  "CYLINDER KEY": { unit: "NOS", price: 450.0 },
  "SAND PAPER 60P": { unit: "ft", price: 0.0 },
  "HOE": { unit: "NOS", price: 0.0 },
  "REDUCER 2\" X 1\"": { unit: "NOS", price: 185.0 },
  "SS SCREW 6MM X 32MM": { unit: "NOS", price: 9.0 },
  "DOUBLE ENDED FLAT/PHILIP SCREW BIT": { unit: "NOS", price: 145.0 },
  "FINISHING TROWEL": { unit: "NOS", price: 330.0 },
  "COMBINATION KEY 16MM": { unit: "NOS", price: 540.0 },
  "CURVE BLADE": { unit: "NOS", price: 20.0 },
  "SAND PAPER 40P": { unit: "ft", price: 175.0 },
  "SYNROOF HB GREY": { unit: "LTR", price: 1180.0 },
  "EMPTY BUCKET WITH WHITE LID 20L (NEW)": { unit: "NOS", price: 950.0 },
  "GI INSULATION PINS (HEAD: 2\"X2\" , PIN: 1 1/2\")": { unit: "NOS", price: 0.0 },
  "ALLEN KEY SET": { unit: "NOS", price: 933.67 },
  "SPRAY BOTTLE EMPTY": { unit: "NOS", price: 532.78 },
  "DRILL BIT 25MM SDS PLUS": { unit: "NOS", price: 1110.0 },
  "4.5\" FLAP DISC 40P": { unit: "NOS", price: 100.0 },
  "EMPTY TIN 2L": { unit: "NOS", price: 140.0 },
  "\"L\" ANGLE ALUMINIUM BAR 3/4 X 3/4 1MM (12FT)": { unit: "NOS", price: 681.58 },
  "PLASTIC BARREL 25L EMPTY": { unit: "NOS", price: 5994.0 },
  "\"L\" ANGLE ALUMINIUM BAR 1/2 X 1/2 0.9MM (12FT)": { unit: "ft", price: 35.17 },
  "WAPP BUTTER MILK (PAINT)": { unit: "LTR", price: 2457.33 },
  "SAMUDRA CEMENT": { unit: "KG", price: 75.0 },
  "GREASE NOZZEL BLACK": { unit: "NOS", price: 405.06 },
  "VISER WITH SAFETY HELMET YELLOW": { unit: "NOS", price: 1433.33 },
  "CHEMICAL RESISTANT RUBBER GLOUSE SAFETY": { unit: "NOS", price: 450.0 },
  "7\" PAINT ROLLER BRUSH": { unit: "NOS", price: 481.82 },
  "EMPTY BUCKET 10L": { unit: "NOS", price: 450.0 },
  "4\" ELBOW": { unit: "NOS", price: 0.0 },
  "1\" SOCKET": { unit: "NOS", price: 0.0 },
  "1 1/2\" END CAP": { unit: "NOS", price: 0.0 },
  "2\" CLIP": { unit: "NOS", price: 0.0 },
  "4\" CLIP": { unit: "NOS", price: 0.0 },
  "4\" CUP WHEEL": { unit: "NOS", price: 0.0 },
  "DULUX BRILLIANT WHITE (PAINT)": { unit: "LTR", price: 2000.0 },
  "GI INSULATION PINS (HEAD: 2\"X2\" , PIN: 2 1/2\")": { unit: "NOS", price: 0.0 },
  "COMBINATION KEY 9MM": { unit: "NOS", price: 200.0 },
  "SCRAPER 3\"": { unit: "NOS", price: 300.0 },
  "SCRAPER 5\"": { unit: "NOS", price: 380.0 },
  "SYNROOF HB WHITE": { unit: "LTR", price: 6966.67 },
  "14\" DIAMOND CUTTING WHEEL": { unit: "NOS", price: 9500.0 },
  "SAFETY JACKET GREEN HEAVY": { unit: "NOS", price: 650.0 },
  "CAR POLISH": { unit: "LTR", price: 1187.5 },
  "6MM X 32MM BLACK SCREW": { unit: "NOS", price: 2.16 },
  "8MM X 32MM ROUND HEADED SS SCREW": { unit: "NOS", price: 10.8 },
  "6MM HSS DRILL BIT": { unit: "NOS", price: 299.25 },
  "8MM HSS DRILL BIT": { unit: "NOS", price: 566.4 },
  "8MM DRILL BIT SDS PLUS": { unit: "NOS", price: 217.73 },
  "FIBER MESH 1M X 120M (32 kG)": { unit: "m", price: 189.07 },
  "HYDROULIC PRESSURE GUAGE 400 BAR": { unit: "NOS", price: 5945.0 },
  "BARREL NIPPLE 1/4 X 1/4": { unit: "NOS", price: 450.0 },
  "BALL COCK VALVE A 305/2 1/4 X 1/4": { unit: "NOS", price: 3142.0 },
  "GREASE": { unit: "KG", price: 3000.0 },
  "INDUSTRIAL SOCKET 32A  MALE 5 PN": { unit: "NOS", price: 1325.0 },
  "INDUSTRIAL SOCKET 32A  FEMALE 5 PN": { unit: "NOS", price: 1325.0 },
  "INSULATED SCREW DRIVER FLAT": { unit: "NOS", price: 879.17 },
  "INSULATED SCREW DRIVER PHILIP": { unit: "NOS", price: 879.17 },
  "WIRE CUTTER": { unit: "NOS", price: 1250.0 },
  "CUTTING PLIER": { unit: "NOS", price: 1100.0 },
  "LIGHTERS": { unit: "NOS", price: 80.0 },
  "EMPTY CAN 1L WITH RED LID": { unit: "NOS", price: 100.0 },
  "18MM X 260MM SDS  PLUS DRILL BIT": { unit: "NOS", price: 0.0 },
  "8MM X 75MM FIX ANCHORS": { unit: "NOS", price: 220.5 },
  "50 X 50 X 6 MM L ANGLE": { unit: "ft", price: 332.11 },
  "50 X 6 MM FLAT IRON": { unit: "ft", price: 176.32 },
  "MIXING MACHINE 1400W (MX214008)": { unit: "NOS", price: 25254.24 },
  "ROTARY DRILL MACHINE (RH10506-8)": { unit: "NOS", price: 18559.32 },
  "BABY DRILL MACHINE 450W (ED45658)": { unit: "NOS", price: 6118.65 },
  "14MM X 150 MM DRILL BIT SDS PLUS": { unit: "NOS", price: 900.0 },
  "14MM X 360 MM DRILL BIT SDS PLUS": { unit: "NOS", price: 850.0 },
  "POINT CHISEL HILTI": { unit: "NOS", price: 391.95 },
  "FLAT CHISEL HILTI": { unit: "NOS", price: 391.95 },
  "COMBINATION KEY SET": { unit: "NOS", price: 4950.0 },
  "ECG GEL": { unit: "NOS", price: 680.0 },
  "TEFLON ROLLER": { unit: "NOS", price: 4596.15 },
  "EMPTY BUCKET WHITE WITH RED LID 20L (NEW)": { unit: "NOS", price: 790.0 },
  "HA CUT AF 25 KG": { unit: "NOS", price: 0.0 },
  "HA CUT CAT AF (2.5L)": { unit: "NOS", price: 0.0 },
  "HEMPATHANE TOP COAT 55210": { unit: "LTR", price: 0.0 },
  "HEMPADUR 15553": { unit: "LTR", price: 4200.0 },
  "HEMPADUR 35560": { unit: "LTR", price: 0.0 },
  "HEMPEL'S CURING AGENT 98560": { unit: "LTR", price: 0.0 },
  "HEMPEL'S CURING AGENT 95881": { unit: "LTR", price: 0.0 },
  "HEMPEL'S CURING AGENT 98021": { unit: "LTR", price: 4200.0 },
  "XPC CARBON ECO BOARD (25MM X 600MM X 1200MM)": { unit: "NOS", price: 710.0 },
  "MEASURING CUP 500ML": { unit: "NOS", price: 300.0 },
  "MEASURING CUP 100ML": { unit: "NOS", price: 200.0 },
  "SL 1211 WP (LATEX)": { unit: "KG", price: 10033.28 },
  "EMPTY CAN WHITE WITH RED LID AND CAP 5L": { unit: "NOS", price: 190.0 },
  "ROTARY HAMMER DRILL 750W DBL": { unit: "NOS", price: 19570.5 },
  "MIXING MACHINE 1010W DBL": { unit: "NOS", price: 15690.6 },
  "EMPTY BUCKET 15L": { unit: "NOS", price: 992.0 },
  "STRAPPING TENSIONER MACHINE": { unit: "NOS", price: 0.0 },
  "MANUAL PUMP MACHINE": { unit: "NOS", price: 5200.0 },
  "TORE STEEL BAR T8": { unit: "ft", price: 35.58 },
  "TORE STEEL BAR T12": { unit: "ft", price: 61.67 },
  "CHIPPING HAMMER": { unit: "NOS", price: 950.0 },
  "STRETCH FILM ROLL 500MM (2KG)": { unit: "NOS", price: 1159.15 },
  "2\" TAN TAPE": { unit: "NOS", price: 210.0 },
  "CARTON BOX 3 FLY (16 X 16 X 12\")": { unit: "NOS", price: 154.0 },
  "INSULATION BOARD 1200MM X 600MM X 50MM BLUE": { unit: "NOS", price: 0.0 },
  "INSULATION BOARD 1200MM X 600MM X 25MM GREY": { unit: "NOS", price: 0.0 },
  "SAFETY BELT": { unit: "NOS", price: 0.0 },
  "EMPTY TIN 5L": { unit: "NOS", price: 325.0 },
  "10MM DRILL BIT SDS PLUS": { unit: "NOS", price: 0.0 },
  "DUST MASK": { unit: "NOS", price: 62.69 },
  "BACKER ROD 50MM": { unit: "m", price: 177.96 },
  "MILD STEEL R6 (1/4 KOORU / IRON NORMAL 5.5MM)": { unit: "ft", price: 16.32 },
  "DIESEL": { unit: "LTR", price: 333.33 },
  "1/2\" GI PIPE": { unit: "ft", price: 100.0 },
  "2\" WIRE NAILS": { unit: "KG", price: 350.0 },
  "3\" WIRE NAILS": { unit: "KG", price: 350.0 },
  "2\" CONCRETE NAIL   (900g) BOX": { unit: "g", price: 0.61 },
  "SAFETY NET 6FT X 16FT": { unit: "NOS", price: 1650.0 },
  "TORE STEEL 10MM": { unit: "ft", price: 53.08 },
  "TORE STEEL 16MM": { unit: "ft", price: 125.21 },
  "SHOVEL": { unit: "NOS", price: 0.0 },
  "15MM PLYWOOD SHEET 8' X 4'": { unit: "NOS", price: 5000.0 },
  "8MM X 32MM SCREW": { unit: "NOS", price: 1.69 },
  "TORE STEEL 25MM": { unit: "ft", price: 340.26 },
  "TORE STEEL 20MM": { unit: "ft", price: 218.42 },
  "STEEL HOOK (BINDING HACKER)": { unit: "NOS", price: 1100.0 },
  "12MM HSS DRILL BIT": { unit: "NOS", price: 1520.0 },
  "12MM X 75MM ANCHOR BOLT": { unit: "NOS", price: 69.3 },
  "SCALE 40KG (BANANA)": { unit: "NOS", price: 7500.0 },
  "1.5\" CONCRETE NAILS": { unit: "g", price: 0.61 },
  "3\" CONCRETE NAILS": { unit: "g", price: 0.61 },
  "1\" WIRE NAILS": { unit: "KG", price: 350.0 },
  "1.5\" WIRE NAILS": { unit: "KG", price: 350.0 },
  "100MM X 100MM (10MM THICK) L ANGLE STEEL BAR": { unit: "ft", price: 1500.0 },
  "5\" MASON TROVEL": { unit: "NOS", price: 450.0 },
  "13 X 300 MM  PLASTIC BRUSH (CLEANIG ROD)": { unit: "NOS", price: 0.0 },
  "28 X 500 MM  PLASTIC BRUSH (CLEANIG ROD)": { unit: "NOS", price: 0.0 },
  "FOAM OIL": { unit: "LTR", price: 60.0 },
  "2 X 2 WOOD": { unit: "ft", price: 45.0 },
  "1 X 2 WOOD": { unit: "ft", price: 35.0 },
  "2 X 4 WOOD": { unit: "ft", price: 90.0 },
  "12MM PLYWOODD 8X4": { unit: "NOS", price: 4500.0 },
  "8MM ROLL PLUG": { unit: "NOS", price: 3.5 },
  "CUBE TEST MOULD PLASTIC": { unit: "NOS", price: 4000.0 },
  "RUBBER HAMMER": { unit: "NOS", price: 1500.0 },
  "30MM SDS MAX DRILL BIT": { unit: "NOS", price: 4500.0 },
  "SAND": { unit: "CUBE", price: 33133.33 },
  "6MM CHIP METAL": { unit: "CUBE", price: 17700.0 },
  "20MM AGGREGATE CHIP": { unit: "CUBE", price: 10500.0 },
  "FIX CLAMP MALAYSIA 600g": { unit: "NOS", price: 300.0 },
  "FREE CLAMP MALAYSIA 600g (SWIVEL)": { unit: "NOS", price: 300.0 },
  "12\" L BRICKS CEMENT": { unit: "NOS", price: 70.0 },
  "1 1/2 (L) 6MM SCREW": { unit: "NOS", price: 0.0 },
  "1/2\" GI CLIP": { unit: "NOS", price: 20.0 },
  "1/2\" T SOCKET": { unit: "NOS", price: 50.0 },
  "1/2\" ELBOW": { unit: "NOS", price: 50.0 },
  "1/2\" FAUCET SOCKET": { unit: "NOS", price: 50.0 },
  "GARDEN TAP": { unit: "NOS", price: 800.0 },
  "1 1/2\" PAINT BRUSH": { unit: "NOS", price: 297.0 },
  "4L EMPTY TIN": { unit: "NOS", price: 300.0 },
  "CHICKEN MESH (6FT W )": { unit: "m", price: 231.67 },
  "10MM PLYWOOD BOARD": { unit: "NOS", price: 3200.0 },
  "SAFETY NET ROLL (6FT X 50M)": { unit: "m", price: 0.0 },
  "8MM PLYWOOD BOARD 8' X 4'": { unit: "NOS", price: 0.0 },
  "HEMPEL'S CURING AGENT 50630": { unit: "LTR", price: 0.0 },
  "HEMPEL'S CURING AGENT 11480": { unit: "NOS", price: 0.0 },
  "HEMPEL THINNER 08450": { unit: "LTR", price: 0.0 },
  "HEMPEL THINNER 08080": { unit: "LTR", price: 0.0 },
  "HEMPADUR MASTIC 45881": { unit: "LTR", price: 0.0 },
  "7\" CUP WHEEL": { unit: "NOS", price: 3000.0 },
  "6MM X 110MM HAMMER DRILL BT": { unit: "NOS", price: 245.34 },
  "6MM X 160MM HAMMER DRILL BIT": { unit: "NOS", price: 249.43 },
  "DUST PAN": { unit: "NOS", price: 240.0 },
  "MOB (CLEANING)": { unit: "NOS", price: 495.0 },
  "CYLINGER 50ML": { unit: "NOS", price: 150.0 },
  "COVERING BLOCKS": { unit: "NOS", price: 15.0 },
  "SILVER OVEROLL (CHMEICAL)": { unit: "NOS", price: 1200.0 },
  "OVERALL": { unit: "NOS", price: 2750.0 },
  "MASK FILTER": { unit: "NOS", price: 300.0 },
  "HILT BIT 16' x 160mm": { unit: "NOS", price: 700.0 },
  "HAND SAW": { unit: "NOS", price: 1500.0 },
  "TRADE SEAL": { unit: "NOS", price: 60.0 },
  "4 1/2\" DOUBLE DIAMOND CUP WHEEL": { unit: "NOS", price: 1025.0 },
  "BLANK LABEL 1\" CORE ( 4\" X 6\" - AVY)": { unit: "ROLL", price: 3250.0 },
  "PREMIER WAX RIBBON 110MM X 300M (TDW 121)": { unit: "NOS", price: 0.0 },
  "3PLY COURRUGATED BOX  (10.5\" X 16.5\"X 12\")": { unit: "NOS", price: 203.0 },
  "10\" DIAMOND ABRASIVE WHEEL (FLOOR CUTTING)": { unit: "NOS", price: 31500.0 },
  "ELBOW LENGTH YELLOW RUBBER GLOVES": { unit: "NOS", price: 540.0 },
  "RUBBER GLOVE": { unit: "NOS", price: 82.5 },
  "SHOULDER LENGTH YELLOW RUBBER GLOVES": { unit: "NOS", price: 630.0 },
  "N95 MASK (25IN BOX)": { unit: "NOS", price: 17.5 },
  "DUST GOGGLES": { unit: "NOS", price: 450.0 },
  "4.5\" MINI GRINDER 700W": { unit: "NOS", price: 11919.75 },
  "REJIFORM (ECOFOAM) SHEET 3Fx3Fx 1/2\"": { unit: "NOS", price: 320.0 },
  "WALL PLUGS 6\"MM": { unit: "NOS", price: 2.03 },
  "SILICONE BARREL GUN": { unit: "NOS", price: 2125.0 },
  "BODY HARNESS": { unit: "NOS", price: 0.0 },
  "EPOJET LV 40IN (EP 200) H/B": { unit: "KG", price: 16000.0 },
  "20L CANS WITH CASP AND SEPERATE": { unit: "NOS", price: 800.0 },
  "Backer Rod 20MM": { unit: "m", price: 31.36 },
  "BACKER ROD 35MM (MACFOAM 35MM)": { unit: "m", price: 74.25 },
  "Angle grinder AG 115-8D": { unit: "NOS", price: 0.0 },
  "MILK WHITE POLY BAG 43.5CM x 53CM x 630G": { unit: "NOS", price: 71.75 },
  "EMPTY CAN WITH RED LID AND CAP 10L": { unit: "NOS", price: 0.0 },
  "METAL 3/4": { unit: "CUBE", price: 12500.0 },
  "WELDED MESH 2\"x2\"x10g SHEET": { unit: "NOS", price: 5250.0 },
  "43.5 x 52 CM Printed Poly Bag": { unit: "NOS", price: 71.75 },
  "43.5 x 52 CM Block Charges": { unit: "NOS", price: 78660.0 },
  "W W M ROLL 2\" X 2\" (1M X 15M) WELD MESH": { unit: "ROLL", price: 9150.0 },
  "PRIMER WAX RIBBON TDW 121 (110MM X 300M)": { unit: "NOS", price: 1890.0 },
  "Diamond grinder DGH 130 230v": { unit: "NOS", price: 64970.5 },
  "110/50 FR COLLAR": { unit: "NOS", price: 5219.5 },
  "B 150 PIPE COLLAR": { unit: "NOS", price: 1825.5 },
  "B 300 PIPE WRAP 2HR (LONG)": { unit: "NOS", price: 3850.82 },
  "B 300 PIPE WRAP 2HR (SMALL)": { unit: "NOS", price: 1732.52 },
  "FP 302 PIPE WRAP 50MM X 25MM (ROLL)": { unit: "NOS", price: 95810.0 },
  "FS 702 310ML (INTUMASTIC FIRE RATED ACRY": { unit: "NOS", price: 1048.45 },
  "FS 703 600ML": { unit: "NOS", price: 744.0 },
  "IIBRUCK SP 525 (600ML)": { unit: "NOS", price: 1033.07 },
  "IILBRUCK FM 310": { unit: "NOS", price: 1549.61 },
  "NULLIFIRE FF 197": { unit: "NOS", price: 2965.3 },
  "NULLIFIRE SC 801 25KG": { unit: "NOS", price: 46500.0 },
  "NULLIFIRE SC 802 25KG": { unit: "NOS", price: 2401.44 },
  "SC 902 NULLIFIRE": { unit: "NOS", price: 4092.0 },
  "FS 709 (310 ml)": { unit: "NOS", price: 1895.42 },
  "FS 709 (600 ML)": { unit: "NOS", price: 3986.97 },
  "FB 750 (FIRE BAT)": { unit: "NOS", price: 3727.36 },
  "FP 302 INTUSTRAP (60MM X 4MM X 25M)": { unit: "m", price: 3438.24 },
  "PENNFLEX PH2000 PVC WATERPROOF MEMBRANCE": { unit: "m", price: 2590.33 },
  "PROBUTYL NONWOVEN SEALANT TAPE 80MM X 1MM X 10M (COMPOSITE TAPE)": { unit: "m", price: 715.33 },
  "RD MONOGUARD SG RAL 7016 (BLACK, 20L PAIL)": { unit: "LTR", price: 7036.95 },
  "RD MONOGUARD SG  (WHITE, 20L PAIL)": { unit: "LTR", price: 7036.95 },
  "RD MONOGUARD SG RAL 3009 (RED, 20L PAIL)": { unit: "LTR", price: 7036.95 },
  "RD-ECO POWER CLEAN": { unit: "LTR", price: 4341.4 },
  "CARBAN FIBER": { unit: "KG", price: 8117.62 },
  "CARBERN FIBER": { unit: "m", price: 8117.62 },
  "CARBON FIBER PLATE STRACTURAL ADHESIVE 10KG": { unit: "NOS", price: 1444.56 },
  "CARBON FIBER PLATE STRACTURAL ADHESIVE 20KG": { unit: "NOS", price: 1444.56 },
  "GLASS FIBER": { unit: "m", price: 2655.13 },
  "CFRP 230GSM 1M X 100M": { unit: "m", price: 0.0 },
  "CFRP 600GSM 0.5M X 100M": { unit: "m", price: 0.0 },
  "CFRP 300GSM 0.5M X 100M": { unit: "m", price: 0.0 },
  "CFRP 230GSM 0.5M X 100M": { unit: "m", price: 0.0 },
  "GLASS FIBER 1.3M X 130M (169 Sqm) GFRP": { unit: "sqm", price: 1214.84 },
  "X ROC MICRO CREATE 25KG BAG /X TITE FINE GROUT 25 KG BAG (WEBER)": { unit: "NOS", price: 2043.0 },
  "QUICK PRIME 2K EPOXY SF ME BASE (PART B)": { unit: "LTR", price: 3913.89 },
  "QUICK PRIME 2K EPOXY SF ME HARDNER (PART A)": { unit: "LTR", price: 4109.58 },
  "PIGMENT PASTE BLUE RAL 7005": { unit: "KG", price: 2566.26 },
  "QUICK SPRAY INDUSTRIAL W MAXI BASE (PART B)": { unit: "KG", price: 3021.86 },
  "QUICK SPRAY INDUSTRIAL W MAXI HARDNER (PART A)": { unit: "KG", price: 3021.85 },
  "QUICK SEAL PP 350 MAXI BASE (PART B)": { unit: "KG", price: 2841.64 },
  "QUICK SEAL PP 350 MAXI HARDNER (PART A)": { unit: "KG", price: 2841.64 },
  "CONSTRUCTION GROUD": { unit: "KG", price: 3134.47 },
  "X CURE WB 75": { unit: "LTR", price: 237.56 },
  "X INJECT EP 200 - BASE 1L": { unit: "NOS", price: 0.0 },
  "X INJECT EP 200 - HARDNER 1L": { unit: "NOS", price: 8527.08 },
  "X INJECT EP 200 - BASE (PART A) 3L": { unit: "NOS", price: 4263.54 },
  "X INJECT EP 200 - HARDNER (PART B) 3L": { unit: "NOS", price: 4263.54 },
  "X INJECT EP 200 - HARDNER (PART B) 5L": { unit: "NOS", price: 4263.54 },
  "X PRIME BUGFILL - BASE 5 KG": { unit: "NOS", price: 3140.43 },
  "X PRIME BUGFILL - HARDNER 5 KG": { unit: "NOS", price: 3140.43 },
  "X PRIME MT 100 - BASE": { unit: "NOS", price: 17145.54 },
  "X PRIME MT 100 - HARDNER": { unit: "NOS", price: 17145.54 },
  "X PRUF 836 (20 LTR BELOW)": { unit: "LTR", price: 10773.0 },
  "X PRUF BITUMASTIC 20L": { unit: "LTR", price: 0.0 },
  "X PRUF BITUMASTIC 20KG": { unit: "KG", price: 18448.0 },
  "X PRUF EPOXY SEAL FLR 100 RAL 7015 BASE": { unit: "NOS", price: 17335.29 },
  "X PRUF EPOXY SEAL FLR 100 RAL 7015 HARDNER": { unit: "NOS", price: 17335.29 },
  "X PRUF PU 1 (20L)": { unit: "LTR", price: 40922.24 },
  "X ROC EPOXY BOND BASE 5KG": { unit: "NOS", price: 3108.9 },
  "X ROC EPOXY BOND HARDNER 5KG": { unit: "NOS", price: 3108.9 },
  "X ROC EPOXY BOND BASE 25L": { unit: "NOS", price: 1873.51 },
  "X ROC EPOXY BOND HARDNER 25L": { unit: "NOS", price: 1873.51 },
  "X ROC LATEX": { unit: "LTR", price: 1228.96 },
  "X ROC SOAL & HEAL BASE 1L": { unit: "LTR", price: 7900.0 },
  "X SEAL FR 200 POURING GRADE 2.5L": { unit: "LTR", price: 3950.0 },
  "X SHIELD FR 200 PRIMER": { unit: "LTR", price: 6100.0 },
  "X SHIELD PS 800 PRIMER": { unit: "LTR", price: 0.0 },
  "X SHIELD ANTICARB C (18L)": { unit: "NOS", price: 39161.19 },
  "X SHIELD BUGFILL POWDER BASE 8KG": { unit: "NOS", price: 5723.43 },
  "X SHIELD BUGFILL POWDER HARDNER 8KG": { unit: "NOS", price: 5723.43 },
  "X SHIELD EPOXY SEAL CR GRAY BASE 15L": { unit: "NOS", price: 37161.09 },
  "X SHIELD EPOXY SEAL CR GRAY HARDNER 15L": { unit: "NOS", price: 37161.09 },
  "X SHIELD FLEXPRUF PLUS LIQUID": { unit: "KG", price: 4344.62 },
  "X SHIELD PAVESIL 20L": { unit: "NOS", price: 43692.43 },
  "X SHIELD SEAL COAT PW FLEX BASE 15L": { unit: "NOS", price: 12187.91 },
  "X SHIELD SEAL COAT PW FLEX HARDNER 15L": { unit: "NOS", price: 12187.91 },
  "X SHIELD THERMO STOP HP - WHITE 19L": { unit: "NOS", price: 35700.0 },
  "X SHIELD URASEAL S BASE 20L": { unit: "NOS", price: 53750.45 },
  "X SHIELD URASEAL S HARDNER 20L": { unit: "NOS", price: 53750.45 },
  "X TECH EPOXY FLOOR RAL 7001 BASE": { unit: "NOS", price: 28960.18 },
  "X TECH EPOXY FLOOR RAL 7001 HARDNER": { unit: "NOS", price: 34670.57 },
  "X TECH EPOXY SEAL FLR 100 - RAL 6037 GREEN": { unit: "NOS", price: 30309.88 },
  "X TECH EPOXY SEAL FLR 55 RAL 7001 BASE": { unit: "NOS", price: 72000.0 },
  "X TECH EPOXY SEAL FLR 55 HARDNER": { unit: "NOS", price: 51080.0 },
  "X TECH EPOXY SEAL RAL 7035 (15L BELOW)": { unit: "NOS", price: 34670.57 },
  "X TECH EPOXY SEAL FLR 100 RAC 7035 LIGHT": { unit: "NOS", price: 72000.0 },
  "X TIET CONSTRUCTION GROUT 25 KG": { unit: "NOS", price: 3013.69 },
  "X TITE STRONG SEAL 600ML": { unit: "NOS", price: 3075.0 },
  "X WRAP LAMINATION ADHESIVE BASE (5KG)": { unit: "NOS", price: 17689.27 },
  "X WRAP LAMINATION ADHESIVE HARDNER (5KG)": { unit: "NOS", price: 17689.27 },
  "X CURE WB 90 CLEAR (20L)": { unit: "NOS", price: 8220.48 },
  "X ROC RESICREFE S BASE": { unit: "NOS", price: 6492.5 },
  "X ROC RESICREFE S HARDNER": { unit: "NOS", price: 6492.5 },
  "X ROC EPOXY BOND  BASE 1L": { unit: "NOS", price: 2512.41 },
  "X ROC EPOXY BOND  HARDENER 1L": { unit: "NOS", price: 2512.41 },
  "X SEAL PS 800 CURING AGENT(BASE) 4L": { unit: "NOS", price: 10001.55 },
  "X SEAL PS 800 POURING GRADE (BASE) 4L": { unit: "NOS", price: 10001.55 },
  "X SEAL PS 800 CURING AGENT (HARDNER) 4L": { unit: "NOS", price: 10001.55 },
  "X TECH EPOXY SEAL FLR 100 HARDNER (15L)": { unit: "NOS", price: 37734.53 },
  "X TITE STRONG SEAL 300ML": { unit: "NOS", price: 1776.67 },
  "EPS 100/48": { unit: "m", price: 24939.3 },
  "EPS 40/25": { unit: "m", price: 5557.03 },
  "EPS 40/30": { unit: "m", price: 5763.15 },
  "EPS 50/35": { unit: "m", price: 4533.25 },
  "FLEX PRUF": { unit: "NOS", price: 4695.65 },
  "INJECT PU 411 HIGH STRENGTH BASE": { unit: "NOS", price: 37160.8 },
  "INJECT PU 411 HIGH STRENGTH HARDNER": { unit: "NOS", price: 37160.81 },
  "X SHIELD MT PRIMER": { unit: "LTR", price: 4500.0 },
  "PRIMER (DAMAGE)": { unit: "NOS", price: 38308.66 },
  "X ROC ULTRA PATCH (25 KG BAG)": { unit: "NOS", price: 6915.67 },
  "X SHIELD EPOXY SEAL PW GREY BASE": { unit: "NOS", price: 17335.29 },
  "X SHIELD EPOXY SEAL PW HARDNER": { unit: "NOS", price: 17335.29 },
  "X ROC GALZINE": { unit: "LTR", price: 11864.79 },
  "X ROC MICROCRETE (25KG BAG)": { unit: "NOS", price: 0.0 },
  "X SHIELD RAINFORCE FABRIC": { unit: "m", price: 550.0 },
  "X PRUF COMPOSITE TAPE": { unit: "m", price: 4665.9 },
  "X PRUF PRIMER": { unit: "LTR", price: 0.0 },
  "INJECT PU 411 5L BASE": { unit: "NOS", price: 37160.8 },
  "INJECT PU 411 5L HARDNER": { unit: "NOS", price: 37160.8 },
  "QED MARGEL VIP 580": { unit: "NOS", price: 1918.91 },
  "X - TITE RESILOC EX3 (e)  585ML": { unit: "NOS", price: 5123.35 },
  "X - INJECT PU221 E BASE": { unit: "NOS", price: 12052.15 },
  "X - INJECT PU221 E HARDENER": { unit: "NOS", price: 12052.15 },
  "X - SHIELD URASEAL S RAL 7040 BASE (WINDOW GREY)": { unit: "NOS", price: 35350.85 },
  "X - SHIELD URASEAL S RAL 7040 HARDENER": { unit: "NOS", price: 35350.85 },
  "X - TECH EPOXY SEAL FLR 100 RAL 7045 (TELE GREY 1) BASE": { unit: "NOS", price: 17997.92 },
  "X - TECH EPOXY SEAL FLR 100 RAL 7045 (TELE GREY 1) HARDENER": { unit: "NOS", price: 17997.92 },
  "X - SEAL PS 800 GG GREY 2.5L": { unit: "NOS", price: 9660.97 },
  "X - SEAL PS 800 PRIMER": { unit: "NOS", price: 5213.33 },
  "X PRUF ELASTOCEM ONE  25KG BAG": { unit: "NOS", price: 4337.53 },
  "X ROC MICROCRETE S 25KG BAG": { unit: "NOS", price: 2697.59 },
  "X ROC ULTRA PRATCH 50  25KG BAG": { unit: "NOS", price: 3578.46 },
  "X ROC CRYSTAL PATCH  25KG BAG": { unit: "NOS", price: 4335.14 },
  "X PRUF CRYSTAL COAT  25KG BAG": { unit: "NOS", price: 5320.4 },
  "AIM FPBB 25 KG": { unit: "NOS", price: 1943.31 },
  "AIM FPLP 200 KG": { unit: "NOS", price: 201032.0 },
  "X - TECH FORMULA X": { unit: "LTR", price: 0.0 },
  "X JOINT FRA - BS 30   ALUMINIUM PROFILE": { unit: "NOS", price: 0.0 },
  "X JOINT CPSR 100 HD BASE PLATE": { unit: "NOS", price: 0.0 },
  "X INJECT SWJ1 SE 185": { unit: "m", price: 0.0 },
};

const CUSTOM_PRODUCTS_STORAGE_KEY = "airowCustomProducts";

function loadCustomProducts() {
  try {
    const savedProducts = JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_STORAGE_KEY) || "{}");

    Object.entries(savedProducts).forEach(([name, details]) => {
      if (!name || !details) return;
      stockProductsDB[name] = {
        unit: details.unit || "NOS",
        price: Number(details.price) || 0
      };
    });
  } catch (error) {
    console.warn("Could not load custom products", error);
  }
}

function saveCustomProduct(name, details) {
  const savedProducts = JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_STORAGE_KEY) || "{}");
  savedProducts[name] = details;
  localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(savedProducts));
}

function refreshProductNames() {
  return Object.keys(stockProductsDB).sort((a, b) => a.localeCompare(b));
}

loadCustomProducts();
let productNames = refreshProductNames();

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
        type="number"
        min="0"
        step="any"
        class="table-input js-used-input"
        placeholder="0"
        value="${defaultData.usedQty ?? ""}"
      />
    </td>

    <td class="table-cell">
      <input
        type="text"
        readonly
        class="table-input readonly-input js-price-spent-input"
        placeholder="0.00"
      />
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
  const entry = stockProductsDB[selectedMaterial];
  if (entry) {
    unitBadge.textContent = entry.unit;
    unitBadge.classList.remove("empty");
  } else {
    unitBadge.textContent = "—";
    unitBadge.classList.add("empty");
  }
}

function updateMaterialPrice(row) {
  const materialInput = row.querySelector(".js-material-input");
  const usedInput = row.querySelector(".js-used-input");
  const priceInput = row.querySelector(".js-price-spent-input");
  const materialName = materialInput.value.trim();
  const unitPrice = (stockProductsDB[materialName] || {}).price || 0;
  const used = parseNumber(usedInput.value);
  const total = unitPrice * used;
  priceInput.value = total > 0 ? total.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
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
  const matches = normalized
    ? productNames.filter(name => name.toLowerCase().includes(normalized))
    : productNames;

  if (!matches.length) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.add("hidden");
    return;
  }

  suggestionsBox.innerHTML = matches
    .map(name => `<button type="button" class="material-suggestion-btn" data-material="${name}">${name}</button>`)
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
  const usedInput = row.querySelector(".js-used-input");
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
    updateMaterialPrice(row);
  });

  allocatedInput.addEventListener("input", () => {
    setActiveRow(row);
    updateBalance(row);
  });

  usedInput.addEventListener("input", () => {
    setActiveRow(row);
    updateMaterialPrice(row);
  });

  issueBtn.addEventListener("click", () => openIssueNowModal(rowId));
  viewBtn.addEventListener("click", () => openViewListModal(rowId));

  suggestionsBox.addEventListener("click", (e) => {
    const button = e.target.closest("[data-material]");
    if (!button) return;

    materialInput.value = button.dataset.material;
    updateUnitBadge(row);
    updateBalance(row);
    updateMaterialPrice(row);
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

// --- Add New Product Mock Feature ---
const addNewProductBtn = document.getElementById("addNewProductBtn");
const addProductModal = document.getElementById("addProductModal");
const addProductClose = document.getElementById("addProductClose");
const cancelAddProductBtn = document.getElementById("cancelAddProductBtn");
const submitAddProductBtn = document.getElementById("submitAddProductBtn");
const newProductNameInput = document.getElementById("newProductNameInput");
const newProductUnitInput = document.getElementById("newProductUnitInput");
const newProductPriceInput = document.getElementById("newProductPriceInput");
const addProductError = document.getElementById("addProductError");
const addProductSuccess = document.getElementById("addProductSuccess");

function openAddProductModal() {
  addProductError.style.display = "none";
  addProductSuccess.style.display = "none";
  newProductNameInput.value = "";
  newProductUnitInput.value = "";
  newProductPriceInput.value = "";
  addProductModal.style.display = "flex";
  newProductNameInput.focus();
}

function closeAddProductModal() {
  addProductModal.style.display = "none";
}

function normalizeProductName(name) {
  return name.trim().replace(/\s+/g, " ").toUpperCase();
}

function addNewProductToList() {
  const productName = normalizeProductName(newProductNameInput.value);
  const unit = newProductUnitInput.value.trim().replace(/\s+/g, " ").toUpperCase() || "NOS";
  const price = parseFloat(newProductPriceInput.value);

  addProductError.style.display = "none";
  addProductSuccess.style.display = "none";

  if (!productName) {
    addProductError.textContent = "Please enter the product name.";
    addProductError.style.display = "block";
    return;
  }

  if (Number.isNaN(price) || price < 0) {
    addProductError.textContent = "Please enter a valid per item price.";
    addProductError.style.display = "block";
    return;
  }

  if (stockProductsDB[productName]) {
    addProductError.textContent = "This product already exists in the item list.";
    addProductError.style.display = "block";
    return;
  }

  stockProductsDB[productName] = { unit, price };
  saveCustomProduct(productName, { unit, price });
  productNames = refreshProductNames();

  addProductSuccess.textContent = "Product added successfully.";
  addProductSuccess.style.display = "block";

  setTimeout(() => {
    closeAddProductModal();
  }, 900);
}

if (addNewProductBtn) {
  addNewProductBtn.addEventListener("click", openAddProductModal);
}

if (submitAddProductBtn) {
  submitAddProductBtn.addEventListener("click", addNewProductToList);
}

if (cancelAddProductBtn) {
  cancelAddProductBtn.addEventListener("click", closeAddProductModal);
}

if (addProductClose) {
  addProductClose.addEventListener("click", closeAddProductModal);
}

if (addProductModal) {
  addProductModal.addEventListener("click", (e) => {
    if (e.target === addProductModal) closeAddProductModal();
  });
}

[newProductNameInput, newProductUnitInput, newProductPriceInput].forEach(input => {
  if (!input) return;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addNewProductToList();
  });
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
        class="table-input readonly-input js-tool-price-spent-input"
        placeholder="0.00"
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
  const entry = stockProductsDB[selectedTool];
  if (entry) {
    unitBadge.textContent = entry.unit;
    unitBadge.classList.remove("empty");
  } else {
    unitBadge.textContent = "—";
    unitBadge.classList.add("empty");
  }
}

function updateToolPrice(row) {
  const toolInput = row.querySelector(".js-tool-input");
  const usedInput = row.querySelector(".js-tool-used-input");
  const priceInput = row.querySelector(".js-tool-price-spent-input");
  const toolName = toolInput.value.trim();
  const unitPrice = (stockProductsDB[toolName] || {}).price || 0;
  const used = parseNumber(usedInput.value);
  const total = unitPrice * used;
  priceInput.value = total > 0 ? total.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
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

  updateToolPrice(row);
}

function showToolSuggestions(row, query) {
  const suggestionsBox = row.querySelector(".js-tool-suggestions");
  const normalized = query.trim().toLowerCase();
  const matches = normalized
    ? productNames.filter(name => name.toLowerCase().includes(normalized))
    : productNames;

  if (!matches.length) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.add("hidden");
    return;
  }

  suggestionsBox.innerHTML = matches
    .map(name => `<button type="button" class="material-suggestion-btn" data-tool="${name}">${name}</button>`)
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
    updateToolPrice(row);
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
    updateToolPrice(row);
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
        used: safeText(row.querySelector(".js-used-input")?.value),
        price: safeText(row.querySelector(".js-price-spent-input")?.value),
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
        price: safeText(row.querySelector(".js-tool-price-spent-input")?.value),
        balance: safeText(row.querySelector(".js-tool-balance-input")?.value)
      });
    });
  }

  return rows;
}

function renderPrintTableRows(targetBodyId, rows, emptyMessage, type) {
  const tbody = document.getElementById(targetBodyId);
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-print-row">${emptyMessage}</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = rows.map(row => `
    <tr>
      <td>${row.no}</td>
      <td>${row.description}</td>
      <td>${row.allocated}</td>
      <td>${row.unit}</td>
      <td>${row.cumulative}</td>
      <td>${row.used}</td>
      <td>${row.price}</td>
      <td>${row.balance}</td>
    </tr>
  `).join("");
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
