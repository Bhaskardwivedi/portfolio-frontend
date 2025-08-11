// src/pages/ProjectList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";

// ---------- helpers ----------
const httpsify = (url) =>
  typeof url === "string" ? url.replace(/^http:\/\//, "https://") : url;

const cloudinaryOpt = (url, t = "f_auto,q_auto,w_1200") => {
  if (!url || typeof url !== "string") return "";
  const u = httpsify(url);
  return u.includes("/upload/") ? u.replace("/upload/", `/upload/${t}/`) : u;
};

const fmtDate = (d) => {
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const snippet = (s, n = 150) => {
  if (!s || typeof s !== "string") return "";
  const t = s.replace(/\r?\n/g, " ").trim();
  return t.length > n ? t.slice(0, n).trim() + "…" : t;
};

// ---------- simple match scoring (frontend-only) ----------
const NEED_OPTIONS = [
  { key: "etl", label: "ETL pipeline" },
  { key: "dashboard", label: "Dashboard" },
  { key: "alerts", label: "Email alerts" },
  { key: "scheduling", label: "Scheduling" },
  { key: "deduplication", label: "De-duplication" },
  { key: "warehousing", label: "Data warehouse" },
];

const TECH_OPTIONS = [
  "airflow",
  "postgresql",
  "pyspark",
  "pandas",
  "power bi",
  "sqlalchemy",
  "docker",
  "github actions",
  "selenium",
  "requests",
  "azure",
  "databricks",
  "synapse",
];

const normalize = (txt) =>
  (txt || "")
    .toString()
    .toLowerCase()
    .replace(/[_/,|()+\-]+/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildCorpus = (p) => {
  const parts = [];
  parts.push(normalize(p?.title));
  parts.push(normalize(p?.description));
  if (Array.isArray(p?.features))
    parts.push(normalize(p.features.map((f) => f?.text).join(" ")));
  if (Array.isArray(p?.tech_stacks))
    parts.push(normalize(p.tech_stacks.map((t) => t?.text).join(" ")));
  parts.push(normalize(p?.category?.name));
  parts.push(normalize(p?.category?.slug));
  return parts.join(" ").trim();
};

function scoreProject(project, need) {
  const corpus = buildCorpus(project);
  const has = (term) => corpus.includes(term.toLowerCase());

  const W = { category: 30, tech: 45, keywords: 25 };
  let score = 0;
  const reasons = [];

  if (need.category && normalize(project?.category?.slug) === normalize(need.category)) {
    score += W.category;
    reasons.push("Same category");
  }

  const techHits = (need.tech || []).filter((t) => has(t)).slice(0, 3);
  if (techHits.length) {
    score += Math.min(W.tech, (techHits.length / Math.max(need.tech.length, 1)) * W.tech);
    reasons.push(...techHits);
  }

  const kwHits = (need.keywords || []).filter((k) => has(k)).slice(0, 3);
  if (kwHits.length) {
    score += Math.min(W.keywords, (kwHits.length / Math.max(need.keywords.length, 1)) * W.keywords);
    reasons.push(...kwHits);
  }

  return { score: Math.round(score), reasons: reasons.slice(0, 2) };
}

// ---------- tiny UI pieces ----------
const CatBubble = ({ src, label }) => (
  <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md border border-white/20">
    {/* ripple like Skills */}
    <div className="absolute inset-0 rounded-full bg-orange-400/30 animate-[ping_2s_linear_infinite] motion-reduce:animate-none z-0" />
    {src ? (
      <img
        src={src}
        alt={label || "category"}
        className="w-4 h-4 z-10 relative object-contain rounded-full"
        loading="lazy"
      />
    ) : (
      <span className="z-10 text-[11px] font-semibold text-orange-600 select-none">
        {(label || "C").slice(0, 1).toUpperCase()}
      </span>
    )}
  </div>
);

export default function ProjectList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCat, setActiveCat] = useState("all");
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await axios.get("/projects/");
        if (!live) return;
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Error fetching projects:", e);
        setItems([]);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  // include category image + icon (from API)
  const categories = useMemo(() => {
    const map = new Map();
    items.forEach((p) => {
      const c = p?.category;
      if (c?.slug) {
        map.set(c.slug, {
          name: c.name,
          slug: c.slug,
          image: c.image,
          icon: c.icon,
        });
      }
    });
    return [
      { name: "All Projects", slug: "all", image: null, icon: null },
      ...Array.from(map.values()),
    ];
  }, [items]);

  const base = useMemo(
    () => (activeCat === "all" ? items : items.filter((p) => p?.category?.slug === activeCat)),
    [items, activeCat]
  );

  const enriched = useMemo(() => {
    const need = {
      category: activeCat === "all" ? null : activeCat,
      tech: selectedTechs,
      keywords: selectedNeeds,
    };
    return base.map((p) => ({ ...p, _match: scoreProject(p, need) }));
  }, [base, activeCat, selectedNeeds, selectedTechs]);

  const list = useMemo(() => {
    const l = [...enriched];
    const anyFilter = activeCat !== "all" || selectedNeeds.length || selectedTechs.length;
    if (anyFilter) l.sort((a, b) => b._match.score - a._match.score);
    return l;
  }, [enriched, activeCat, selectedNeeds, selectedTechs]);

  const toggle = (arr, setArr, key) =>
    setArr((old) => (old.includes(key) ? old.filter((k) => k !== key) : [...old, key]));

  const clearAll = () => {
    setActiveCat("all");
    setSelectedNeeds([]);
    setSelectedTechs([]);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/blog.jpg')" }}
    >
      <div className="bg-black/60 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="w-fit mx-auto text-4xl md:text-5xl font-extrabold mb-6 text-white drop-shadow-md text-center">
            <span className="opacity-80">Latest </span>
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>

          {/* category pills with animated ICON/IMAGE */}
          <div className="flex flex-wrap gap-3 mb-5">
            {categories.map((c) => {
              const active = activeCat === c.slug;
              const iconSrc = cloudinaryOpt(c?.icon || c?.image, "f_auto,q_auto,w_40");
              return (
                <button
                  key={c.slug}
                  onClick={() => setActiveCat(c.slug)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition ${
                    active
                      ? "border-orange-400 text-orange-200 bg-orange-500/10"
                      : "border-white/30 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <CatBubble src={iconSrc} label={c.name} />
                  <span className="font-medium">{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* need & tech filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex-1">
              <p className="text-white/70 text-sm mb-2">What do you need?</p>
              <div className="flex flex-wrap gap-2">
                {NEED_OPTIONS.map((n) => (
                  <button
                    key={n.key}
                    onClick={() => toggle(selectedNeeds, setSelectedNeeds, n.key)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      selectedNeeds.includes(n.key)
                        ? "border-orange-400 text-orange-200 bg-orange-500/10"
                        : "border-white/30 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm mb-2">Tech</p>
              <div className="flex flex-wrap gap-2">
                {TECH_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggle(selectedTechs, setSelectedTechs, t)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      selectedTechs.includes(t)
                        ? "border-orange-400 text-orange-200 bg-orange-500/10"
                        : "border-white/30 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {t.replace(/\b\w/g, (m) => m.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:self-end">
              <button
                onClick={clearAll}
                className="text-xs px-3 py-1.5 rounded-full border border-white/30 text-white/80 hover:bg-white/10"
              >
                Clear
              </button>
            </div>
          </div>

          {/* grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="backdrop-blur-md bg-white/10 border border-white/30 rounded-xl text-white shadow-xl overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-white/10" />
                  <div className="p-5">
                    <div className="h-6 w-2/3 bg-white/20 rounded mb-3" />
                    <div className="h-4 w-1/3 bg-white/20 rounded mb-4" />
                    <div className="h-4 w-full bg-white/20 rounded mb-2" />
                    <div className="h-4 w-3/4 bg-white/20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {list.map((p) => {
                const cover = cloudinaryOpt(
                  p?.cover_image || p?.project_images?.[0]?.image,
                  "f_auto,q_auto,w_1000"
                );
                const when = fmtDate(p?.created_at);
                const techs = Array.isArray(p?.tech_stacks) ? p.tech_stacks.slice(0, 6) : [];
                const showMatch = selectedNeeds.length || selectedTechs.length || activeCat !== "all";

                return (
                  <div
                    key={p?.slug || p?.id}
                    className="relative backdrop-blur-md bg-white/10 border border-white/30 rounded-xl text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 overflow-hidden"
                  >
                    {/* image */}
                    {cover ? (
                      <div className="relative h-48 bg-gray-100/10">
                        <img
                          src={cover}
                          alt={p?.title || "Project"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                        {showMatch && (
                          <span className="absolute top-2 left-2 text-[11px] px-2 py-1 rounded bg-black/60 backdrop-blur border border-white/20">
                            {p._match.score}% match
                            {p._match.reasons.length ? ` · ${p._match.reasons.join(" • ")}` : ""}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 bg-white/10 flex items-center justify-center text-white/60 text-sm">
                        No Image
                      </div>
                    )}

                    {/* content */}
                    <div className="p-5">
                      <h3 className="text-xl font-semibold mb-1 line-clamp-2">{p?.title}</h3>
                      <p className="text-xs text-orange-200/90 mb-1">{p?.category?.name || ""}</p>
                      <p className="text-sm text-gray-200/90 mb-3 line-clamp-3">
                        {snippet(p?.description, 180)}
                      </p>

                      {/* chips */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {techs.map((t) => (
                          <span
                            key={t?.id || t?.text}
                            className="text-[11px] px-3 py-1 rounded-full bg-white/15 border border-white/20"
                          >
                            {t?.text}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">{when}</span>
                        <Link
                          to={`/projects/${p?.slug}`}
                          className="text-orange-300 font-medium hover:underline"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
