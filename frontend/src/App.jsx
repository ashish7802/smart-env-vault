import { useState } from "react";

const PROJECTS = [
  { name: "my-saas-app", count: 14, ver: 7 },
  { name: "llm-toolkit", count: 7, ver: 3 },
  { name: "smart-env-vault", count: 5, ver: 1 },
];

const SECRETS = [
  { key: "DATABASE_URL",   val: "postgresql://ash:pass@localhost:5432/saasdb", type: "url" },
  { key: "OPENAI_API_KEY", val: "sk-proj-xK9mN2vP...",                         type: "string" },
  { key: "JWT_SECRET",     val: "super-secret-jwt-key-32chars",                 type: "string" },
  { key: "REDIS_URL",      val: "redis://localhost:6379",                        type: "url" },
  { key: "PORT",           val: "8000",                                           type: "number" },
  { key: "STRIPE_SECRET",  val: "sk_live_51H...",                                type: "string" },
  { key: "SMTP_HOST",      val: "smtp.gmail.com",                                type: "string" },
  { key: "SMTP_PORT",      val: "587",                                            type: "number" },
];

const ENV_STYLE = {
  development: { color: "#4ade80", bg: "#4ade8011" },
  staging:     { color: "#fbbf24", bg: "#fbbf2411" },
  production:  { color: "#f87171", bg: "#f8717111" },
};

const TYPE_STYLE = {
  string: { color: "#7b6ef6", border: "#7b6ef644" },
  url:    { color: "#4ecca3", border: "#4ecca344" },
  number: { color: "#fbbf24", border: "#fbbf2444" },
};

const mask = (val) => val.slice(0, 4) + "•".repeat(12);

