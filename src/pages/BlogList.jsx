import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// 👉 apne project ka axios instance use karna behtar hota hai (baseURL, headers, etc.)
import axios from "axios";
import bgImage from "../assets/bg-blog.jpg";

// Cloudinary helper (agar URL me /upload/ ho to auto-optimize)
const cloudinaryOpt = (url, t = "f_auto,q_auto,w_800") =>
  typeof url === "string" && url.includes("/upload/")
    ? url.replace("/upload/", `/upload/${t}/`)
    : url || "";

const formatDate = (d) => {
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

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await axios.get("https://api.bhaskarai.com/api/blogs/");
        if (!active) return;
        setBlogs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setBlogs([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-black/60 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-10 text-white text-center drop-shadow-md">
            Latest Blogs
          </h2>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="backdrop-blur-md bg-white/10 border border-white/30 rounded-xl text-white shadow-xl overflow-hidden animate-pulse"
                >
                  <div className="h-40 bg-white/10" />
                  <div className="p-5">
                    <div className="h-5 w-2/3 bg-white/20 rounded mb-3" />
                    <div className="h-4 w-1/3 bg-white/20 rounded mb-4" />
                    <div className="h-4 w-full bg-white/20 rounded mb-2" />
                    <div className="h-4 w-3/4 bg-white/20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => {
                const img = cloudinaryOpt(blog?.image);
                const summary =
                  blog?.summary?.trim?.() ||
                  (blog?.content ? String(blog.content).replace(/<[^>]+>/g, "").slice(0, 140) + "…" : "No summary available…");

                return (
                  <div
                    key={blog?.slug || blog?.id}
                    className="backdrop-blur-md bg-white/10 border border-white/30 rounded-xl text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden"
                  >
                    {img ? (
                      <div className="h-40 overflow-hidden flex justify-center items-center bg-gray-100/10">
                        <img
                          src={img}
                          alt={blog?.title || "Blog image"}
                          className="h-full w-auto object-contain transition-transform duration-300 hover:scale-110"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-white/10 flex items-center justify-center text-white/60 text-sm">
                        No Image
                      </div>
                    )}

                    <div className="p-5">
                      <h3 className="text-xl font-semibold mb-1 line-clamp-2">
                        {blog?.title || "Untitled"}
                      </h3>
                      <p className="text-sm text-gray-300 mb-2">
                        {formatDate(blog?.created_at)}
                      </p>

                      <div className="text-sm text-gray-200 mt-2 line-clamp-3">
                        {summary}
                      </div>

                      {blog?.slug && (
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="inline-block mt-4 text-orange-300 font-medium hover:underline"
                        >
                          Read More →
                        </Link>
                      )}
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
};

export default BlogList;
