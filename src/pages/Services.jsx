import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const ServiceCard = ({ title, tagline, description, features, image }) => {
  const [showMore, setShowMore] = useState(false);

  const handleCTAClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 
        flex flex-col transition-all duration-300 group 
        hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.03]"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-xl shadow-md mb-4 
        group-hover:shadow-orange-400 transition-all duration-300"
      />

      <div>
        <h3 className="text-lg sm:text-xl font-bold text-orange-400 mb-1">{title}</h3>
        <p className="text-xs italic text-gray-300 mb-2">{tagline}</p>
        <p className="text-sm text-gray-100 mb-3">
          {showMore || description.length <= 120
            ? description
            : description.slice(0, 120) + "..."}
          {description.length > 120 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="ml-2 text-orange-400 hover:underline text-xs"
            >
              {showMore ? "Read Less" : "Read More"}
            </button>
          )}
        </p>

        <ul className="text-sm space-y-2 text-white/90">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-2"
            >
              <CheckCircle className="text-orange-400 w-4 h-4 mt-0.5" />
              {feature.point}
            </motion.li>
          ))}
        </ul>
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

  useEffect(() => {
    axios
      .get("https://portfolio-backend-production-d996.up.railway.app/api/services/")
      .then((res) => {
        const servicesData = res.data;

        const grouped = servicesData.reduce((acc, service) => {
          const cat = service.category;
          if (cat && cat.type === "service") {
            const key = cat.slug;

            if (!acc[key]) {
              acc[key] = {
                name: cat.name,
                emoji:
                  cat.name.toLowerCase().includes("ai") ? "🤖" :
                  cat.name.toLowerCase().includes("data") ? "🧠" :
                  cat.name.toLowerCase().includes("business") ? "📊" :
                  cat.name.toLowerCase().includes("web") ? "🛠️" :
                  "📦",
                services: [],
              };
            }

            acc[key].services.push(service);
          }
          return acc;
        }, {});

        setGroupedServices(grouped);
        setActiveTab(Object.keys(grouped)[0]);
      })
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  return (
    <section
      id="services"
      className="relative min-h-screen py-24 px-4 sm:px-8 lg:px-20 bg-gray-900"
    >
      <div className="absolute inset-0 z-0 bg-[url('/assets/service.jpg')] bg-cover bg-center blur-sm opacity-20" />
      <div className="absolute inset-0 bg-black/10 z-10" />

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
                border border-orange-400 backdrop-blur-md 
                transition-all duration-300 
                ${activeTab === slug ? "bg-orange-500 text-white shadow-lg scale-105" : "bg-white/10 text-orange-300 hover:bg-orange-400/30"}`}
            >
              <span>{group.emoji}</span>
              {group.name}
            </button>
          ))}
        </div>

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
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-2xl font-bold text-center px-8 py-2 mb-8
                bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-full
                w-fit mx-auto shadow-md"
            >
              <span className="mr-2 text-2xl">{groupedServices[activeTab].emoji}</span>
              {groupedServices[activeTab].name}
            </motion.h3>

            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {groupedServices[activeTab].services.map((service, index) => (
                <ServiceCard
                  key={index}
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