export default function App() {
  const [project, setProject] = useState(0);
  const [env, setEnv]         = useState("development");
  const [revealed, setRevealed] = useState({});
  const [filter, setFilter]   = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const toggleReveal = (i) =>
    setRevealed((r) => ({ ...r, [i]: !r[i] }));

  const runScan = async () => {
    setScanning(true);
    setScanDone(false);
    await new Promise((r) => setTimeout(r, 1800));
    setScanning(false);
    setScanDone(true);
  };

  const visibleSecrets = SECRETS.filter((s) =>
    s.key.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, PROJECTS[project].count);

  const s = {
    shell: { display: "flex", height: "100vh", fontFamily: "'JetBrains Mono', monospace", background: "#0e0e12", color: "#c9cad6", overflow: "hidden" },
    sidebar: { width: 220, background: "#15151c", borderRight: "1px solid #2a2a3a", display: "flex", flexDirection: "column" },
    logo: { padding: "16px 14px", borderBottom: "1px solid #2a2a3a", display: "flex", alignItems: "center", gap: 8 },
    logoBox: { width: 26, height: 26, border: "1.5px solid #7b6ef6", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 },
    navLabel: { fontSize: 9, color: "#5a5b70", letterSpacing: 2, padding: "10px 10px 4px", textTransform: "uppercase" },
    main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
    topbar: { padding: "12px 24px", borderBottom: "1px solid #2a2a3a", display: "flex", alignItems: "center", background: "#15151c" },
    content: { flex: 1, overflowY: "auto", padding: 24 },
    stats: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 },
    statBox: { background: "#15151c", border: "1px solid #2a2a3a", borderRadius: 8, padding: "14px 16px" },
    tableWrap: { background: "#15151c", border: "1px solid #2a2a3a", borderRadius: 8, overflow: "hidden" },
    row: { display: "grid", gridTemplateColumns: "220px 1fr 90px 48px", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #1e1e2a", fontSize: 12 },
  };

  return (
    <div style={s.shell}>
      {/* sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoBox}>🔐</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>env-vault</span>
          <span style={{ marginLeft: "auto", fontSize: 9, color: "#7b6ef6", border: "1px solid #7b6ef6", borderRadius: 3, padding: "1px 5px" }}>v1</span>
        </div>

        <div style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          <div style={s.navLabel}>projects</div>
          {PROJECTS.map((p, i) => (
            <div key={p.name} onClick={() => { setProject(i); setRevealed({}); }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 5, cursor: "pointer", fontSize: 12,
                background: project === i ? "#1c1c26" : "transparent",
                color: project === i ? "#fff" : "#5a5b70",
                borderLeft: project === i ? "2px solid #7b6ef6" : "2px solid transparent",
              }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: ["#7b6ef6","#4ecca3","#fbbf24"][i], flexShrink: 0 }} />
              {p.name}
            </div>
          ))}

          <div style={s.navLabel}>tools</div>
          <div onClick={() => setShowScanner(!showScanner)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 5, cursor: "pointer", fontSize: 12, color: showScanner ? "#f87171" : "#5a5b70" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#f87171", flexShrink: 0 }} />
            secret scanner
          </div>
          {["version history","team access"].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 5, cursor: "pointer", fontSize: 12, color: "#5a5b70" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#2a2a3a", flexShrink: 0 }} />
              {t}
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 14px", borderTop: "1px solid #2a2a3a", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#7b6ef6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#fff" }}>AY</div>
          <div>
            <div style={{ fontSize: 11, color: "#fff" }}>ashish7802</div>
            <div style={{ fontSize: 10, color: "#5a5b70" }}>free tier</div>
          </div>
        </div>
      </aside>

      {/* main */}
      <div style={s.main}>
        <div style={s.topbar}>
          <span style={{ fontSize: 12, color: "#5a5b70" }}>projects / <span style={{ color: "#c9cad6" }}>{PROJECTS[project].name}</span></span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {["vault pull", "+ add secret"].map((label, i) => (
              <button key={label} style={{
                fontFamily: "inherit", fontSize: 11, padding: "6px 12px", borderRadius: 5, cursor: "pointer",
                border: `1px solid ${i === 1 ? "#7b6ef6" : "#2a2a3a"}`,
                background: i === 1 ? "#7b6ef6" : "transparent",
                color: i === 1 ? "#fff" : "#c9cad6",
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={s.content}>
          {/* env tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {Object.entries(ENV_STYLE).map(([e, st]) => (
              <button key={e} onClick={() => { setEnv(e); setRevealed({}); }}
                style={{
                  fontFamily: "inherit", fontSize: 11, padding: "5px 12px", borderRadius: 4, cursor: "pointer",
                  border: `1px solid ${env === e ? st.color : "transparent"}`,
                  background: env === e ? st.bg : "transparent",
                  color: env === e ? st.color : "#5a5b70",
                }}>{e}</button>
            ))}
          </div>

          {/* stats */}
          <div style={s.stats}>
            {[
              { label: "secrets", val: PROJECTS[project].count, sub: "in this env" },
              { label: "last push", val: "2h ago", sub: "by ashish7802", small: true },
              { label: "version", val: `#${PROJECTS[project].ver}`, sub: "current" },
              { label: "status", val: "● clean", sub: "no leaks", green: true },
            ].map(({ label, val, sub, small, green }) => (
              <div key={label} style={s.statBox}>
                <div style={{ fontSize: 10, color: "#5a5b70", marginBottom: 6, letterSpacing: .5 }}>{label}</div>
                <div style={{ fontSize: small || green ? 14 : 22, fontWeight: 600, color: green ? "#4ade80" : "#fff", paddingTop: small || green ? 4 : 0 }}>{val}</div>
                <div style={{ fontSize: 10, color: "#5a5b70", marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* secrets table */}
          <div style={s.tableWrap}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #2a2a3a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: "#5a5b70", letterSpacing: 1, textTransform: "uppercase" }}>secrets</span>
              <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="filter keys..."
                style={{ fontFamily: "inherit", fontSize: 11, background: "#1c1c26", border: "1px solid #2a2a3a", color: "#c9cad6", padding: "5px 10px", borderRadius: 4, width: 180, outline: "none" }} />
            </div>
            <div style={{ ...s.row, fontSize: 10, color: "#5a5b70", letterSpacing: 1, textTransform: "uppercase", background: "#1c1c26" }}>
              <span>key</span><span>value</span><span>type</span><span>show</span>
            </div>
            {visibleSecrets.map((sec, i) => (
              <div key={sec.key} style={{ ...s.row, cursor: "default" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1c1c26"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ color: "#4ecca3", fontWeight: 500 }}>{sec.key}</span>
                <span style={{ color: revealed[i] ? "#c9cad6" : "#5a5b70", fontFamily: "monospace" }}>{revealed[i] ? sec.val : mask(sec.val)}</span>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, border: `1px solid ${TYPE_STYLE[sec.type].border}`, color: TYPE_STYLE[sec.type].color, textTransform: "uppercase", display: "inline-block" }}>{sec.type}</span>
                <span onClick={() => toggleReveal(i)} style={{ cursor: "pointer", color: revealed[i] ? "#7b6ef6" : "#5a5b70", fontSize: 14, textAlign: "center" }}>{revealed[i] ? "◉" : "◎"}</span>
              </div>
            ))}
          </div>

          {/* scanner */}
          {showScanner && (
            <div style={{ marginTop: 20, background: "#15151c", border: "1px solid #2a2a3a", borderRadius: 8, padding: 20 }}>
              <div style={{ fontSize: 10, color: "#5a5b70", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>secret scanner</div>
              {!scanning && !scanDone && (
                <button onClick={runScan} style={{ fontFamily: "inherit", fontSize: 11, padding: "8px 16px", borderRadius: 5, cursor: "pointer", border: "1px solid #2a2a3a", background: "transparent", color: "#c9cad6", width: "100%" }}>
                  run scan on {PROJECTS[project].name}
                </button>
              )}
              {scanning && <div style={{ fontSize: 12, color: "#5a5b70" }}>scanning... checking files for leaked secrets</div>}
              {scanDone && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 6, background: "#1c1c26", border: "1px solid #4ade8022" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
                  <span style={{ color: "#4ade80", fontSize: 12 }}>all clean</span>
                  <span style={{ color: "#5a5b70", fontSize: 12, marginLeft: 8 }}>— 47 files scanned, 0 secrets found</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
