// src/pages/ProjectDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "../axios";

// ------- helpers -------
const cloudinaryOpt = (url, t = "f_auto,q_auto") =>
  typeof url === "string" && url.includes("/upload/")
    ? url.replace("/upload/", `/upload/${t}/`)
    : url;

const safeText = (s) => (typeof s === "string" ? s : "");

// --- Top reading progress bar
function ProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const h = el.scrollHeight - el.clientHeight;
      setP(h > 0 ? Math.min(100, (el.scrollTop / h) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 h-1 bg-orange-500 z-[60] transition-all"
      style={{ width: `${p}%` }}
    />
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();

  // hooks — always at top, before any returns
  const [project, setProject] = useState(null);
  const [lbIdx, setLbIdx] = useState(-1);
  const [zoom, setZoom] = useState(1);

  // Fetch once per slug
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await axios.get(`/projects/${slug}/`);
        if (!live) return;
        setProject(res.data);
        if (res.data?.title) document.title = `${res.data.title} | Bhaskar.AI`;
      } catch (e) {
        console.error("Error fetching project:", e);
      }
    })();
    return () => {
      live = false;
    };
  }, [slug]);

  // Compute gallery list even if project is null (safe default)
  const galleryThumbs =
    Array.isArray(project?.project_images) && project.project_images.length > 1
      ? project.project_images.slice(1)
      : [];

  // Keyboard handlers for lightbox
  useEffect(() => {
    if (!(lbIdx > -1 && galleryThumbs.length)) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLbIdx(-1);
      if (e.key === "ArrowRight")
        setLbIdx((i) => (i + 1) % galleryThumbs.length);
      if (e.key === "ArrowLeft")
        setLbIdx((i) => (i - 1 + galleryThumbs.length) % galleryThumbs.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lbIdx, galleryThumbs.length]);

  // ---- Early return AFTER all hooks ----
  if (!project)
    return <div className="text-center mt-10 text-gray-400">Loading…</div>;

  const pubDate = new Date(project.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const bgUrl = cloudinaryOpt(
    project?.bg_image || "/assets/blog.jpg",
    "f_auto,q_auto,w_1800"
  );
  const rawHero =
    project?.cover_image || project?.project_images?.[0]?.image || "";
  const heroSrc = cloudinaryOpt(rawHero, "f_auto,q_auto,w_1400");

  const videoSrc = cloudinaryOpt(project?.demo_video, "f_auto,q_auto");
  const posterSrc = cloudinaryOpt(
    project?.demo_video_poster ||
      project?.cover_image ||
      project?.project_images?.[0]?.image ||
      "",
    "f_auto,q_auto,w_1200"
  );

  const openLightbox = (idx) => {
    setLbIdx(idx);
    setZoom(1);
  };
  const closeLightbox = () => {
    setLbIdx(-1);
    setZoom(1);
  };
  const nextImg = () => {
    if (!galleryThumbs.length) return;
    setLbIdx((i) => (i + 1) % galleryThumbs.length);
    setZoom(1);
  };
  const prevImg = () => {
    if (!galleryThumbs.length) return;
    setLbIdx((i) => (i - 1 + galleryThumbs.length) % galleryThumbs.length);
    setZoom(1);
  };

  return (
    <>
      <ProgressBar />

      <div className="relative min-h-screen pt-24 pb-14 px-4 sm:px-6 overflow-hidden">
        <img
          src={bgUrl}
          alt=""
          className="absolute inset-0 -z-10 w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-white/10" />

        {/* container a little slimmer */}
        <div className="relative max-w-2xl mx-auto bg-white/85 backdrop-blur-md rounded-lg p-6 lg:p-8 shadow">
          {/* Back + actions */}
          <div className="flex items-center justify-between mb-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>

            {project?.category?.name && (
              <Link
                to="/projects"
                className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                title="View all projects"
              >
                {project.category.name}
              </Link>
            )}
          </div>

          {/* Title & meta */}
          <h1 className="text-3xl font-bold mt-1 text-gray-900">
            {safeText(project?.title)}
          </h1>
          <p className="text-sm text-gray-600 mt-1 mb-4">Published on {pubDate}</p>

          {/* Hero */}
          {heroSrc && (
            <img
              src={heroSrc}
              alt={safeText(project?.title)}
              className="w-full max-h-[420px] object-cover rounded-lg shadow mb-6"
              loading="lazy"
              decoding="async"
            />
          )}

          {/* Description — smaller text */}
          {safeText(project?.description) && (
            <div className="text-gray-800 text-[15px] sm:text-base leading-6 sm:leading-7 whitespace-pre-line mb-6">
              {safeText(project.description)}
            </div>
          )}

          {/* Demo Video — compact width + smaller heading */}
          {videoSrc && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Demo Video
              </h3>
              <div className="mx-auto max-w-[680px]">
                <video
                  src={videoSrc}
                  poster={posterSrc || undefined}
                  controls
                  preload="none"
                  playsInline
                  className="w-full rounded-lg border border-gray-200 bg-black"
                />
              </div>
            </div>
          )}

          {/* Features */}
          {!!project?.features?.length && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Features
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-800">
                {project.features.map((f) => (
                  <li key={f?.id || f?.text}>{safeText(f?.text)}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          {!!project?.tech_stacks?.length && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stacks.map((t) => (
                  <span
                    key={t?.id || t?.text}
                    className="text-sm px-3 py-1 rounded-full bg-black/10 text-gray-900"
                  >
                    {safeText(t?.text)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery (click → lightbox) */}
          {galleryThumbs.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gallery
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryThumbs.map((im, idx) => {
                  const src = cloudinaryOpt(im?.image, "f_auto,q_auto,w_600");
                  return (
                    <img
                      key={im?.id || src}
                      src={src}
                      alt={safeText(im?.alt_text)}
                      className="w-full h-36 object-cover rounded border border-gray-200 cursor-zoom-in hover:opacity-95 transition"
                      loading="lazy"
                      decoding="async"
                      onClick={() => openLightbox(idx)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Links */}
          {(project?.github_link || project?.live_link) && (
            <div className="flex flex-wrap gap-3">
              {project.live_link && (
                <a
                  href={project.live_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
                >
                  Live Demo
                </a>
              )}
              {project.github_link && (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded bg-black/80 text-white hover:bg-black"
                >
                  GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky back */}
      <Link
        to="/projects"
        className="fixed bottom-6 left-6 z-40 bg-black/90 text-white border rounded-full px-3 py-2 shadow hover:bg-black"
      >
        ← Back
      </Link>

      {/* Lightbox */}
      {lbIdx > -1 &&
        galleryThumbs.length > 0 &&
        galleryThumbs[lbIdx] && (
          <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/80" onClick={closeLightbox} />
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white/90 hover:text-white text-2xl"
                aria-label="Close"
              >
                X
              </button>
              <button
                onClick={prevImg}
                className="absolute left-4 md:left-6 text-white/80 hover:text-white text-3xl select-none"
                aria-label="Previous"
              >
                {"<"}
              </button>
              <button
                onClick={nextImg}
                className="absolute right-4 md:right-6 text-white/80 hover:text-white text-3xl select-none"
                aria-label="Next"
              >
                {">"}
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                <button
                  onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
                  className="px-3 py-1 rounded bg-white/10 text-white border border-white/20 hover:bg-white/20 text-sm"
                >
                  −
                </button>
                <button
                  onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                  className="px-3 py-1 rounded bg-white/10 text-white border border-white/20 hover:bg-white/20 text-sm"
                >
                  +
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="px-3 py-1 rounded bg-white/10 text-white border border-white/20 hover:bg-white/20 text-sm"
                >
                  100%
                </button>
              </div>

              <img
                src={cloudinaryOpt(
                  galleryThumbs[lbIdx]?.image,
                  "f_auto,q_auto,w_1800"
                )}
                alt={safeText(galleryThumbs[lbIdx]?.alt_text)}
                className="object-contain max-w-[95vw] max-h-[85vh] select-none"
                style={{ transform: `scale(${zoom})`, transition: "transform 150ms" }}
                draggable={false}
              />
            </div>
          </div>
        )}
    </>
  );
}
