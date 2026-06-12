// ═══════════════════════════════════════════════════════════════════════════════
// EGX Multi-Hop Ontology Reasoning Engine — Core Logic Module
// File: egxOntologyEngine.js  (vanilla JS, framework-agnostic)
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// ONTOLOGY GRAPHS: Multi-hop relationship definitions
// ─────────────────────────────────────────────────────────────────────────────

/** Sector adjacency graph — thematic/cyclical relationships beyond exact match */
export const SECTOR_ADJACENCY = {
  Finance: ["Construction", "ConsumerServices", "RealEstate", "Trade"],
  Construction: ["BasicMaterials", "RealEstate", "Finance", "Energy"],
  BasicMaterials: ["Construction", "Energy", "ConsumerGoods", "Shipping"],
  ConsumerGoods: ["BasicMaterials", "ConsumerServices", "HealthCare", "Agriculture"],
  HealthCare: ["ConsumerGoods", "ConsumerServices", "Pharmaceuticals"],
  Energy: ["BasicMaterials", "Electricity", "Construction", "OilGas"],
  Electricity: ["Energy", "Construction", "Steel"],
  Telecom: ["ITServices", "ConsumerServices", "Finance"],
  ITServices: ["Telecom", "Finance", "ConsumerServices"],
  Shipping: ["Trade", "BasicMaterials", "ConsumerGoods"],
  ConsumerServices: ["Tourism", "ConsumerGoods", "Finance", "HealthCare"],
  RealEstate: ["Finance", "Construction", "HoldingCompanies"],
  Tourism: ["ConsumerServices", "ConsumerGoods", "Hospitals"],
  Trade: ["Shipping", "ConsumerGoods", "Finance"],
  OilGas: ["Energy", "BasicMaterials", "Chemicals"],
  Steel: ["Construction", "BasicMaterials", "Energy", "Electricity"],
  Chemicals: ["BasicMaterials", "HealthCare", "ConsumerGoods", "Pharmaceuticals", "OilGas"],
  Pharmaceuticals: ["HealthCare", "ConsumerGoods", "Chemicals", "Hospitals"],
  Hospitals: ["HealthCare", "ConsumerServices", "Pharmaceuticals"],
  FoodBeverages: ["ConsumerGoods", "Agriculture", "BasicMaterials", "Chemicals"],
  FinancialServices: ["Finance", "RealEstate", "Trade", "HoldingCompanies"],
  HoldingCompanies: ["Finance", "RealEstate", "Construction"],
  Agriculture: ["FoodBeverages", "BasicMaterials", "ConsumerGoods"],
};

/** Industry → canonical sector mapping for cross-layer inference */
export const INDUSTRY_SECTOR = {
  FinancialServices: "Finance",
  Construction: "Construction",
  Chemicals: "BasicMaterials",
  FoodBeverages: "ConsumerGoods",
  Steel: "BasicMaterials",
  OilGas: "Energy",
  Tourism: "ConsumerServices",
  ITServices: "ITServices",
  Telecom: "Telecom",
  Shipping: "Shipping",
  Electricity: "Electricity",
  Pharmaceuticals: "HealthCare",
  Hospitals: "HealthCare",
  ConsumerGoods: "ConsumerGoods",
  RealEstate: "Finance",
  Trade: "Shipping",
  Agriculture: "ConsumerGoods",
  HoldingCompanies: "Finance",
};

/** Supply-chain / value-chain proximity (upstream → downstream) */
export const SUPPLY_CHAIN = {
  Steel: ["Construction", "Energy", "Shipping", "Electricity"],
  Chemicals: ["Pharmaceuticals", "FoodBeverages", "Construction", "ConsumerGoods"],
  OilGas: ["Energy", "Chemicals", "Steel", "BasicMaterials"],
  FoodBeverages: ["ConsumerGoods", "Agriculture", "Chemicals", "Hospitals"],
  Pharmaceuticals: ["Hospitals", "ConsumerGoods", "Chemicals", "HealthCare"],
  Construction: ["RealEstate", "Steel", "Chemicals", "Energy"],
  FinancialServices: ["Trade", "RealEstate", "HoldingCompanies", "ConsumerServices"],
  ITServices: ["Telecom", "FinancialServices", "ConsumerServices", "Trade"],
  Electricity: ["Energy", "Construction", "Steel", "BasicMaterials"],
  Agriculture: ["FoodBeverages", "BasicMaterials", "ConsumerGoods"],
  Tourism: ["ConsumerServices", "ConsumerGoods", "Hospitals"],
  Hospitals: ["HealthCare", "Pharmaceuticals", "ConsumerServices"],
};

