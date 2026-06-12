// ═══════════════════════════════════════════════════════════════════════════════
// EGX Recommender — Integration Example & Usage Guide
// File: App.jsx (example integration)
// ═══════════════════════════════════════════════════════════════════════════════

import EGXRecommender from "./EGXRecommender.jsx";

// Your EGX data (same as before, or imported from a data file)
const EGX_DATA = {
  "COMI": {
    symbol: "COMI",
    name: "Commercial International Bank - Egypt (CIB)",
    sector: "Finance",
    industry: "FinancialServices",
    shariah: false,
    vol20d: 0.324,
    momentum: 0.373,
    pb: 1.269,
    pe: 4.415,
    mcap: 267901370368,
    peers: ["ADIB"],
    indices: ["EGX30"],
  },
  "ADIB": {
    symbol: "ADIB",
    name: "Abu Dhabi Islamic Bank-Egypt",
    sector: "Finance",
    industry: "FinancialServices",
    shariah: true,
    vol20d: 0.429,
    momentum: 0.889,
    pb: 1.236,
    pe: 3.737,
    mcap: 56834998272,
    peers: ["CANA"],
    indices: ["EGX30"],
  },
  // ... include all your stocks here
};

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1rem" }}>
      <EGXRecommender EGX_DATA={EGX_DATA} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILE STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════
/*
  src/
  ├── egxOntologyEngine.js      ← Pure JS: multi-hop reasoning, graphs, scoring
  ├── egxXAIComponents.jsx      ← React: XAI visualizations
  ├── EGXRecommender.jsx        ← React: main UI component (uses both above)
  ├── App.jsx                   ← Your app entry point
  └── data/
      └── egxData.js            ← Your EGX_DATA object (optional separation)

  IMPORT MAP:
  ┌─────────────────────┐     ┌─────────────────────┐
  │  EGXRecommender.jsx │────▶│ egxXAIComponents.jsx│
  │   (main UI)         │     │  (React viz)        │
  └──────────┬──────────┘     └─────────────────────┘
             │
             └────────────────▶│ egxOntologyEngine.js │
                               │  (core logic)        │
                               └──────────────────────┘
*/

// ═══════════════════════════════════════════════════════════════════════════════
// API REFERENCE — egxOntologyEngine.js
// ═══════════════════════════════════════════════════════════════════════════════

/*
  ── Core Engine ──
  multiHopOntologyEngine(EGX_DATA, params)
    → { results, query, explanation, inferencePath, multiHopGraph }

  ── Individual Reasoning Functions ──
  computePeerClosure(EGX_DATA, seedSymbol, maxHops=3)
    → Map<symbol, { hops, path }>

  computeSectorProximity(stockSector, stockIndustry, seedSector, seedIndustry)
    → { score, path[], hops, relationType }

  computeThematicProximity(seedSymbol, targetSymbol)
    → { score, theme, path[] }

  computeIndexProximity(seedIndices, targetIndices)
    → { score, shared[], path[] }

  computeSizeProximity(seedMCap, targetMCap)
    → { score, path[] }

  ── XAI Utilities ──
  explainRecommendation(EGX_DATA, seedSymbol, targetSymbol, params)
    → { seed, target, paths[], totalPaths }

  exportOntologyGraph(EGX_DATA, seedSymbol, maxHops=3)
    → { nodes[], links[] }  // D3/Cytoscape compatible

  ── Ontology Graphs (raw data) ──
  SECTOR_ADJACENCY   → { sector: [adjacentSectors] }
  SUPPLY_CHAIN       → { industry: [downstreamIndustries] }
  THEMATIC_CLUSTERS  → { theme: [symbols] }
  INDUSTRY_SECTOR    → { industry: sector }

  ── Constants ──
  SCORE_WEIGHTS      → { feature: weight }
  VOL_THRESHOLDS     → { conservative, moderate, aggressive }
  HORIZON_MOMENTUM_BOOST → { short, medium, long }
  SECTOR_COLORS      → { sector: hexColor }
  SCORE_COLORS       → { feature: hexColor }
*/

// ═══════════════════════════════════════════════════════════════════════════════
// API REFERENCE — egxXAIComponents.jsx
// ═══════════════════════════════════════════════════════════════════════════════

/*
  ── Atomic ──
  <ScoreBadge score={number} />
  <StockBadge symbol={string} name={string} sector={string} />

  ── Per-Stock XAI ──
  <XAIScoreBreakdown
    breakdown={stock.scoreBreakdown}
    totalScore={stock.score}
    ontologyPaths={stock.ontologyPaths}
  />

  ── Global XAI ──
  <InferencePathView
    path={inferencePath}
    inputSymbol={string}
    riskLevel={string}
    investmentPeriod={string}
    shariahOnly={boolean}
    multiHopGraph={multiHopGraph}
  />

  <MultiHopGraphView graph={multiHopGraph} inputSymbol={string} />

  ── Ontology Explorers (educational) ──
  <SectorAdjacencyGraph />
  <SupplyChainGraph />
  <ThematicClustersView />
*/

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOMIZATION EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

/*
  ── Add a new thematic cluster ──
  // In egxOntologyEngine.js, add to THEMATIC_CLUSTERS:
  aiRevolution: ["RAYA", "DGTZ", "AMPI", "EFIH"],

  ── Adjust a scoring weight ──
  // In egxOntologyEngine.js, modify SCORE_WEIGHTS:
  thematicCluster: 0.40,  // boost theme importance

  ── Add sector adjacency ──
  // In egxOntologyEngine.js, add to SECTOR_ADJACENCY:
  AI: ["ITServices", "Telecom", "Finance"],

  ── Change multi-hop depth ──
  <EGXRecommender EGX_DATA={EGX_DATA} multiHopDepth={4} />
  // Or pass to engine directly:
  multiHopOntologyEngine(EGX_DATA, { ..., multiHopDepth: 4 })

  ── Use only direct peers (disable multi-hop) ──
  multiHopOntologyEngine(EGX_DATA, { ..., multiHopDepth: 1 })

  ── Export graph for D3 visualization ──
  const graph = exportOntologyGraph(EGX_DATA, "COMI", 3);
  // Pass graph.nodes and graph.links to your D3 force simulation
*/
