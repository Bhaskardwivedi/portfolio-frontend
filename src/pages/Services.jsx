import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const normalizeImage = (url) => {
  if (!url) return "/assets/placeholder.jpg";
  if (/^https?:\/\//i.test(url)) return url;
  return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
};

const ServiceCard = ({ id, title, tagline, description, features = [], image }) => {
  const [showMore, setShowMore] = useState(false);

  const safeDesc = description || "";
  const hasMore = safeDesc.length > 120;

  const handleCTAClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6
                 flex flex-col transition-all duration-300 group
                 hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.03]"
    >
      <img
        src={normalizeImage(image)}
        alt={title || "Service image"}
        className="w-full h-48 object-cover rounded-xl shadow-md mb-4
                   group-hover:shadow-orange-400 transition-all duration-300"
        loading="lazy"
      />

      <div>
        <h3 className="text-lg sm:text-xl font-bold text-orange-400 mb-1">
          {title || "Untitled Service"}
        </h3>
        {tagline && <p className="text-xs italic text-gray-300 mb-2">{tagline}</p>}

        {safeDesc && (
          <p className="text-sm text-gray-100 mb-3">
            {showMore || !hasMore ? safeDesc : `${safeDesc.slice(0, 120)}...`}
            {hasMore && (
              <button
                onClick={() => setShowMore((v) => !v)}
                className="ml-2 text-orange-400 hover:underline text-xs"
              >
                {showMore ? "Read Less" : "Read More"}
              </button>
            )}
          </p>
        )}

        {Array.isArray(features) && features.length > 0 && (
          <ul className="text-sm space-y-2 text-white/90">
            {features.map((feature, i) => (
              <motion.li
                key={feature?.id ?? `${id}-f-${i}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2"
              >
                <CheckCircle className="text-orange-400 w-4 h-4 mt-0.5" />
                {feature?.point ?? "—"}
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleCTAClick}
          className="relative group px-4 py-1.5 text-sm font-semibold rounded-full
                     bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md
                     hover:scale-105 transition duration-300"
        >
          Let’s Talk
          <span className="absolute inset-0 rounded-full border border-orange-300 blur-sm
                           opacity-20 group-hover:opacity-60 animate-pulse" />
        </button>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const [groupedServices, setGroupedServices] = useState({});
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    axios
      .get("https://api.bhaskarai.com/api/services/")
      .then((res) => {
        if (ignore) return;
        const servicesData = Array.isArray(res.data) ? res.data : [];

        const grouped = servicesData.reduce((acc, service) => {
          const cat = service?.category;
          if (cat && cat.type === "service") {
            const key = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || "others";
            if (!acc[key]) {
              const name = cat.name || "Others";
              const lower = name.toLowerCase();
              acc[key] = {
                name,
                emoji:
                  lower.includes("ai") ? "🤖" :
                  lower.includes("data") ? "🧠" :
                  lower.includes("business") ? "📊" :
                  lower.includes("web") ? "🛠️" :
                  "📦",
                services: [],
              };
            }
            acc[key].services.push(service);
          }
          return acc;
        }, {});

        setGroupedServices(grouped);
        const firstKey = Object.keys(grouped)[0] || null;
        setActiveTab(firstKey);
      })
      .catch((err) => console.error("Error fetching services:", err))
      .finally(() => setLoading(false));

    return () => { ignore = true; };
  }, []);

  return (
    <section
      id="services"
      className="relative min-h-screen py-24 px-4 sm:px-8 lg:px-20 bg-gray-900 text-white"
    >
      {/* Clean BG without blue tint */}
      <div
        className="absolute inset-0 z-0 bg-[url('/assets/skill.jpg')] bg-cover bg-center grayscale contrast-125"
      />
      <div className="absolute inset-0 bg-black/70 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-white mb-12">
          My <span className="text-orange-400">Services</span>
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Object.entries(groupedServices).map(([slug, group]) => (
            <button
              key={slug}
              onClick={() => setActiveTab(slug)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full
                          border border-orange-400 backdrop-blur-md transition-all duration-300
                          ${activeTab === slug
                            ? "bg-orange-500 text-white shadow-lg scale-105"
                            : "bg-white/10 text-orange-300 hover:bg-orange-400/30"}`}
            >
              <span>{group.emoji}</span>
              {group.name}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-center text-gray-300">Loading services…</p>
        )}

        {!loading && !activeTab && (
          <p className="text-center text-gray-300">No services found.</p>
        )}

        {activeTab && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-2xl font-bold text-center px-8 py-2 mb-8
                         bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-full
                         w-fit mx-auto shadow-md"
            >
              <span className="mr-2 text-2xl">{groupedServices[activeTab].emoji}</span>
              {groupedServices[activeTab].name}
            </motion.h3>

            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {groupedServices[activeTab].services.map((service) => (
                <ServiceCard
                  key={service.id ?? service.slug ?? service.title}
                  id={service.id ?? service.slug ?? service.title}
                  title={service.title}
                  tagline={service.tagline}
                  description={service.description}
                  features={service.features}
                  image={service.image}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Services;
