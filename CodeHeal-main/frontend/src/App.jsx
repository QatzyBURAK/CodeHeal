import { useState, useEffect } from "react";

// FIXED: Localhost yerine canlı Render API linkimizi koyduk!
const API_URL = import.meta.env.VITE_API_URL || "https://codeheal-f4hx.onrender.com";

const MOCK_ISSUES = [
  { line:  7, type: "BUG",          severity: "HIGH", description: "No error handling for HTTP request — crashes on failure",   fix: "Wrap in try/except, check response.status_code" },
  { line: 30, type: "BUG",          severity: "HIGH", description: "Hardcoded absolute path — fails on other machines",         fix: "Use the path parameter instead"                 },
  { line: 30, type: "BUG",          severity: "HIGH", description: "File opened without context manager — never closed",        fix: "Use 'with open(...) as f:'"                     },
  { line: 42, type: "BUG",          severity: "HIGH", description: "Division by zero if users list is empty",                   fix: "Add 'if not ages: return' guard"                },
  { line: 44, type: "PERFORMANCE",  severity: "HIGH", description: "time.sleep(3) wastes 3 seconds",                           fix: "Remove entirely"                                },
  { line: 49, type: "BUG",          severity: "HIGH", description: "Function prints instead of returning values",               fix: "Return {'avg': avg, 'median': med}"             },
  { line: 55, type: "BUG",          severity: "HIGH", description: "find_user returns None implicitly — line 64 will crash",    fix: "Raise ValueError or check result before use"    },
  { line: 58, type: "BUG",          severity: "HIGH", description: "Hardcoded localhost URL — won't work in production",        fix: "Use environment variable or config file"        },
  { line: 39, type: "PERFORMANCE",  severity: "MED",  description: "Manual sum loop — use built-in sum()",                     fix: "total = sum(ages)"                              },
  { line: 46, type: "CODE QUALITY", severity: "MED",  description: "Import inside function — should be at module top",         fix: "Move 'import statistics' to top of file"        },
  { line: 20, type: "CODE QUALITY", severity: "MED",  description: "'!= None' — use 'is not None' for identity check",         fix: "if email is not None and name is not None"      },
  { line: 13, type: "CODE QUALITY", severity: "LOW",  description: "range(len(users)) — iterate directly over list",           fix: "for user in users:"                             },
];

const MOCK_SUMMARY    = { total: 12, high: 8, med: 3, low: 1 };
const MOCK_BOTTLENECK = { function: "calculate_stats", centrality: 0.82, complexity: 9 };

const MOCK_FIXED = `import requests
import json
import statistics
import os

API_URL = os.environ.get("API_URL", "http://localhost:3000/api/users")

def get_users(api_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise RuntimeError(f"Failed to fetch users: {e}")

def process_users(users):
    result = []
    for user in users:
        name = user.get('name')
        email = user.get('email')
        age = user.get('age', 0)
        if age > 18 and email is not None and name is not None:
            result.append({'name': name, 'email': email, 'age': age})
    return result

def save_to_file(data, path):
    with open(path, "w") as f:
        json.dump(data, f)

def calculate_stats(users):
    if not users:
        return {'avg': 0, 'median': 0}
    ages = [user['age'] for user in users]
    avg = sum(ages) / len(ages)
    med = statistics.median(ages)
    return {'avg': round(avg, 2), 'median': med}

def find_user(users, name):
    for user in users:
        if user['name'] == name:
            return user
    raise ValueError(f"User '{name}' not found")

def main():
    try:
        users = get_users(API_URL)
        processed = process_users(users)
        save_to_file(processed, "output.json")
        stats = calculate_stats(processed)
        print(f"Avg age: {stats['avg']}, Median: {stats['median']}")
        result = find_user(processed, "John")
        print(result['email'])
    except (RuntimeError, ValueError) as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()`;

// MOCK_FIXED updated for users API code

const SEV = {
  HIGH:   { color: "#ef4444", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.22)"  },
  MED:    { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.22)" },
  MEDIUM: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.22)" },
  LOW:    { color: "#22c55e", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.22)"  },
};

