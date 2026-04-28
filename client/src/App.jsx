import React, { useState } from "react";
import axios from "axios";
import { strollers } from "./data/products";
import ProductCard from "./components/ProductCard";
import Shimmer from "./components/Shimmer";

// Language context
const L = {
  en: {
    dir: "ltr",
    title: "Mumzworld",
    subtitle: "AI Shopping Assistant",
    tagline: "Compare products. Get expert AI verdicts. In English & Arabic.",
    strollers: "Strollers",
    selectHint: "Select 2 strollers to compare",
    compareBtn: "Compare These",
    comparing: "Comparing…",
    clear: "Clear",
    selected: "selected",
    maxAlert: "You can only select 2 products at a time.",
    results: "AI Comparison Results",
    comparisonTable: "Feature Comparison",
    feature: "Feature",
    verdict: "AI Verdict",
    confidence: "Confidence",
    warnings: "Heads Up",
    blogEn: "Blog Post — English",
    blogAr: "مقال — عربي",
    howWorks: "How it works",
    step1: "Pick 2 products",
    step2: "Our AI extracts specs",
    step3: "Get a bilingual verdict",
    langToggle: "عربي",
  },
  ar: {
    dir: "rtl",
    title: "عالم ماما",
    subtitle: "مساعد التسوق الذكي",
    tagline: "قارني المنتجات واحصلي على توصيات ذكية بالعربية والإنجليزية.",
    strollers: "عربات الأطفال",
    selectHint: "اختاري منتجين للمقارنة",
    compareBtn: "قارني الآن",
    comparing: "جارٍ المقارنة…",
    clear: "مسح",
    selected: "مختار",
    maxAlert: "يمكنك اختيار منتجين فقط.",
    results: "نتائج المقارنة الذكية",
    comparisonTable: "مقارنة المميزات",
    feature: "الميزة",
    verdict: "رأي الذكاء الاصطناعي",
    confidence: "درجة الثقة",
    warnings: "تنبيهات",
    blogEn: "مقال — إنجليزي",
    blogAr: "مقال — عربي",
    howWorks: "كيف يعمل",
    step1: "اختاري منتجين",
    step2: "يستخرج الذكاء المواصفات",
    step3: "احصلي على رأي ثنائي اللغة",
    langToggle: "English",
  },
};

