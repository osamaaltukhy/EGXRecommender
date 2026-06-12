// ═══════════════════════════════════════════════════════════════════════════════
// EGX Stock Recommender — Main Component (uses external ontology engine)
// File: EGXRecommender.jsx
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useMemo } from "react";
import {
  multiHopOntologyEngine,
  computePeerClosure,
  explainRecommendation,
  exportOntologyGraph,
  SECTOR_COLORS,
  VOL_THRESHOLDS,
} from "./egxOntologyEngine.js";
import {
  ScoreBadge,
  StockBadge,
  XAIScoreBreakdown,
  InferencePathView,
  MultiHopGraphView,
  SectorAdjacencyGraph,
  SupplyChainGraph,
  ThematicClustersView,
} from "./egxXAIComponents.jsx";

// ── Inline your EGX_DATA here or import it from a data file ──
// const EGX_DATA = { ... };

// For this example, assume EGX_DATA is passed as a prop or imported.
// If you have it inline, keep the same object from your original file.

const ALL_SYMBOLS = (EGX_DATA) => Object.keys(EGX_DATA);
const ALL_SECTORS = (EGX_DATA) => [...new Set(Object.values(EGX_DATA).map(s => s.sector))].sort();

export default function EGXRecommender({ EGX_DATA }) {
  const [inputSymbol, setInputSymbol] = useState("");
  const [symbolSearch, setSymbolSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState("moderate");
  const [investmentPeriod, setInvestmentPeriod] = useState("medium");
  const [shariahOnly, setShariahOnly] = useState(false);
  const [showQuery, setShowQuery] = useState(false);
  const [showXAI, setShowXAI] = useState(true);
  const [showOntologyExplorer, setShowOntologyExplorer] = useState(false);
  const [expandedStock, setExpandedStock] = useState(null);
  const [ran, setRan] = useState(false);

  const symbols = useMemo(() => ALL_SYMBOLS(EGX_DATA), [EGX_DATA]);
  const sectors = useMemo(() => ALL_SECTORS(EGX_DATA), [EGX_DATA]);

  const filteredSymbols = useMemo(() => {
    const q = symbolSearch.toUpperCase();
    if (!q) return symbols.slice(0, 50);
    return symbols.filter(s => {
      const d = EGX_DATA[s];
      return s.includes(q) || (d.name || "").toUpperCase().includes(q);
    }).slice(0, 50);
  }, [symbolSearch, symbols, EGX_DATA]);

  // ── DELEGATE ALL REASONING TO THE ONTOLOGY ENGINE ──
  const { results, query, explanation, inferencePath, multiHopGraph } = useMemo(() => {
    if (!inputSymbol) {
      return { results: [], query: "", explanation: "", inferencePath: null, multiHopGraph: null };
    }
    return multiHopOntologyEngine(EGX_DATA, {
      inputSymbol,
      riskLevel,
      investmentPeriod,
      shariahOnly,
      maxResults: 10,
      multiHopDepth: 3,
    });
  }, [inputSymbol, riskLevel, investmentPeriod, shariahOnly, EGX_DATA]);

  const inputStock = inputSymbol ? EGX_DATA[inputSymbol] : null;

  const riskConfig = {
    conservative: { label: "Conservative", color: "#3A7BD5", icon: "🛡️", vol: "≤ 0.25" },
    moderate: { label: "Moderate", color: "#E67E22", icon: "⚖️", vol: "≤ 0.45" },
    aggressive: { label: "Aggressive", color: "#E74C3C", icon: "🚀", vol: "≤ 1.5" },
  };
  const horizonConfig = {
    short: { label: "Short-term", sub: "< 1 year", boost: "×1.5 momentum" },
    medium: { label: "Medium-term", sub: "1–3 years", boost: "×1.0 momentum" },
    long: { label: "Long-term", sub: "> 3 years", boost: "×0.5 momentum" },
  };

  return (
    <div style={{ padding: "1.5rem 0", fontFamily: "var(--font-sans)" }}>
      <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 4px", color: "var(--color-text-primary)" }}>
        EGX stock recommender
      </h2>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 1.5rem" }}>
        SPARQL-based · Multi-hop ontology · 197 listed stocks · <strong style={{ color: "var(--color-text-info)" }}>XAI-enabled</strong>
      </p>

      {/* ── Seed stock selector ── */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
          Seed stock
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ position: "relative", flex: "1 1 240px" }}>
            <input
              type="text"
              placeholder="Search symbol or name…"
              value={symbolSearch}
              onChange={e => setSymbolSearch(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
            {symbolSearch && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-primary)", borderRadius: "var(--border-radius-md)", zIndex: 100, maxHeight: 220, overflowY: "auto", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                {filteredSymbols.map(sym => (
                  <div key={sym}
                    onClick={() => { setInputSymbol(sym); setSymbolSearch(""); setRan(true); }}
                    style={{ padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, borderBottom: "0.5px solid var(--color-border-tertiary)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--color-background-secondary)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: SECTOR_COLORS[EGX_DATA[sym]?.sector] || "#888", flexShrink: 0 }} />
                    <span style={{ fontWeight: 500, fontSize: 13, color: "var(--color-text-primary)", minWidth: 52 }}>{sym}</span>
                    <span style={{ fontSize: 12, color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{EGX_DATA[sym]?.name}</span>
                    <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: "auto", whiteSpace: "nowrap" }}>{EGX_DATA[sym]?.sector}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {inputStock && <StockBadge symbol={inputSymbol} name={inputStock.name} sector={inputStock.sector} />}
        </div>
      </div>

      {/* ── Risk & Horizon ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.25rem" }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Risk level</label>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(riskConfig).map(([k, v]) => (
              <button key={k} onClick={() => setRiskLevel(k)}
                style={{ flex: 1, padding: "7px 4px", fontSize: 12, fontWeight: riskLevel === k ? 500 : 400,
                  background: riskLevel === k ? v.color : "transparent",
                  color: riskLevel === k ? "#fff" : "var(--color-text-secondary)",
                  border: riskLevel === k ? "none" : "0.5px solid var(--color-border-secondary)",
                  borderRadius: "var(--border-radius-md)", cursor: "pointer", transition: "all 0.15s" }}>
                {v.icon} {v.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Investment horizon</label>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(horizonConfig).map(([k, v]) => (
              <button key={k} onClick={() => setInvestmentPeriod(k)}
                style={{ flex: 1, padding: "7px 4px", fontSize: 12, fontWeight: investmentPeriod === k ? 500 : 400,
                  background: investmentPeriod === k ? "var(--color-background-info)" : "transparent",
                  color: investmentPeriod === k ? "var(--color-text-info)" : "var(--color-text-secondary)",
                  border: investmentPeriod === k ? "0.5px solid var(--color-border-info)" : "0.5px solid var(--color-border-secondary)",
                  borderRadius: "var(--border-radius-md)", cursor: "pointer", transition: "all 0.15s" }}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Shariah toggle ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
        <div onClick={() => setShariahOnly(!shariahOnly)} style={{ width: 36, height: 20, borderRadius: 10, background: shariahOnly ? "#27AE60" : "var(--color-border-secondary)", cursor: "pointer", transition: "background 0.2s", position: "relative" }}>
          <div style={{ position: "absolute", top: 2, left: shariahOnly ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
        </div>
        <label onClick={() => setShariahOnly(!shariahOnly)} style={{ fontSize: 13, cursor: "pointer", color: "var(--color-text-secondary)" }}>
          Shariah-compliant stocks only
        </label>
      </div>

      {/* ── Results ── */}
      {ran && inputStock && (
        <>
          {/* XAI Inference Path */}
          {showXAI && (
            <InferencePathView
              path={inferencePath}
              inputSymbol={inputSymbol}
              riskLevel={riskLevel}
              investmentPeriod={investmentPeriod}
              shariahOnly={shariahOnly}
              multiHopGraph={multiHopGraph}
            />
          )}

          {/* Toggle controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowXAI(!showXAI)}
              style={{ fontSize: 12, padding: "6px 12px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: showXAI ? "var(--color-background-info)" : "transparent", color: showXAI ? "var(--color-text-info)" : "var(--color-text-secondary)", cursor: "pointer" }}
            >
              {showXAI ? "🧠 Hide" : "🧠 Show"} XAI Inference Path
            </button>
            <button
              onClick={() => setShowOntologyExplorer(!showOntologyExplorer)}
              style={{ fontSize: 12, padding: "6px 12px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: showOntologyExplorer ? "var(--color-background-info)" : "transparent", color: showOntologyExplorer ? "var(--color-text-info)" : "var(--color-text-secondary)", cursor: "pointer" }}
            >
              {showOntologyExplorer ? "🗺️ Hide" : "🗺️ Show"} Ontology Explorer
            </button>
          </div>

          {/* Ontology Explorer (standalone educational view) */}
          {showOntologyExplorer && (
            <div style={{ marginBottom: "1.5rem" }}>
              <SectorAdjacencyGraph />
              <SupplyChainGraph />
              <ThematicClustersView />
            </div>
          )}

          {/* Explanation bar */}
          <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px", marginBottom: "1rem", fontSize: 12, color: "var(--color-text-secondary)" }}>
            <span style={{ marginRight: 6, fontSize: 14 }}>ℹ️</span>
            {explanation}
          </div>

          {/* Results list */}
          {results.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-tertiary)", fontSize: 14 }}>
              No stocks match the current filters. Try adjusting risk level or disabling the Shariah filter.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {results.map((s, i) => (
                <div key={s.symbol} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "12px 14px", display: "grid", gridTemplateColumns: "28px 1fr auto", gap: 10, alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", paddingTop: 2, fontWeight: 500 }}>#{i + 1}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>{s.symbol}</span>
                      <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{s.name}</span>
                      <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: (SECTOR_COLORS[s.sector] || "#888") + "22", color: SECTOR_COLORS[s.sector] || "#888", fontWeight: 500 }}>{s.sector}</span>
                      {s.shariah && <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: "#27AE6022", color: "#27AE60", fontWeight: 500 }}>☪ Shariah</span>}
                      {s.indices && s.indices.includes("EGX30") && <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: "#3A7BD522", color: "#3A7BD5", fontWeight: 500 }}>EGX30</span>}
                      {s.multiHopInfo?.peerDistance && s.multiHopInfo.peerDistance > 1 && (
                        <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: "#9B59B622", color: "#9B59B6", fontWeight: 500 }}>
                          {s.multiHopInfo.peerDistance}-hop peer
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                      {s.vol20d !== undefined && <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Vol: <strong style={{ color: "var(--color-text-secondary)" }}>{s.vol20d.toFixed(3)}</strong></span>}
                      {s.momentum !== undefined && <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Mom: <strong style={{ color: s.momentum > 0 ? "#27AE60" : "#E74C3C" }}>{s.momentum > 0 ? "+" : ""}{(s.momentum * 100).toFixed(1)}%</strong></span>}
                      {s.pb !== undefined && s.pb > 0 && <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>P/B: <strong style={{ color: "var(--color-text-secondary)" }}>{s.pb.toFixed(2)}</strong></span>}
                      {s.mcap && <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>MCap: <strong style={{ color: "var(--color-text-secondary)" }}>{(s.mcap / 1e9).toFixed(1)}B EGP</strong></span>}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                      {s.reasons.map(r => (
                        <span key={r} style={{ fontSize: 11, padding: "1px 6px", borderRadius: 3, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-tertiary)" }}>{r}</span>
                      ))}
                    </div>

                    {/* Expandable XAI breakdown */}
                    <button
                      onClick={() => setExpandedStock(expandedStock === s.symbol ? null : s.symbol)}
                      style={{
                        fontSize: 11,
                        color: "var(--color-text-info)",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        marginTop: 4,
                        fontWeight: 500,
                      }}
                    >
                      {expandedStock === s.symbol ? "▲ Hide score breakdown" : "▼ Explain this score"}
                    </button>
                    {expandedStock === s.symbol && (
                      <XAIScoreBreakdown breakdown={s.scoreBreakdown} totalScore={s.score} ontologyPaths={s.ontologyPaths} />
                    )}
                  </div>
                  <ScoreBadge score={s.score} />
                </div>
              ))}
            </div>
          )}

          {/* SPARQL query display */}
          <div style={{ marginTop: "1.5rem" }}>
            <button onClick={() => setShowQuery(!showQuery)} style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>{`</>`}</span>
              {showQuery ? "Hide" : "Show"} generated SPARQL query
            </button>
            {showQuery && (
              <pre style={{ marginTop: 8, background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "12px 14px", fontSize: 11, overflowX: "auto", color: "var(--color-text-secondary)", lineHeight: 1.7, fontFamily: "var(--font-mono)" }}>
                {query}
              </pre>
            )}
          </div>
        </>
      )}

      {!ran && (
        <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--color-text-tertiary)", fontSize: 14, border: "0.5px dashed var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)" }}>
          <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>🔍</span>
          Search for a seed stock above to generate recommendations
        </div>
      )}
    </div>
  );
}