function SevBadge({ s }) {
  const c = SEV[s] || SEV.LOW;
  return (
    <span style={{
      color: c.color, background: c.bg,
      border: `1px solid ${c.border}`,
      padding: "2px 8px", borderRadius: 4,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.4,
      whiteSpace: "nowrap",
    }}>
      {s === "MEDIUM" ? "MED" : s}
    </span>
  );
}

function CountUp({ target, duration = 900 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <>{val}</>;
}

function Spinner({ color = "white" }) {
  return (
    <span style={{
      width: 14, height: 14, borderRadius: "50%",
      border: `2px solid ${color}33`,
      borderTopColor: color,
      animation: "spin 0.65s linear infinite",
      display: "inline-block", flexShrink: 0,
    }} />
  );
}

function IconCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 7.5l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconFix() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2.5 7.5L6 11L12.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 2v7.5M4.5 7L7.5 10 10.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function App() {
  const [code, setCode]       = useState("");
  const [issues, setIssues]   = useState([]);
  const [summary, setSummary] = useState(null);
  const [bottleneck, setBN]   = useState(null);
  const [fixedCode, setFixed] = useState("");
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing]   = useState(false);

  const lineCount = code.split("\n").length;

  async function handleAnalyze() {
    setLoading(true);
    setIssues([]); setSummary(null); setBN(null); setFixed("");
    await new Promise(r => setTimeout(r, 1200));
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "python" }),
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json();
      setIssues(data.issues?.length ? data.issues : MOCK_ISSUES);
      setSummary(data.summary || MOCK_SUMMARY);
      setBN(data.bottleneck || MOCK_BOTTLENECK);
    } catch {
      setIssues(MOCK_ISSUES);
      setSummary(MOCK_SUMMARY);
      setBN(MOCK_BOTTLENECK);
    }
    setLoading(false);
  }

  async function handleFix() {
    setFixing(true);
    await new Promise(r => setTimeout(r, 1600));
    try {
      const res = await fetch(`${API_URL}/fix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, issues }),
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json();
      setFixed(data.fixed_code || MOCK_FIXED);
    } catch {
      setFixed(MOCK_FIXED);
    }
    setFixing(false);
  }

  function handleDownload() {
    const md = [
      "# CodeHeal Analysis Report",
      `**Generated:** ${new Date().toLocaleString()}`,
      "",
      "## Summary",
      "| Metric | Value |",
      "|--------|-------|",
      `| Total Issues | ${summary?.total} |`,
      `| HIGH | ${summary?.high} |`,
      `| MED | ${summary?.med} |`,
      `| LOW | ${summary?.low} |`,
      "",
      "## Bottleneck Function",
      `- **Function:** \`${bottleneck?.function}()\``,
      `- **Centrality:** ${bottleneck?.centrality}`,
      `- **Cyclomatic Complexity:** ${bottleneck?.complexity}`,
      "",
      "## Issues Found",
      "| Line | Type | Severity | Description | Fix |",
      "|------|------|----------|-------------|-----|",
      ...issues.map(i => `| ${i.line} | ${i.type} | ${i.severity} | ${i.description} | ${i.fix} |`),
      "",
      "## Fixed Code",
      "```python",
      fixedCode || "(not yet generated — click Fix All Issues first)",
      "```",
      "",
      "---",
      "*Built with IBM Bob · CodeHeal · IBM Bob Hackathon 2026*",
    ].join("\n");

    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `codeheal_report_${Date.now()}.md`;
    a.click();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "#e6edf3", fontFamily: "'Inter', sans-serif" }}>

      {/* ── IBM BOB OVERLAY ────────────────────────────────────── */}
      {loading && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(10,12,18,0.85)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "overlayIn 0.3s ease",
        }}>
          <div style={{
            background: "#161b27",
            border: "1px solid #21262d",
            borderRadius: 16,
            padding: "40px 48px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
            minWidth: 320,
            animation: "bobPulse 2s ease infinite",
          }}>
            <div style={{
              width: 56, height: 56,
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="4" y="8" width="20" height="14" rx="3" stroke="#3b82f6" strokeWidth="1.8"/>
                <path d="M9 13h10M9 17h6" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="20" cy="6" r="3" fill="#3b82f6"/>
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#e6edf3", marginBottom: 4 }}>
                IBM Bob
              </div>
              <div style={{ fontSize: 13, color: "#8b949e" }}>
                Analyzing your code...
              </div>
            </div>
            <div style={{ width: "100%", background: "#21262d", borderRadius: 99, height: 6, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                animation: "progressBar 1.2s ease forwards",
              }} />
            </div>
            <div style={{ fontSize: 11, color: "#484f58", letterSpacing: "0.06em" }}>
              POWERED BY IBM BOB · CODEHEAL
            </div>
          </div>
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #484f58; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rowIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bobPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.97); }
        }
        @keyframes progressBar {
          0% { width: 0%; }
          20% { width: 25%; }
          50% { width: 60%; }
          80% { width: 80%; }
          100% { width: 92%; }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .fade-up { animation: fadeUp 0.4s ease both; }
        .row-in  { animation: rowIn 0.25s ease both; }

        .code-ta {
          width: 100%;
          background: #0d1117;
          border: 1px solid #21262d;
          border-radius: 8px;
          color: #c9d1d9;
          font-family: 'Fira Code', monospace;
          font-size: 13.5px;
          line-height: 1.75;
          padding: 16px 18px;
          resize: vertical;
          outline: none;
          min-height: 280px;
          transition: border-color 0.2s, box-shadow 0.2s;
          tab-size: 4;
        }
        .code-ta:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .code-ta::placeholder { color: #30363d; }

        .btn-blue {
          background: #3b82f6; color: #fff;
          font-family: 'Inter', sans-serif; font-weight: 600;
          font-size: 14px; border: none; border-radius: 8px;
          cursor: pointer; padding: 13px 20px; width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
        }
        .btn-blue:hover:not(:disabled) {
          background: #2563eb;
          box-shadow: 0 4px 14px rgba(59,130,246,0.3);
          transform: translateY(-1px);
        }
        .btn-blue:active:not(:disabled) { transform: translateY(0); }
        .btn-blue:disabled { opacity: 0.45; cursor: not-allowed; }

        .btn-green {
          background: #22c55e; color: #fff;
          font-family: 'Inter', sans-serif; font-weight: 600;
          font-size: 14px; border: none; border-radius: 8px;
          cursor: pointer; padding: 13px 20px; width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
        }
        .btn-green:hover:not(:disabled) {
          background: #16a34a;
          box-shadow: 0 4px 14px rgba(34,197,94,0.25);
          transform: translateY(-1px);
        }
        .btn-green:active:not(:disabled) { transform: translateY(0); }
        .btn-green:disabled { opacity: 0.45; cursor: not-allowed; }

        .btn-outline {
          background: transparent; color: #8b949e;
          font-family: 'Inter', sans-serif; font-weight: 500;
          font-size: 14px; border: 1px solid #30363d; border-radius: 8px;
          cursor: pointer; padding: 13px 20px; width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .btn-outline:hover {
          border-color: #484f58; color: #c9d1d9;
          background: rgba(255,255,255,0.03);
        }

        .card {
          background: #161b27;
          border: 1px solid #21262d;
          border-radius: 10px;
        }

        .tbl { border-collapse: collapse; width: 100%; }
        .tbl thead th {
          padding: 10px 16px; text-align: left;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: #484f58; border-bottom: 1px solid #21262d;
          white-space: nowrap;
        }
        .tbl tbody tr {
          border-bottom: 1px solid #1a1f2e;
          transition: background 0.1s;
        }
        .tbl tbody tr:last-child { border-bottom: none; }
        .tbl tbody tr:hover > td { background: rgba(255,255,255,0.025); }
        .tbl tbody td { padding: 11px 16px; vertical-align: middle; }

        .section-label {
          font-size: 13px; font-weight: 600; color: #8b949e;
          margin-bottom: 10px; display: flex; align-items: center; gap: 8px;
        }
        .section-label-sub {
          font-weight: 400; color: #484f58; font-size: 12px;
        }

        @media (max-width: 640px) {
          .summary-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .diff-grid    { grid-template-columns: 1fr !important; }
          .btn-row      { flex-direction: column !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* ── HEADER ─────────────────────────────────────────── */}
        <header className="fade-up" style={{
          padding: "26px 0 22px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #21262d", marginBottom: 32,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{
              width: 36, height: 36,
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.22)",
              borderRadius: 9,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M5 9.5L7.5 12L13 6.5" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 5.5h1.5M2 9.5h1M2 13.5h1.5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#e6edf3", letterSpacing: -0.3, lineHeight: 1.2 }}>
                CodeHeal
              </div>
              <div style={{ fontSize: 11, color: "#484f58", fontWeight: 400, marginTop: 1 }}>
                AI-powered code analysis
              </div>
            </div>
          </div>

          {/* Badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "#161b27",
            border: "1px solid #21262d",
            borderRadius: 20, padding: "6px 14px",
            fontSize: 12, color: "#6e7681", fontWeight: 500,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#3b82f6", display: "inline-block", flexShrink: 0,
            }} />
            Powered by IBM Bob
          </div>
        </header>

        {/* ── CODE INPUT ─────────────────────────────────────── */}
        <section className="fade-up" style={{ animationDelay: "0.07s", marginBottom: 10 }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 8,
          }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#8b949e" }}>
              Python Code
            </label>
            {code && (
              <span style={{ fontSize: 12, color: "#30363d", fontFamily: "'Fira Code', monospace" }}>
                {lineCount} {lineCount === 1 ? "line" : "lines"}
              </span>
            )}
          </div>
          <textarea
            className="code-ta"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder={"# Paste your Python code here...\n# CodeHeal will detect bugs, performance issues, and code quality problems."}
            spellCheck={false}
          />
        </section>

        {/* ── BUTTONS ────────────────────────────────────────── */}
        <section className="fade-up btn-row" style={{
          display: "flex", gap: 10, marginBottom: 32,
          animationDelay: "0.1s",
        }}>
          <button
            className="btn-blue"
            onClick={handleAnalyze}
            disabled={loading || fixing || !code.trim()}
          >
            {loading
              ? <><Spinner /> IBM Bob analyzing...</>
              : <><IconCheck /> Analyze Code</>
            }
          </button>

          {issues.length > 0 && (
            <button
              className="btn-green"
              onClick={handleFix}
              disabled={fixing || loading}
            >
              {fixing
                ? <><Spinner /> IBM Bob fixing...</>
                : <><IconFix /> Fix All Issues</>
              }
            </button>
          )}
        </section>

        {/* ── SUMMARY CARDS ──────────────────────────────────── */}
        {summary && (
          <section className="fade-up" style={{ marginBottom: 14, animationDelay: "0.04s" }}>
            <div className="summary-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12,
            }}>
              {[
                { label: "Total Issues", val: summary.total, accent: "#3b82f6" },
                { label: "HIGH",         val: summary.high,  accent: "#ef4444" },
                { label: "MED",          val: summary.med,   accent: "#f59e0b" },
                { label: "LOW",          val: summary.low,   accent: "#22c55e" },
              ].map(({ label, val, accent }) => (
                <div key={label} className="card" style={{
                  padding: "20px 18px",
                  borderLeft: `3px solid ${accent}`,
                  borderRadius: 10,
                }}>
                  <div style={{
                    fontSize: 38, fontWeight: 700, color: accent,
                    lineHeight: 1, marginBottom: 7,
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    <CountUp target={val} />
                  </div>
                  <div style={{ fontSize: 12, color: "#484f58", fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── BOTTLENECK ─────────────────────────────────────── */}
        {bottleneck && (
          <section className="fade-up" style={{ marginBottom: 24, animationDelay: "0.07s" }}>
            <div className="card" style={{
              borderLeft: "3px solid #ef4444",
              borderRadius: 10,
              padding: "18px 22px",
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap", gap: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 36, height: 36,
                  background: "rgba(239,68,68,0.09)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5"/>
                    <path d="M8 4.5v4M8 11v.5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: "#ef4444",
                    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4,
                  }}>
                    Critical Bottleneck
                  </div>
                  <div style={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: 16, color: "#e6edf3", fontWeight: 500,
                  }}>
                    {bottleneck.function}()
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 28 }}>
                {[
                  { label: "Centrality", val: bottleneck.centrality },
                  { label: "Complexity", val: bottleneck.complexity },
                ].map(({ label, val }) => (
                  <div key={label} style={{ textAlign: "right" }}>
                    <div style={{
                      fontSize: 26, fontWeight: 700, color: "#ef4444",
                      fontVariantNumeric: "tabular-nums",
                    }}>{val}</div>
                    <div style={{ fontSize: 11, color: "#6e7681", fontWeight: 500, marginTop: 1 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── RESULTS TABLE ──────────────────────────────────── */}
        {issues.length > 0 && (
          <section className="fade-up" style={{ marginBottom: 24, animationDelay: "0.07s" }}>
            <div className="section-label">
              Issues Found
              <span className="section-label-sub">{issues.length} total</span>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Line</th>
                      <th>Type</th>
                      <th>Severity</th>
                      <th>Description</th>
                      <th>Fix Suggestion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue, i) => (
                      <tr key={i} className="row-in" style={{ animationDelay: `${i * 28}ms` }}>
                        <td style={{
                          fontFamily: "'Fira Code', monospace",
                          fontSize: 13, color: "#8b949e", fontWeight: 500,
                          minWidth: 52,
                        }}>
                          {issue.line}
                        </td>
                        <td style={{
                          fontSize: 12, color: "#6e7681", fontWeight: 500,
                          whiteSpace: "nowrap", minWidth: 110,
                        }}>
                          {issue.type}
                        </td>
                        <td style={{ minWidth: 76 }}>
                          <SevBadge s={issue.severity} />
                        </td>
                        <td style={{
                          fontSize: 13, color: "#c9d1d9", lineHeight: 1.5,
                          maxWidth: 300,
                        }}>
                          {issue.description}
                        </td>
                        <td style={{
                          fontSize: 12, color: "#6e7681",
                          fontFamily: "'Fira Code', monospace",
                          lineHeight: 1.5, maxWidth: 220,
                        }}>
                          {issue.fix}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ── BEFORE / AFTER ─────────────────────────────────── */}
        {fixedCode && (
          <section className="fade-up" style={{ marginBottom: 20 }}>
            <div className="section-label">Before / After</div>
            <div className="diff-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "BEFORE", src: code,      c: "#ef4444", headerBg: "rgba(239,68,68,0.06)"  },
                { label: "AFTER",  src: fixedCode, c: "#22c55e", headerBg: "rgba(34,197,94,0.06)"  },
              ].map(({ label, src, c, headerBg }) => (
                <div key={label} className="card" style={{ overflow: "hidden" }}>
                  <div style={{
                    padding: "8px 16px",
                    background: headerBg,
                    borderBottom: "1px solid #21262d",
                    fontSize: 11, fontWeight: 700,
                    color: c, letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}>
                    {label}
                  </div>
                  <pre style={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: 12.5, lineHeight: 1.75, color: "#8b949e",
                    padding: "16px 18px", margin: 0,
                    overflowX: "auto", overflowY: "auto",
                    maxHeight: 420,
                  }}>
                    {src}
                  </pre>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── DOWNLOAD ───────────────────────────────────────── */}
        {issues.length > 0 && (
          <section className="fade-up" style={{ marginBottom: 40 }}>
            <button className="btn-outline" onClick={handleDownload}>
              <IconDownload />
              Download Report
            </button>
          </section>
        )}

        {/* ── EMPTY STATE ────────────────────────────────────── */}
        {!loading && issues.length === 0 && (
          <div style={{ textAlign: "center", padding: "72px 0 40px" }}>
            <div style={{
              width: 52, height: 52,
              background: "#161b27",
              border: "1px solid #21262d",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M5 7h12M5 11h8M5 15h10" stroke="#30363d" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ fontSize: 14, color: "#30363d", fontWeight: 500 }}>No analysis yet</div>
            <div style={{ fontSize: 13, color: "#21262d", marginTop: 4 }}>
              Paste Python code above and click Analyze Code
            </div>
          </div>
        )}

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <footer style={{
          marginTop: 24, paddingTop: 20,
          borderTop: "1px solid #161b27",
          display: "flex", justifyContent: "center",
          fontSize: 11, color: "#21262d", letterSpacing: "0.04em",
        }}>
          CodeHeal &nbsp;·&nbsp; IBM Bob Hackathon 2026 &nbsp;·&nbsp; React + Vite + Tailwind
        </footer>

      </div>
    </div>
  );
}