/** Thematic cluster mappings — macro-theme co-membership */
export const THEMATIC_CLUSTERS = {
  greenEnergy: ["TAQA", "EGAS", "SWDY", "ELEC", "AMOC"],
  digitalTransformation: ["EFIH", "FWRY", "AMPI", "DGTZ", "RAYA", "ETEL", "OIH", "GTHE"],
  healthcareExpansion: ["ADCI", "RMDA", "CLHO", "NINH", "AXPH", "NIPH", "CPCI", "MIPH", "SPMD", "MCRO", "OCPH", "AMES"],
  foodSecurity: ["ADPC", "JUFO", "EFID", "DOMT", "OLFI", "POUL", "COSG", "AFMC", "EDFM", "IFAP", "INFI", "ISMA", "MOSC", "AIFI"],
  realEstateCycle: ["TMGH", "PHDC", "EMFD", "OCDI", "MASR", "HELI", "ELKA", "ADRI", "ARAB", "CCRS", "PRDC", "EHDR", "ELSH", "UNIT", "GIHD", "RREI", "AFDI", "UEGC", "IDRE"],
  infrastructure: ["ORAS", "SWDY", "ENGC", "CRST", "AREH", "ATQA", "CERA", "LCSW", "ECAP", "ELEC", "MOIL", "EGAS"],
  exportOriented: ["EGAL", "ALCN", "CSAG", "ORWE", "SPIN", "KABO", "APSW", "GTWL", "MFPC", "ABUK", "EGCH", "SKPC"],
  shariahBanking: ["ADIB", "FAIT", "SAUD", "CANA", "QNBE", "UBEE"],
  fintech: ["FWRY", "EFIH", "AMPI", "DGTZ", "VALU", "CNFN", "BTFH"],
  education: ["CIRA", "CAED", "TALM", "MOED"],
  tourismRecovery: ["MHOT", "PHTV", "SPHT", "EGTS", "EITP", "ROTO", "RTVC", "MPRC", "ELWA"],
};

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PALETTES (for UI consumption)
// ─────────────────────────────────────────────────────────────────────────────

export const SECTOR_COLORS = {
  Finance: "#3A7BD5", BasicMaterials: "#E67E22", ConsumerGoods: "#27AE60",
  Construction: "#8E44AD", HealthCare: "#E74C3C", ConsumerServices: "#16A085",
  Energy: "#F39C12", ITServices: "#2980B9", Telecom: "#1ABC9C", Shipping: "#34495E",
  Electricity: "#F1C40F", RealEstate: "#9B59B6", Trade: "#2ECC71",
  OilGas: "#D35400", Steel: "#7F8C8D", Chemicals: "#1ABC9C",
  Pharmaceuticals: "#E74C3C", Hospitals: "#C0392B", FoodBeverages: "#27AE60",
  Agriculture: "#2ECC71", HoldingCompanies: "#8E44AD",
};

export const SCORE_COLORS = {
  sameSector: "#3A7BD5",
  directPeer: "#8E44AD",
  peerHop2: "#9B59B6",
  peerHop3: "#BB8FCE",
  sectorAdjacency: "#E67E22",
  industryMatch: "#F39C12",
  supplyChain: "#D35400",
  thematicCluster: "#27AE60",
  sameIndex: "#2980B9",
  sizeSimilarity: "#1ABC9C",
  momentum: "#27AE60",
  valuation: "#E67E22",
  lowVol: "#1ABC9C",
};

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-HOP ONTOLOGY REASONING FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute transitive closure of peer relationships up to N hops via BFS.
 * Returns Map<symbol, { hops: number, path: string[] }>
 */
export function computePeerClosure(EGX_DATA, seedSymbol, maxHops = 3) {
  const visited = new Map();
  const queue = [{ sym: seedSymbol, hops: 0, path: [seedSymbol] }];
  visited.set(seedSymbol, { hops: 0, path: [seedSymbol] });

  while (queue.length > 0) {
    const current = queue.shift();
    if (current.hops >= maxHops) continue;

    const stock = EGX_DATA[current.sym];
    if (!stock || !stock.peers) continue;

    for (const peer of stock.peers) {
      if (!visited.has(peer)) {
        const newPath = [...current.path, peer];
        visited.set(peer, { hops: current.hops + 1, path: newPath });
        queue.push({ sym: peer, hops: current.hops + 1, path: newPath });
      }
    }
  }

  visited.delete(seedSymbol);
  return visited;
}

/**
 * Compute sector proximity via multi-hop ontology traversal.
 * Returns { score, path: string[], hops, relationType }
 */
