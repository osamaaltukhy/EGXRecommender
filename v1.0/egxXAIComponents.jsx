// ═══════════════════════════════════════════════════════════════════════════════
// EGX XAI Visualization Components — React Module
// File: egxXAIComponents.jsx
// ═══════════════════════════════════════════════════════════════════════════════

import React from "react";
import {
  SECTOR_COLORS,
  SCORE_COLORS,
  SECTOR_ADJACENCY,
  SUPPLY_CHAIN,
  VOL_THRESHOLDS,
  HORIZON_MOMENTUM_BOOST,
} from "./egxOntologyEngine.js";

// ─────────────────────────────────────────────────────────────────────────────
// ATOMIC COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

export function ScoreBadge({ score }) {
  const pct = Math.min(100, Math.max(0, score * 40));
  const color = score > 1.5 ? "#27AE60" : score > 0.8 ? "#E67E22" : "#3A7BD5";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 56, height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.4s" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, color, minWidth: 28 }}>{score.toFixed(2)}</span>
    </div>
  );
}

export function StockBadge({ symbol, name, sector }) {
  const color = SECTOR_COLORS[sector] || "#888";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "4px 10px", fontSize: 13 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <strong style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{symbol}</strong>
      <span style={{ color: "var(--color-text-secondary)", fontSize: 12, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE DECOMPOSITION (per-stock XAI)
// ─────────────────────────────────────────────────────────────────────────────

export function XAIScoreBreakdown({ breakdown, totalScore, ontologyPaths }) {
  const entries = Object.entries(breakdown).filter(([, v]) => v.value > 0);
  if (entries.length === 0) return null;

  const maxVal = Math.max(...entries.map(([, v]) => v.value), 0.5);

  const labelMap = {
    sameSector: "Sector Match",
    directPeer: "Direct Peer",
    peerHop2: "Peer (2-hop)",
    peerHop3: "Peer (3-hop)",
    sectorAdjacency: "Sector Adjacent",
    sectorAdjacency2Hop: "Sector (2-hop)",
    industryMatch: "Industry Match",
    industrySectorBridge: "Industry Bridge",
    crossSectorBridge: "Cross-Sector",
    supplyChainDownstream: "Supply ↓",
    supplyChainUpstream: "Supply ↑",
    thematicCluster: "Thematic",
    sameIndex: "Co-Index",
    sizeSimilarity: "Size Match",
    lowVol: "Low Vol",
    momentum: "Momentum",
    valuation: "Valuation",
  };

  return (
    <div style={{ marginTop: 8, padding: "10px 12px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
        <span>🔍 Score Decomposition</span>
        <span style={{ color: "var(--color-text-tertiary)" }}>Total: {totalScore.toFixed(2)}</span>
      </div>

      {/* Ontology inference paths */}
      {ontologyPaths && ontologyPaths.length > 0 && (
        <div style={{ marginBottom: 10, padding: "6px 8px", background: "var(--color-background-primary)", borderRadius: "var(--border-radius-sm)", border: "0.5px dashed var(--color-border-secondary)" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-info)", marginBottom: 4 }}>Ontology Paths</div>
          {ontologyPaths.map((op, i) => (
            <div key={i} style={{ fontSize: 10, color: "var(--color-text-secondary)", marginBottom: 2, fontFamily: "var(--font-mono)" }}>
              <span style={{ color: SCORE_COLORS[op.type] || "#888", fontWeight: 500 }}>●</span> {op.path} <span style={{ color: "var(--color-text-tertiary)" }}>(+{op.score.toFixed(2)})</span>
            </div>
          ))}
        </div>
      )}

      {/* Weighted bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {entries.map(([key, data]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: "var(--color-text-secondary)", width: 100, textAlign: "right", flexShrink: 0 }}>
              {labelMap[key] || key[0].toUpperCase() + key.slice(1)}
            </span>
            <div style={{ flex: 1, height: 14, background: "var(--color-background-primary)", borderRadius: 3, overflow: "hidden", position: "relative" }}>
              <div style={{
                width: `${Math.min(100, (data.value / maxVal) * 100)}%`,
                height: "100%",
                background: SCORE_COLORS[key] || "#888",
                borderRadius: 3,
                transition: "width 0.5s ease",
                opacity: 0.85,
              }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 500, color: SCORE_COLORS[key] || "#888", minWidth: 36, textAlign: "right" }}>
              +{data.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-HOP PEER GRAPH VISUALIZATION
// ─────────────────────────────────────────────────────────────────────────────

export function MultiHopGraphView({ graph, inputSymbol }) {
  if (!graph || !graph.nodes.length) return null;

  const seedNode = graph.nodes.find(n => n.type === "seed");
  const peerNodes = graph.nodes.filter(n => n.type !== "seed");
  const directPeers = peerNodes.filter(n => n.hops === 1);
  const hop2Nodes = peerNodes.filter(n => n.hops === 2);
  const hop3Nodes = peerNodes.filter(n => n.hops === 3);

  return (
    <div style={{ marginTop: 12, padding: "12px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10 }}>
        🕸️ Multi-Hop Peer Graph (transitive closure)
      </div>

      {/* Seed */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ padding: "6px 12px", background: "#3A7BD522", border: "1px solid #3A7BD5", borderRadius: "var(--border-radius-md)", fontSize: 12, fontWeight: 600, color: "#3A7BD5" }}>
          {inputSymbol}
        </div>
        <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>seed</span>
      </div>

      {/* Level 1 */}
      {directPeers.length > 0 && (
        <div style={{ marginLeft: 20, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ width: 2, height: 20, background: "var(--color-border-secondary)", marginRight: 4 }} />
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 500 }}>1-hop peers ({directPeers.length})</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginLeft: 12 }}>
            {directPeers.map(n => (
              <span key={n.id} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: (SECTOR_COLORS[n.sector] || "#888") + "22", color: SECTOR_COLORS[n.sector] || "#888", border: `0.5px solid ${(SECTOR_COLORS[n.sector] || "#888")}44`, fontWeight: 500 }}>
                {n.id}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Level 2 */}
      {hop2Nodes.length > 0 && (
        <div style={{ marginLeft: 40, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ width: 2, height: 20, background: "var(--color-border-secondary)", marginRight: 4 }} />
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 500 }}>2-hop peers ({hop2Nodes.length})</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginLeft: 12 }}>
            {hop2Nodes.slice(0, 15).map(n => (
              <span key={n.id} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: (SECTOR_COLORS[n.sector] || "#888") + "15", color: SECTOR_COLORS[n.sector] || "#888", border: `0.5px solid ${(SECTOR_COLORS[n.sector] || "#888")}33`, fontWeight: 500 }}>
                {n.id}
              </span>
            ))}
            {hop2Nodes.length > 15 && (
              <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", padding: "3px 8px" }}>+{hop2Nodes.length - 15} more</span>
            )}
          </div>
        </div>
      )}

      {/* Level 3 */}
      {hop3Nodes.length > 0 && (
        <div style={{ marginLeft: 60, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ width: 2, height: 20, background: "var(--color-border-secondary)", marginRight: 4 }} />
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 500 }}>3-hop peers ({hop3Nodes.length})</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginLeft: 12 }}>
            {hop3Nodes.slice(0, 10).map(n => (
              <span key={n.id} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: (SECTOR_COLORS[n.sector] || "#888") + "10", color: SECTOR_COLORS[n.sector] || "#888", border: `0.5px solid ${(SECTOR_COLORS[n.sector] || "#888")}22`, fontWeight: 500 }}>
                {n.id}
              </span>
            ))}
            {hop3Nodes.length > 10 && (
              <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", padding: "3px 8px" }}>+{hop3Nodes.length - 10} more</span>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "0.5px solid var(--color-border-tertiary)", fontSize: 10, color: "var(--color-text-tertiary)" }}>
        Transitive peer closure computed via BFS over egx:industryPeer edges. 
        Deeper hops receive decaying weights (0.32 → 0.18).
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL INFERENCE PATH VISUALIZATION
// ─────────────────────────────────────────────────────────────────────────────

export function InferencePathView({ path, inputSymbol, riskLevel, investmentPeriod, shariahOnly, multiHopGraph }) {
  if (!path) return null;

  const nodeBase = {
    padding: "10px 14px",
    borderRadius: "var(--border-radius-md)",
    fontSize: 12,
    position: "relative",
    border: "0.5px solid var(--color-border-tertiary)",
  };

  const connector = {
    width: 2,
    height: 16,
    background: "var(--color-border-secondary)",
    marginLeft: 20,
  };

  return (
    <div style={{ marginBottom: "1.5rem", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "16px", border: "0.5px solid var(--color-border-tertiary)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 16 }}>🧠</span>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>XAI Multi-Hop Inference Path</h3>
        <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: "auto" }}>Transparent decision trace</span>
      </div>

      {/* Seed node */}
      <div style={{ ...nodeBase, background: "var(--color-background-info)", borderColor: "var(--color-border-info)" }}>
        <div style={{ fontWeight: 600, color: "var(--color-text-info)", fontSize: 13 }}>🌱 Seed Stock: {path.root}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4 }}>
          Risk={riskLevel} · Horizon={investmentPeriod} · Shariah={shariahOnly ? "Only" : "Any"} · Multi-hop depth=3
        </div>
      </div>
      <div style={connector} />

      {/* Steps */}
      {path.steps.map((step, idx) => (
        <div key={step.id}>
          <div style={{ ...nodeBase, background: "var(--color-background-primary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700,
                background: step.status === "ok" ? "#27AE6022" : "#E74C3C22",
                color: step.status === "ok" ? "#27AE60" : "#E74C3C",
              }}>
                {idx + 1}
              </span>
              <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{step.label}</span>
              {step.status === "warn" && <span style={{ marginLeft: "auto", fontSize: 10, color: "#E74C3C", fontWeight: 500 }}>⚠️ Warning</span>}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 6, marginLeft: 28 }}>{step.detail}</div>
          </div>
          {idx < path.steps.length - 1 && <div style={connector} />}
        </div>
      ))}

      <div style={connector} />

      {/* Multi-hop stats */}
      {path.multiHopStats && (
        <div style={{ ...nodeBase, background: "var(--color-background-primary)", marginBottom: 8 }}>
          <div style={{ fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 8, fontSize: 13 }}>🕸️ Multi-Hop Discovery Stats</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div style={{ textAlign: "center", padding: "8px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-sm)" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#3A7BD5" }}>{path.multiHopStats.totalPeers}</div>
              <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Total linked</div>
            </div>
            <div style={{ textAlign: "center", padding: "8px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-sm)" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#8E44AD" }}>{path.multiHopStats.directPeers}</div>
              <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Direct peers</div>
            </div>
            <div style={{ textAlign: "center", padding: "8px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-sm)" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#9B59B6" }}>{path.multiHopStats.hop2Peers + path.multiHopStats.hop3Peers}</div>
              <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Indirect peers</div>
            </div>
          </div>
        </div>
      )}

      <div style={connector} />

      {/* Filters table */}
      <div style={{ ...nodeBase, background: "var(--color-background-primary)" }}>
        <div style={{ fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 8, fontSize: 13 }}>🔍 Filter Pipeline</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {path.filters.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: f.active ? "#27AE60" : "var(--color-border-secondary)",
                flexShrink: 0,
              }} />
              <span style={{ width: 110, color: "var(--color-text-secondary)", fontWeight: 500 }}>{f.name}</span>
              <span style={{ color: "var(--color-text-tertiary)", flex: 1 }}>{f.condition}</span>
              <span style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
                {f.before} → <strong style={{ color: f.active ? "#27AE60" : "inherit" }}>{f.after}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={connector} />

      {/* Scoring weights */}
      <div style={{ ...nodeBase, background: "var(--color-background-primary)" }}>
        <div style={{ fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 8, fontSize: 13 }}>⚖️ Ontology + Financial Scoring Weights</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {path.scoring.map((s, i) => (
            <div key={i} style={{ padding: "6px 8px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-sm)", fontSize: 11 }}>
              <div style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{s.name}</div>
              <div style={{ color: "var(--color-text-tertiary)", marginTop: 2 }}>{s.desc}</div>
              <div style={{ color: "var(--color-text-info)", fontWeight: 500, marginTop: 2, fontFamily: "var(--font-mono)" }}>weight = {s.weight}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={connector} />

      {/* Final formula */}
      <div style={{ ...nodeBase, background: "#27AE6008", borderColor: "#27AE6033" }}>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)", lineHeight: 1.6 }}>
          <span style={{ color: "#27AE60", fontWeight: 600 }}>score</span> = 
          Σ<sub>peer</sub>(w<sub>hop</sub>/distance) + Σ<sub>sector</sub>(w<sub>adj</sub>·proximity) + Σ<sub>theme</sub>(w<sub>theme</sub>) + 
          momentum(raw×{HORIZON_MOMENTUM_BOOST[investmentPeriod]}) + valuation(0.30) + lowVol(0.20)
        </div>
      </div>

      {/* Multi-hop graph */}
      {multiHopGraph && (
        <>
          <div style={connector} />
          <MultiHopGraphView graph={multiHopGraph} inputSymbol={inputSymbol} />
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ONTOLOGY GRAPH EXPLORERS (standalone educational views)
// ─────────────────────────────────────────────────────────────────────────────

export function SectorAdjacencyGraph() {
  const entries = Object.entries(SECTOR_ADJACENCY);
  return (
    <div style={{ marginTop: 12, padding: "12px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10 }}>
        🗺️ Sector Adjacency Ontology Graph
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {entries.map(([sector, adjacents]) => (
          <div key={sector} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10 }}>
            <span style={{
              padding: "2px 8px",
              borderRadius: 4,
              background: (SECTOR_COLORS[sector] || "#888") + "22",
              color: SECTOR_COLORS[sector] || "#888",
              fontWeight: 600,
              minWidth: 90,
              textAlign: "center",
            }}>
              {sector}
            </span>
            <span style={{ color: "var(--color-text-tertiary)" }}>→</span>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {adjacents.map(adj => (
                <span key={adj} style={{
                  padding: "1px 6px",
                  borderRadius: 3,
                  background: (SECTOR_COLORS[adj] || "#888") + "15",
                  color: SECTOR_COLORS[adj] || "#888",
                  border: `0.5px solid ${(SECTOR_COLORS[adj] || "#888")}33`,
                }}>
                  {adj}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SupplyChainGraph() {
  const entries = Object.entries(SUPPLY_CHAIN);
  return (
    <div style={{ marginTop: 12, padding: "12px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10 }}>
        🔗 Supply-Chain / Value-Chain Ontology
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {entries.map(([industry, targets]) => (
          <div key={industry} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10 }}>
            <span style={{
              padding: "2px 8px",
              borderRadius: 4,
              background: "#E67E2218",
              color: "#E67E22",
              fontWeight: 600,
              minWidth: 100,
              textAlign: "center",
            }}>
              {industry}
            </span>
            <span style={{ color: "var(--color-text-tertiary)" }}>supplies →</span>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {targets.map(t => (
                <span key={t} style={{
                  padding: "1px 6px",
                  borderRadius: 3,
                  background: "#27AE6015",
                  color: "#27AE60",
                  border: "0.5px solid #27AE6033",
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThematicClustersView() {
  const entries = Object.entries(THEMATIC_CLUSTERS);
  return (
    <div style={{ marginTop: 12, padding: "12px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10 }}>
        🎯 Thematic Cluster Ontology
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {entries.map(([theme, members]) => (
          <div key={theme} style={{ padding: "8px", background: "var(--color-background-primary)", borderRadius: "var(--border-radius-sm)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-primary)", textTransform: "capitalize", marginBottom: 4 }}>
              {theme.replace(/([A-Z])/g, " $1").trim()}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {members.map(m => (
                <span key={m} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-tertiary)" }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