export default function App() {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [lang, setLang] = useState("en");
  const t = L[lang];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSelect = (product) => {
    if (selected.includes(product)) {
      setSelected(selected.filter((p) => p !== product));
    } else {
      if (selected.length >= 2) {
        showToast(t.maxAlert);
        return;
      }
      setSelected([...selected, product]);
    }
  };

  const handleCompare = async () => {
    try {
      setLoading(true);
      setResult(null);
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/compare`, {
        descriptions: selected.map((p) => p.description),
      });
      setResult(res.data);
    } catch (err) {
      showToast("Comparison failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelected([]);
    setResult(null);
  };

  const confidenceColor = (c) =>
    c > 0.7 ? "#16a34a" : c > 0.4 ? "#d97706" : "#dc2626";
  const confidenceLabel = (c) =>
    c > 0.7
      ? lang === "en"
        ? "High"
        : "عالية"
      : c > 0.4
        ? lang === "en"
          ? "Medium"
          : "متوسطة"
        : lang === "en"
          ? "Low"
          : "منخفضة";

  return (
    <div
      dir={t.dir}
      style={{
        minHeight: "100vh",
        background: "#fdf8f4",
        fontFamily: "'Playfair Display', 'Noto Kufi Arabic', Georgia, serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&family=Noto+Kufi+Arabic:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fdf8f4; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .product-card-wrap { transition: transform 0.2s ease; }
        .product-card-wrap:hover { transform: translateY(-3px); }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #1c1917; color: #fef3c7; padding: 0.75rem 1.5rem; border-radius: 999px; font-family: 'DM Sans', sans-serif; font-size: 14px; z-index: 9999; animation: fadeIn 0.3s ease; }
        .compare-btn { background: linear-gradient(135deg, #be185d, #9d174d); color: white; border: none; padding: 0.65rem 1.5rem; border-radius: 999px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 14px; transition: opacity 0.2s; }
        .compare-btn:hover { opacity: 0.9; }
        .clear-btn { background: transparent; border: 1px solid #d4a5a0; color: #9f5656; padding: 0.65rem 1.2rem; border-radius: 999px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; transition: background 0.2s; }
        .clear-btn:hover { background: #fde8e8; }
        .lang-btn { background: transparent; border: 1.5px solid #be185d; color: #be185d; padding: 0.45rem 1.1rem; border-radius: 999px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; transition: all 0.2s; }
        .lang-btn:hover { background: #be185d; color: white; }
        table { border-collapse: collapse; width: 100%; }
        th, td { padding: 0.75rem 1rem; text-align: ${lang === "ar" ? "right" : "left"}; }
        th { background: #fdf0f5; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #9d174d; border-bottom: 1.5px solid #fce7f3; }
        td { font-family: 'DM Sans', sans-serif; font-size: 14px; color: #44403c; border-bottom: 1px solid #fef2f2; }
        tr:last-child td { border-bottom: none; }
        tr:nth-child(even) td { background: #fffbf9; }
      `}</style>

      {/* ── TOAST ── */}
      {toast && <div className="toast">{toast}</div>}

      {/* ── STICKY TOP BAR (shows when items selected) ── */}
      {selected.length > 0 && (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(253,248,244,0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #fce7f3",
            padding: "0.85rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "#57534e",
            }}
          >
            <span style={{ fontWeight: 500, color: "#9d174d" }}>
              {selected.length}
            </span>{" "}
            {t.selected}: {selected.map((p) => p.name).join(", ")}
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {selected.length === 2 && (
              <button className="compare-btn" onClick={handleCompare}>
                {loading ? t.comparing : t.compareBtn}
              </button>
            )}
            <button className="clear-btn" onClick={clearSelection}>
              {t.clear}
            </button>
          </div>
        </div>
      )}

      {/* ── HERO HEADER ── */}
      <header
        style={{
          background:
            "linear-gradient(160deg, #fff1f5 0%, #fdf8f4 60%, #fef3e8 100%)",
          padding: "3rem 1.5rem 2.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(251,207,232,0.35)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(254,215,170,0.3)",
          }}
        />

        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.4rem",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#be185d",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                letterSpacing: "0.12em",
                color: "#be185d",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              AI-Powered
            </span>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#be185d",
              }}
            />
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#1c1917",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {t.title}
            <span style={{ color: "#be185d" }}> ·</span>
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              fontFamily: "'DM Sans', sans-serif",
              color: "#78716c",
              marginTop: "0.5rem",
              lineHeight: 1.6,
            }}
          >
            {t.tagline}
          </p>

          {/* How it works */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              marginTop: "1.8rem",
              flexWrap: "wrap",
            }}
          >
            {[t.step1, t.step2, t.step3].map((step, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#be185d",
                    color: "white",
                    fontSize: 11,
                    fontFamily: "'DM Sans'",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "#57534e",
                  }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lang toggle */}
        <div style={{ position: "absolute", top: "1.2rem", right: "1.5rem" }}>
          <button
            className="lang-btn"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      <main
        style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        {/* ── PRODUCT CAROUSEL ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "1rem",
            }}
          >
            <h2
              style={{ fontSize: "1.3rem", fontWeight: 600, color: "#1c1917" }}
            >
              {t.strollers}
            </h2>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "#a8a29e",
              }}
            >
              {t.selectHint}
            </span>
          </div>

          <div
            className="no-scrollbar"
            style={{
              display: "flex",
              gap: "1rem",
              overflowX: "auto",
              paddingBottom: "1rem",
              scrollSnapType: "x mandatory",
            }}
          >
            {strollers.map((product) => (
              <div
                key={product.id}
                className="product-card-wrap"
                onClick={() => toggleSelect(product)}
                style={{
                  cursor: "pointer",
                  flexShrink: 0,
                  width: 240,
                  scrollSnapAlign: "start",
                }}
              >
                <ProductCard
                  product={product}
                  isSelected={selected.includes(product)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── SHIMMER ── */}
        {loading && <Shimmer />}

        {/* ── RESULTS ── */}
        {!loading && result && (
          <div className="fade-in">
            <h2
              style={{
                fontSize: "1.4rem",
                fontWeight: 600,
                color: "#1c1917",
                marginBottom: "1.5rem",
                paddingBottom: "0.75rem",
                borderBottom: "2px solid #fce7f3",
              }}
            >
              {t.results}
            </h2>

            {/* Product Summary Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {result.products.map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    border: "1px solid #fce7f3",
                    borderRadius: 16,
                    padding: "1.25rem",
                    boxShadow: "0 2px 12px rgba(190,24,93,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: i === 0 ? "#fdf0f5" : "#fef3e8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.75rem",
                      fontSize: 20,
                    }}
                  >
                    {i === 0 ? "🛒" : "🛍️"}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#1c1917",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {p.name}
                  </h3>
                  {[
                    ["💰", p.price],
                    ["⚖️", p.weight],
                    ["👶", p.age_range],
                  ].map(([icon, val], j) => (
                    <p
                      key={j}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        color: val === "Not specified" ? "#a8a29e" : "#57534e",
                        marginBottom: 3,
                      }}
                    >
                      {icon} {val || "Not specified"}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div
              style={{
                background: "white",
                border: "1px solid #fce7f3",
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: "1.5rem",
                boxShadow: "0 2px 12px rgba(190,24,93,0.06)",
              }}
            >
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid #fce7f3",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "#9d174d",
                  }}
                >
                  {t.comparisonTable}
                </h3>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>{t.feature}</th>
                      {result.products.map((p, i) => (
                        <th key={i}>{p.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.table.map((row, i) => (
                      <tr key={i}>
                        <td
                          style={{
                            fontWeight: 500,
                            color: "#78716c",
                            textTransform: "capitalize",
                          }}
                        >
                          {row.feature}
                        </td>
                        {result.products.map((p, idx) => (
                          <td
                            key={idx}
                            style={{
                              color:
                                row[p.name] === "Not specified"
                                  ? "#a8a29e"
                                  : "#1c1917",
                            }}
                          >
                            {row[p.name]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verdict + Confidence */}
            <div
              style={{
                background: "linear-gradient(135deg, #fff0f5, #fdf8f4)",
                border: "1px solid #fce7f3",
                borderRadius: 16,
                padding: "1.5rem",
                marginBottom: "1.5rem",
                boxShadow: "0 2px 12px rgba(190,24,93,0.06)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#9d174d",
                  marginBottom: "0.75rem",
                }}
              >
                {t.verdict}
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: "#44403c",
                  lineHeight: 1.7,
                }}
              >
                {result.verdict}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "1.2rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "#78716c",
                  }}
                >
                  {t.confidence}:
                </span>
                <div
                  style={{
                    flex: 1,
                    maxWidth: 160,
                    height: 6,
                    background: "#fce7f3",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${result.ai_confidence * 100}%`,
                      background: confidenceColor(result.ai_confidence),
                      borderRadius: 999,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: confidenceColor(result.ai_confidence),
                  }}
                >
                  {confidenceLabel(result.ai_confidence)} (
                  {(result.ai_confidence * 100).toFixed(0)}%)
                </span>
              </div>
            </div>

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: 16,
                  padding: "1.25rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#92400e",
                    marginBottom: "0.5rem",
                  }}
                >
                  ⚠️ {t.warnings}
                </h3>
                {result.warnings.map((w, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      color: "#78350f",
                      marginBottom: 3,
                    }}
                  >
                    {w}
                  </p>
                ))}
              </div>
            )}

            {/* Blog EN */}
            {result.blog_en && (
              <div
                style={{
                  background: "white",
                  border: "1px solid #fce7f3",
                  borderRadius: 16,
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                  boxShadow: "0 2px 12px rgba(190,24,93,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      background: "#fdf0f5",
                      color: "#be185d",
                      fontSize: 11,
                      fontFamily: "'DM Sans'",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 999,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    EN
                  </span>
                  <h3
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#9d174d",
                    }}
                  >
                    {t.blogEn}
                  </h3>
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: "#57534e",
                    lineHeight: 1.8,
                    whiteSpace: "pre-line",
                  }}
                >
                  {result.blog_en}
                </p>
              </div>
            )}

            {/* Blog AR */}
            {result.blog_ar && (
              <div
                dir="rtl"
                style={{
                  background: "white",
                  border: "1px solid #fce7f3",
                  borderRadius: 16,
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                  boxShadow: "0 2px 12px rgba(190,24,93,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      background: "#fdf0f5",
                      color: "#be185d",
                      fontSize: 11,
                      fontFamily: "'Noto Kufi Arabic'",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 999,
                      letterSpacing: "0.08em",
                    }}
                  >
                    AR
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Noto Kufi Arabic', sans-serif",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#9d174d",
                    }}
                  >
                    {t.blogAr}
                  </h3>
                </div>
                <p
                  style={{
                    fontFamily: "'Noto Kufi Arabic', sans-serif",
                    fontSize: 15,
                    color: "#57534e",
                    lineHeight: 2,
                    whiteSpace: "pre-line",
                  }}
                >
                  {result.blog_ar}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && !result && selected.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#a8a29e",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>🛒</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>
              {t.selectHint}
            </p>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          textAlign: "center",
          padding: "2rem 1rem",
          borderTop: "1px solid #fce7f3",
          marginTop: "2rem",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "#a8a29e",
          }}
        >
          Mumzworld AI Shopping Assistant · Powered by LLaMA 3.3 70B
        </p>
      </footer>
    </div>
  );
}

// import React, { useState } from "react";
// import axios from "axios";

// import { strollers } from "./data/products";
// import ProductCard from "./components/ProductCard";
// import Shimmer from "./components/Shimmer";

// function App() {
//   const [selected, setSelected] = useState([]);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 🔘 Selection
//   const toggleSelect = (product) => {
//     if (selected.includes(product)) {
//       setSelected(selected.filter((p) => p !== product));
//     } else {
//       if (selected.length < 2) {
//         setSelected([...selected, product]);
//       } else {
//         alert("Select only 2 products");
//       }
//     }
//   };

//   // 🚀 Compare
//   const handleCompare = async () => {
//     try {
//       setLoading(true);
//       setResult(null);

//       const res = await axios.post("http://localhost:5000/compare", {
//         descriptions: selected.map((p) => p.description),
//       });

//       setResult(res.data);
//     } catch (err) {
//       alert("Comparison failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearSelection = () => {
//     setSelected([]);
//     setResult(null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* 🔥 TOP BAR */}
//       {selected.length > 0 && (
//         <div className="sticky top-0 z-50 bg-white shadow p-4 flex justify-between items-center">
//           <div className="text-sm">
//             <strong>{selected.length} selected:</strong>{" "}
//             {selected.map((p) => p.name).join(", ")}
//           </div>

//           <div className="flex gap-2">
//             {selected.length === 2 && (
//               <button
//                 onClick={handleCompare}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//               >
//                 {loading ? "Comparing..." : "Compare"}
//               </button>
//             )}

//             <button
//               onClick={clearSelection}
//               className="bg-gray-200 px-4 py-2 rounded-lg"
//             >
//               Clear
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="p-6 max-w-7xl mx-auto">
//         {/* HEADER */}
//         <h1 className="text-3xl font-bold text-center mb-10">
//           Mumzworld AI Shopping Assistant
//         </h1>

//         {/* CAROUSEL */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Strollers</h2>
//           <p className="text-sm text-gray-400">← scroll →</p>
//         </div>

//         <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
//           {strollers.map((product) => (
//             <div
//               key={product.id}
//               onClick={() => toggleSelect(product)}
//               className="cursor-pointer shrink-0 w-64 snap-start"
//             >
//               <ProductCard
//                 product={product}
//                 isSelected={selected.includes(product)}
//               />
//             </div>
//           ))}
//         </div>

//         {/* 🔥 SHIMMER */}
//         {loading && <Shimmer />}

//         {/* 🔥 RESULTS */}
//         {!loading && result && (
//           <div className="mt-10 space-y-6">
//             {/* PRODUCTS */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {result.products.map((p, i) => (
//                 <div key={i} className="bg-white p-4 rounded-xl shadow">
//                   <h2 className="font-bold text-lg">{p.name}</h2>
//                   <p>💰 {p.price}</p>
//                   <p>⚖️ {p.weight}</p>
//                   <p>👶 {p.age_range}</p>
//                 </div>
//               ))}
//             </div>

//             {/* COMPARISON TABLE */}
//             <div className="bg-white p-4 rounded-xl shadow">
//               <h2 className="font-bold mb-2">Comparison</h2>
//               <table className="w-full border">
//                 <thead>
//                   <tr>
//                     <th className="border p-2">Feature</th>
//                     {result.products.map((p, i) => (
//                       <th key={i} className="border p-2">
//                         {p.name}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {result.table.map((row, i) => (
//                     <tr key={i}>
//                       <td className="border p-2">{row.feature}</td>
//                       {result.products.map((p, idx) => (
//                         <td key={idx} className="border p-2">
//                           {row[p.name]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* VERDICT + CONFIDENCE */}
//             <div className="bg-green-100 p-4 rounded-xl">
//               <h2 className="font-bold">Verdict</h2>
//               <p>{result.verdict}</p>

//               <div className="flex items-center gap-3 mt-3">
//                 <span className="text-sm text-gray-600">AI Confidence:</span>

//                 <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full ${
//                       result.ai_confidence > 0.7
//                         ? "bg-green-500"
//                         : result.ai_confidence > 0.4
//                           ? "bg-yellow-500"
//                           : "bg-red-500"
//                     }`}
//                     style={{
//                       width: `${result.ai_confidence * 100}%`,
//                     }}
//                   ></div>
//                 </div>

//                 <span className="text-sm font-medium">
//                   {(result.ai_confidence * 100).toFixed(0)}%
//                 </span>
//               </div>
//             </div>

//             {/* ⚠️ WARNINGS */}
//             {result.warnings && result.warnings.length > 0 && (
//               <div className="bg-yellow-100 p-4 rounded-xl">
//                 <h2 className="font-bold mb-1">Warnings</h2>
//                 {result.warnings.map((w, i) => (
//                   <p key={i}>⚠️ {w}</p>
//                 ))}
//               </div>
//             )}

//             {/* 📝 BLOG EN */}
//             {result.blog_en && (
//               <div className="bg-white p-4 rounded-xl shadow">
//                 <h2 className="font-bold mb-2">Blog (EN)</h2>
//                 <p className="whitespace-pre-line text-gray-700">
//                   {result.blog_en}
//                 </p>
//               </div>
//             )}

//             {/* 📝 BLOG AR */}
//             {result.blog_ar && (
//               <div className="bg-white p-4 rounded-xl shadow">
//                 <h2 className="font-bold mb-2">Blog (AR)</h2>
//                 <p className="whitespace-pre-line text-gray-700 text-right">
//                   {result.blog_ar}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