export function computeSectorProximity(stockSector, stockIndustry, seedSector, seedIndustry) {
  // Direct sector match (hop 0)
  if (stockSector === seedSector) {
    return { score: 1.0, path: [`${seedSector} ≡ ${stockSector}`], hops: 0, relationType: "sameSector" };
  }

  // Industry match (cross-layer: different sector, same industry)
  if (stockIndustry && seedIndustry && stockIndustry === seedIndustry) {
    return { score: 0.70, path: [`Industry(${seedIndustry}) → ${stockSector}`], hops: 1, relationType: "industryMatch" };
  }

  // Sector adjacency (hop 1 in sector graph)
  const adjacent = SECTOR_ADJACENCY[seedSector] || [];
  if (adjacent.includes(stockSector)) {
    return { score: 0.55, path: [`${seedSector} → ${stockSector} (sector adjacency)`], hops: 1, relationType: "sectorAdjacency" };
  }

  // Industry-based sector inference (hop 2)
  const seedIndustrySector = INDUSTRY_SECTOR[seedIndustry];
  const stockIndustrySector = INDUSTRY_SECTOR[stockIndustry];
  if (seedIndustrySector && stockIndustrySector) {
    if (seedIndustrySector === stockIndustrySector) {
      return { score: 0.45, path: [`${seedSector} → ${seedIndustry} → ${stockIndustrySector}`], hops: 2, relationType: "industrySectorBridge" };
    }
    const stockAdj = SECTOR_ADJACENCY[stockIndustrySector] || [];
    if (stockAdj.includes(seedIndustrySector)) {
      return { score: 0.35, path: [`${seedSector} → ${seedIndustrySector} ↔ ${stockIndustrySector} → ${stockSector}`], hops: 2, relationType: "crossSectorBridge" };
    }
  }

  // Supply chain proximity (hop 2)
  if (seedIndustry && stockIndustry) {
    const supplyTargets = SUPPLY_CHAIN[seedIndustry] || [];
    if (supplyTargets.includes(stockIndustry)) {
      return { score: 0.40, path: [`${seedIndustry} → supplies → ${stockIndustry}`], hops: 2, relationType: "supplyChainDownstream" };
    }
    const reverseSupply = SUPPLY_CHAIN[stockIndustry] || [];
    if (reverseSupply.includes(seedIndustry)) {
      return { score: 0.35, path: [`${stockIndustry} → supplied by → ${seedIndustry}`], hops: 2, relationType: "supplyChainUpstream" };
    }
  }

  // 2-hop sector adjacency
  for (const hop1 of adjacent) {
    const hop2List = SECTOR_ADJACENCY[hop1] || [];
    if (hop2List.includes(stockSector)) {
      return { score: 0.25, path: [`${seedSector} → ${hop1} → ${stockSector}`], hops: 2, relationType: "sectorAdjacency2Hop" };
    }
  }

  return { score: 0, path: [], hops: Infinity, relationType: "none" };
}

/** Check thematic cluster co-membership. Returns { score, theme, path } */
export function computeThematicProximity(seedSymbol, targetSymbol) {
  for (const [theme, members] of Object.entries(THEMATIC_CLUSTERS)) {
    if (members.includes(seedSymbol) && members.includes(targetSymbol)) {
      return { score: 0.38, theme, path: [`Thematic(${theme}): ${seedSymbol} ↔ ${targetSymbol}`] };
    }
  }
  return { score: 0, theme: null, path: [] };
}

/** Compute index co-membership as ontology relation. Returns { score, shared, path } */
export function computeIndexProximity(seedIndices, targetIndices) {
  if (!seedIndices || !targetIndices) return { score: 0, shared: [], path: [] };
  const shared = seedIndices.filter(i => targetIndices.includes(i));
  if (shared.length > 0) {
    return { score: 0.22 * shared.length, shared, path: shared.map(i => `Co-index: ${i}`) };
  }
  return { score: 0, shared: [], path: [] };
}

/** Compute market-cap similarity (size proximity). Returns { score, path } */
export function computeSizeProximity(seedMCap, targetMCap) {
  if (!seedMCap || !targetMCap || seedMCap === 0) return { score: 0, path: [] };
  const ratio = Math.min(seedMCap, targetMCap) / Math.max(seedMCap, targetMCap);
  if (ratio > 0.5) return { score: 0.15 * ratio, path: [`Size similarity: ${(ratio * 100).toFixed(0)}%`] };
  return { score: 0, path: [] };
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORING CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const SCORE_WEIGHTS = {
  sameSector: 0.50,
  directPeer: 0.60,
  sameIndex: 0.25,
  peerHop2: 0.32,
  peerHop3: 0.18,
  sectorAdjacency: 0.30,
  industryMatch: 0.35,
  supplyChain: 0.25,
  thematicCluster: 0.28,
  sizeSimilarity: 0.15,
  sectorAdjacency2Hop: 0.18,
  industrySectorBridge: 0.22,
  crossSectorBridge: 0.16,
  momentum: 1.00,
  valuation: 0.30,
  lowVol: 0.20,
  quality: 0.15,
};

export const VOL_THRESHOLDS = { conservative: 0.25, moderate: 0.45, aggressive: 1.5 };
export const HORIZON_MOMENTUM_BOOST = { short: 1.5, medium: 1.0, long: 0.5 };

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MULTI-HOP ONTOLOGY ENGINE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Execute the full multi-hop ontology recommendation engine.
 *
 * @param {Object} EGX_DATA  — the full stocks database object
 * @param {Object} params    — query parameters
 *   @param {string}  params.inputSymbol       — seed stock ticker
 *   @param {string}  params.riskLevel         — "conservative" | "moderate" | "aggressive"
 *   @param {string}  params.investmentPeriod  — "short" | "medium" | "long"
 *   @param {boolean} params.shariahOnly       — filter to Shariah-compliant only
 *   @param {number}  params.maxResults        — top-N to return (default 10)
 *   @param {number}  params.multiHopDepth     — peer BFS depth (default 3)
 *
 * @returns {Object} { results, query, explanation, inferencePath, multiHopGraph }
 */
export function multiHopOntologyEngine(EGX_DATA, params) {
  const {
    inputSymbol,
    riskLevel,
    investmentPeriod,
    shariahOnly,
    maxResults = 10,
    multiHopDepth = 3,
  } = params;

  const inputStock = EGX_DATA[inputSymbol];
  if (!inputStock) {
    return { results: [], query: "", explanation: "", inferencePath: null, multiHopGraph: null };
  }

  const maxVol = VOL_THRESHOLDS[riskLevel];
  const momentumBoost = HORIZON_MOMENTUM_BOOST[investmentPeriod];
  const ALL_SYMBOLS = Object.keys(EGX_DATA);

  // ── Multi-hop peer closure ──
  const peerClosure = computePeerClosure(EGX_DATA, inputSymbol, multiHopDepth);
  const directPeers = new Set(inputStock.peers || []);
  const hop2Peers = new Map();
  const hop3Peers = new Map();
  for (const [sym, data] of peerClosure.entries()) {
    if (data.hops === 2) hop2Peers.set(sym, data);
    if (data.hops === 3) hop3Peers.set(sym, data);
  }

  // ── Build SPARQL query string (for audit / display) ──
  const queryLines = [
    `PREFIX egx: <http://egx.ontology/stocks#>`,
    `PREFIX egx-sector: <http://egx.ontology/sectors#>`,
    `PREFIX egx-industry: <http://egx.ontology/industries#>`,
    `PREFIX egx-supply: <http://egx.ontology/supplychain#>`,
    `PREFIX egx-theme: <http://egx.ontology/themes#>`,
    ``,
    `# Multi-hop ontology query with transitive peer closure`,
    `SELECT ?stock ?name ?sector ?industry ?vol20d ?momentum ?pb ?shariah`,
    `       ?peerDistance ?sectorDistance ?supplyDistance ?themeMatch ?score`,
    `WHERE {`,
    `  ?stock a egx:Stock ;`,
    `         egx:hasSymbol ?sym ;`,
    `         egx:hasCompanyName ?name ;`,
    `         egx:belongsToSector ?sector ;`,
    `         egx:belongsToIndustry ?industry ;`,
    `         egx:isShariahCompliant ?shariah .`,
    ``,
    `  FILTER(?sym != "${inputSymbol}")`,
    `  OPTIONAL { ?stock egx:hasVolatility20D ?vol20d }`,
    `  FILTER(!BOUND(?vol20d) || ?vol20d <= ${maxVol.toFixed(2)})`,
    shariahOnly ? `  FILTER(?shariah = true)` : `  # Shariah unrestricted`,
    ``,
    `  # Transitive peer closure (up to ${multiHopDepth} hops)`,
    `  OPTIONAL { ?stock egx:peerDistance ?peerDistance }`,
    `  OPTIONAL { ?stock egx:sectorDistance ?sectorDistance }`,
    `  OPTIONAL { ?stock egx:supplyDistance ?supplyDistance }`,
    `  OPTIONAL { ?stock egx:themeMatch ?themeMatch }`,
    ``,
    `  OPTIONAL { ?stock egx:hasMomentum90D ?momentum }`,
    `  OPTIONAL { ?stock egx:hasPBRatio ?pb }`,
    ``,
    `  BIND(`,
    `    (IF(BOUND(?peerDistance), 1.0/?peerDistance, 0))`,
    `    + (IF(BOUND(?sectorDistance), 0.5/?sectorDistance, 0))`,
    `    + (IF(BOUND(?momentum), ?momentum * ${momentumBoost.toFixed(1)}, 0))`,
    `    + (IF(BOUND(?pb) && ?pb > 0 && ?pb < 3, 0.3, 0))`,
    `    + (IF(BOUND(?vol20d) && ?vol20d < ${(maxVol * 0.5).toFixed(2)}, 0.2, 0))`,
    `    AS ?score`,
    `  )`,
    `}`,
    `ORDER BY DESC(?score)`,
    `LIMIT ${maxResults}`,
  ];
  const query = queryLines.join("\n");

  // ── XAI: Build inference path ──
  const inferencePath = {
    root: `Seed: ${inputSymbol} (${inputStock.name})`,
    steps: [],
    filters: [],
    scoring: [],
    multiHopStats: {},
  };

  inferencePath.steps.push({
    id: "step-1",
    label: "Ontology Lookup",
    detail: `Resolved ${inputSymbol} → sector=${inputStock.sector}, industry=${inputStock.industry || "n/a"}, peers=[${(inputStock.peers || []).join(", ")}]`,
    status: "ok",
  });

  // ── Universe filtering ──
  let universeSize = ALL_SYMBOLS.length - 1;
  let filtered = ALL_SYMBOLS.filter(sym => sym !== inputSymbol);

  inferencePath.steps.push({
    id: "step-2",
    label: "Universe Definition",
    detail: `Started with ${universeSize} candidate stocks (excluded input)`,
    status: "ok",
  });

  const preShariah = filtered.length;
  if (shariahOnly) {
    filtered = filtered.filter(sym => EGX_DATA[sym].shariah);
    inferencePath.filters.push({
      name: "Shariah Filter",
      before: preShariah,
      after: filtered.length,
      active: true,
      condition: "shariah === true",
    });
  } else {
    inferencePath.filters.push({
      name: "Shariah Filter",
      before: preShariah,
      after: preShariah,
      active: false,
      condition: "shariah === true",
    });
  }

  const preVol = filtered.length;
  filtered = filtered.filter(sym => {
    const v = EGX_DATA[sym].vol20d;
    return v === undefined || v <= maxVol;
  });
  inferencePath.filters.push({
    name: "Volatility Filter",
    before: preVol,
    after: filtered.length,
    active: true,
    condition: `vol20d ≤ ${maxVol} (${riskLevel})`,
  });

  inferencePath.steps.push({
    id: "step-3",
    label: "Hard Filters Applied",
    detail: `${filtered.length} stocks remain after Shariah + Volatility filters`,
    status: filtered.length > 0 ? "ok" : "warn",
  });

  // ── Multi-hop graph for visualization ──
  const multiHopGraph = {
    nodes: [{ id: inputSymbol, label: inputStock.name, type: "seed", sector: inputStock.sector }],
    edges: [],
    paths: [],
  };

  for (const [sym, data] of peerClosure.entries()) {
    const s = EGX_DATA[sym];
    if (!s) continue;
    multiHopGraph.nodes.push({ id: sym, label: s.name, type: `peerHop${data.hops}`, sector: s.sector, hops: data.hops });
    multiHopGraph.edges.push({
      from: data.path[data.path.length - 2],
      to: sym,
      label: `peer`,
      hops: data.hops,
    });
    multiHopGraph.paths.push({
      type: "peerTransitive",
      path: data.path.join(" → "),
      hops: data.hops,
    });
  }

  // ── Enhanced scoring with multi-hop ontology ──
  const candidates = filtered.map(sym => {
    const s = EGX_DATA[sym];
    const breakdown = {};
    const ontologyPaths = [];

    // 1. Direct peer (hop 1)
    let peerScore = 0;
    if (directPeers.has(sym)) {
      peerScore = SCORE_WEIGHTS.directPeer;
      breakdown.directPeer = { value: peerScore, weight: SCORE_WEIGHTS.directPeer, raw: 1, path: `${inputSymbol} → peer → ${sym}` };
      ontologyPaths.push({ type: "directPeer", path: `${inputSymbol} → ${sym}`, score: peerScore });
    }

    // 2. Peer hop 2
    let peerHop2Score = 0;
    if (hop2Peers.has(sym)) {
      const pData = hop2Peers.get(sym);
      peerHop2Score = SCORE_WEIGHTS.peerHop2;
      breakdown.peerHop2 = { value: peerHop2Score, weight: SCORE_WEIGHTS.peerHop2, raw: pData.path, path: pData.path.join(" → ") };
      ontologyPaths.push({ type: "peerHop2", path: pData.path.join(" → "), score: peerHop2Score });
    }

    // 3. Peer hop 3
    let peerHop3Score = 0;
    if (hop3Peers.has(sym)) {
      const pData = hop3Peers.get(sym);
      peerHop3Score = SCORE_WEIGHTS.peerHop3;
      breakdown.peerHop3 = { value: peerHop3Score, weight: SCORE_WEIGHTS.peerHop3, raw: pData.path, path: pData.path.join(" → ") };
      ontologyPaths.push({ type: "peerHop3", path: pData.path.join(" → "), score: peerHop3Score });
    }

    // 4. Sector proximity (multi-hop)
    const sectorProx = computeSectorProximity(s.sector, s.industry, inputStock.sector, inputStock.industry);
    let sectorScore = 0;
    if (sectorProx.score > 0) {
      const wKey = sectorProx.relationType;
      const weight = SCORE_WEIGHTS[wKey] || 0.20;
      sectorScore = sectorProx.score * weight;
      breakdown[wKey] = { value: sectorScore, weight, raw: sectorProx.score, path: sectorProx.path.join("; ") };
      ontologyPaths.push({ type: wKey, path: sectorProx.path.join("; "), score: sectorScore, hops: sectorProx.hops });
      multiHopGraph.edges.push({
        from: inputSymbol,
        to: sym,
        label: wKey,
        hops: sectorProx.hops,
        score: sectorScore,
      });
    }

    // 5. Thematic cluster
    const thematic = computeThematicProximity(inputSymbol, sym);
    let thematicScore = 0;
    if (thematic.score > 0) {
      thematicScore = thematic.score;
      breakdown.thematicCluster = { value: thematicScore, weight: SCORE_WEIGHTS.thematicCluster, raw: thematic.theme, path: thematic.path[0] };
      ontologyPaths.push({ type: "thematic", path: thematic.path[0], score: thematicScore });
    }

    // 6. Index co-membership
    const indexProx = computeIndexProximity(inputStock.indices, s.indices);
    let indexScore = 0;
    if (indexProx.score > 0) {
      indexScore = indexProx.score;
      breakdown.sameIndex = { value: indexScore, weight: SCORE_WEIGHTS.sameIndex, raw: indexProx.shared.join(", "), path: indexProx.path.join("; ") };
      ontologyPaths.push({ type: "index", path: indexProx.path.join("; "), score: indexScore });
    }

    // 7. Size similarity
    const sizeProx = computeSizeProximity(inputStock.mcap, s.mcap);
    let sizeScore = 0;
    if (sizeProx.score > 0) {
      sizeScore = sizeProx.score;
      breakdown.sizeSimilarity = { value: sizeScore, weight: SCORE_WEIGHTS.sizeSimilarity, raw: sizeProx.path[0], path: sizeProx.path[0] };
    }

    // 8. Momentum (financial signal)
    const momentumRaw = s.momentum !== undefined ? s.momentum : 0;
    const momentumScore = momentumRaw * momentumBoost;
    breakdown.momentum = { value: momentumScore, weight: momentumBoost, raw: momentumRaw, path: `momentum=${momentumRaw} × boost=${momentumBoost}` };

    // 9. Valuation
    const valuationBonus = (s.pb !== undefined && s.pb > 0 && s.pb < 3) ? SCORE_WEIGHTS.valuation : 0;
    if (valuationBonus > 0) {
      breakdown.valuation = { value: valuationBonus, weight: SCORE_WEIGHTS.valuation, raw: s.pb, path: `P/B=${s.pb.toFixed(2)} ∈ (0,3)` };
    }

    // 10. Low volatility
    const lowVolBonus = (s.vol20d !== undefined && s.vol20d < maxVol * 0.5) ? SCORE_WEIGHTS.lowVol : 0;
    if (lowVolBonus > 0) {
      breakdown.lowVol = { value: lowVolBonus, weight: SCORE_WEIGHTS.lowVol, raw: s.vol20d, path: `vol=${s.vol20d.toFixed(3)} < ${(maxVol * 0.5).toFixed(2)}` };
    }

    // Composite score
    const score = peerScore + peerHop2Score + peerHop3Score + sectorScore + thematicScore + indexScore + sizeScore + momentumScore + valuationBonus + lowVolBonus;

    // Human-readable reasons
    const reasons = [];
    if (peerScore > 0) reasons.push("Direct peer");
    if (peerHop2Score > 0) reasons.push("2-hop peer");
    if (peerHop3Score > 0) reasons.push("3-hop peer");
    if (sectorProx.relationType === "sameSector") reasons.push(`Same sector (${s.sector})`);
    if (sectorProx.relationType === "sectorAdjacency") reasons.push(`Adjacent sector (${s.sector})`);
    if (sectorProx.relationType === "industryMatch") reasons.push(`Same industry (${s.industry})`);
    if (sectorProx.relationType === "supplyChainDownstream") reasons.push("Supply chain downstream");
    if (sectorProx.relationType === "supplyChainUpstream") reasons.push("Supply chain upstream");
    if (thematicScore > 0) reasons.push(`Thematic: ${thematic.theme}`);
    if (indexScore > 0) reasons.push(`Co-index: ${indexProx.shared.join(", ")}`);
    if (s.shariah) reasons.push("Shariah compliant");
    if (s.momentum !== undefined && s.momentum > 0.2) reasons.push("Strong 90D momentum");
    if (s.pb !== undefined && s.pb > 0 && s.pb < 1) reasons.push("Undervalued (P/B < 1)");

    return {
      ...s,
      score,
      reasons,
      scoreBreakdown: breakdown,
      ontologyPaths,
      multiHopInfo: {
        peerDistance: peerClosure.has(sym) ? peerClosure.get(sym).hops : null,
        sectorRelation: sectorProx.relationType,
        sectorHops: sectorProx.hops,
        thematicTheme: thematic.theme,
      },
    };
  }).sort((a, b) => b.score - a.score).slice(0, maxResults);

  // ── XAI scoring weights documentation ──
  inferencePath.scoring = [
    { name: "Direct Peer", weight: SCORE_WEIGHTS.directPeer, desc: "Listed in seed stock peers[]" },
    { name: "Peer (2-hop)", weight: SCORE_WEIGHTS.peerHop2, desc: "Peer-of-peer transitive closure" },
    { name: "Peer (3-hop)", weight: SCORE_WEIGHTS.peerHop3, desc: "Peer-of-peer-of-peer transitive closure" },
    { name: "Sector Match", weight: SCORE_WEIGHTS.sameSector, desc: "Same sector as seed" },
    { name: "Sector Adjacency", weight: SCORE_WEIGHTS.sectorAdjacency, desc: "Adjacent sector in ontology graph" },
    { name: "Industry Match", weight: SCORE_WEIGHTS.industryMatch, desc: "Same industry, different sector" },
    { name: "Supply Chain", weight: SCORE_WEIGHTS.supplyChain, desc: "Upstream/downstream industry link" },
    { name: "Thematic Cluster", weight: SCORE_WEIGHTS.thematicCluster, desc: "Co-membership in macro theme" },
    { name: "Index Co-membership", weight: SCORE_WEIGHTS.sameIndex, desc: "Shared EGX index membership" },
    { name: "Size Similarity", weight: SCORE_WEIGHTS.sizeSimilarity, desc: "Market-cap proximity" },
    { name: "Momentum", weight: `1.0 × ${momentumBoost}`, desc: `90D momentum × ${investmentPeriod} boost` },
    { name: "Valuation", weight: SCORE_WEIGHTS.valuation, desc: "P/B between 0 and 3" },
    { name: "Low Volatility", weight: SCORE_WEIGHTS.lowVol, desc: `Vol < ${(maxVol * 0.5).toFixed(2)}` },
  ];

  inferencePath.multiHopStats = {
    totalPeers: peerClosure.size,
    directPeers: directPeers.size,
    hop2Peers: hop2Peers.size,
    hop3Peers: hop3Peers.size,
    sectorRelations: candidates.filter(c => c.multiHopInfo.sectorRelation !== "none").length,
    thematicMatches: candidates.filter(c => c.multiHopInfo.thematicTheme).length,
  };

  inferencePath.steps.push({
    id: "step-4",
    label: "Multi-Hop Ontology Expansion",
    detail: `Discovered ${peerClosure.size} transitive peers (${directPeers.size} direct, ${hop2Peers.size} 2-hop, ${hop3Peers.size} 3-hop). Sector graph traversed up to 2 hops.`,
    status: "ok",
  });

  inferencePath.steps.push({
    id: "step-5",
    label: "Composite Scoring",
    detail: `Scored ${filtered.length} stocks using 13 weighted ontology + financial features; returned top ${candidates.length}`,
    status: "ok",
  });

  const explanation = `Multi-hop ontology query over ${ALL_SYMBOLS.length} EGX stocks. Transitive peer closure (${multiHopDepth} hops): ${peerClosure.size} linked stocks. Sector graph + supply-chain + thematic cluster expansion. Filters: vol≤${maxVol} (${riskLevel}), horizon=${investmentPeriod} (momentum×${momentumBoost})${shariahOnly ? ", Shariah" : ""}.`;

  return { results: candidates, query, explanation, inferencePath, multiHopGraph };
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Get all ontology paths for a specific stock (for deep XAI)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get a human-readable trace of all inference paths from seed to target.
 * Useful for "Why was this recommended?" explanations.
 */
export function explainRecommendation(EGX_DATA, seedSymbol, targetSymbol, params = {}) {
  const seed = EGX_DATA[seedSymbol];
  const target = EGX_DATA[targetSymbol];
  if (!seed || !target) return null;

  const { multiHopDepth = 3 } = params;
  const explanations = [];

  // Peer path
  const closure = computePeerClosure(EGX_DATA, seedSymbol, multiHopDepth);
  if (closure.has(targetSymbol)) {
    const data = closure.get(targetSymbol);
    explanations.push({
      type: "peerTransitive",
      hops: data.hops,
      path: data.path.join(" → "),
      weight: data.hops === 1 ? SCORE_WEIGHTS.directPeer : data.hops === 2 ? SCORE_WEIGHTS.peerHop2 : SCORE_WEIGHTS.peerHop3,
      description: `Linked via ${data.hops}-hop peer chain`,
    });
  }

  // Sector path
  const sectorProx = computeSectorProximity(target.sector, target.industry, seed.sector, seed.industry);
  if (sectorProx.score > 0) {
    explanations.push({
      type: sectorProx.relationType,
      hops: sectorProx.hops,
      path: sectorProx.path.join(" → "),
      weight: SCORE_WEIGHTS[sectorProx.relationType] || 0,
      description: `Sector proximity via ${sectorProx.relationType}`,
    });
  }

  // Thematic path
  const thematic = computeThematicProximity(seedSymbol, targetSymbol);
  if (thematic.score > 0) {
    explanations.push({
      type: "thematic",
      theme: thematic.theme,
      weight: SCORE_WEIGHTS.thematicCluster,
      description: `Both members of "${thematic.theme}" thematic cluster`,
    });
  }

  // Index path
  const indexProx = computeIndexProximity(seed.indices, target.indices);
  if (indexProx.score > 0) {
    explanations.push({
      type: "index",
      shared: indexProx.shared,
      weight: indexProx.score,
      description: `Co-members of ${indexProx.shared.join(", ")}`,
    });
  }

  return {
    seed: seedSymbol,
    target: targetSymbol,
    paths: explanations,
    totalPaths: explanations.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Dump ontology graph as JSON (for external viz tools like D3, Cytoscape)
// ─────────────────────────────────────────────────────────────────────────────

export function exportOntologyGraph(EGX_DATA, seedSymbol, maxHops = 3) {
  const closure = computePeerClosure(EGX_DATA, seedSymbol, maxHops);
  const nodes = [{ id: seedSymbol, group: "seed", sector: EGX_DATA[seedSymbol]?.sector }];
  const links = [];

  for (const [sym, data] of closure.entries()) {
    const stock = EGX_DATA[sym];
    nodes.push({ id: sym, group: `hop${data.hops}`, sector: stock?.sector });
    links.push({
      source: data.path[data.path.length - 2],
      target: sym,
      value: 1 / data.hops,
      type: "peer",
    });
  }

  // Add sector adjacency edges for context
  const seedSector = EGX_DATA[seedSymbol]?.sector;
  if (seedSector && SECTOR_ADJACENCY[seedSector]) {
    for (const adj of SECTOR_ADJACENCY[seedSector]) {
      const adjStocks = Object.entries(EGX_DATA)
        .filter(([, s]) => s.sector === adj && !closure.has(s.symbol) && s.symbol !== seedSymbol)
        .slice(0, 5);
      for (const [sym] of adjStocks) {
        if (!nodes.find(n => n.id === sym)) {
          nodes.push({ id: sym, group: "sectorAdj", sector: adj });
        }
        links.push({ source: seedSymbol, target: sym, value: 0.5, type: "sectorAdj" });
      }
    }
  }

  return { nodes, links };
}
