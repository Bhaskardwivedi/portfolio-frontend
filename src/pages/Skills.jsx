import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import skillBg from "../assets/skill.jpg";

const Skills = () => {
  const [skillsData, setSkillsData] = useState({});

  useEffect(() => {
    axios
      .get("https://api.bhaskarai.com/api/skills/")
      .then((res) => {
        const grouped = res.data.reduce((acc, skill) => {
          const categoryName = skill.category?.name || "Others";
          if (!acc[categoryName]) acc[categoryName] = [];
          acc[categoryName].push(skill);
          return acc;
        }, {});
        setSkillsData(grouped);
      })
      .catch((err) => console.error("Error fetching skills:", err));
  }, []);

  const getExperienceLevel = (years) => {
    if (years >= 4) return { label: "Expert", color: "bg-purple-700 text-purple-100" };
    if (years >= 2) return { label: "Intermediate", color: "bg-yellow-700 text-yellow-100" };
    return { label: "Beginner", color: "bg-red-700 text-red-100" };
  };

  // Fallback rounded bubble if category icon missing
  const FallbackCatIcon = ({ label }) => (
    <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-md border border-white/20">
      <div className="absolute inset-0 rounded-full bg-orange-400/30 animate-[ping_2s_linear_infinite] z-0" />
      <span className="z-10 text-xl font-bold text-orange-500 select-none">
        {label?.[0]?.toUpperCase() || "?"}
      </span>
    </div>
  );

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-10 lg:px-20 text-white overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${skillBg})`, filter: "brightness(0.3) contrast(1.1)" }}
      />
      <div className="absolute inset-0 bg-black/40 -z-10" />

      <div className="relative max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
          My <span className="text-orange-400">Skills</span>
        </h2>

        {Object.entries(skillsData).map(([category, skills]) => {
          const catIcon = skills?.[0]?.category?.category_icon;
          const count = skills.length;

          return (
            <div key={category} className="mb-12 bg-white/5 p-6 rounded-xl shadow-md">
              {/* Category heading — rounded photo + bigger text, centered */}
              <h3
                className="flex flex-col sm:flex-row items-center justify-center gap-3
                           text-2xl sm:text-3xl font-semibold mb-8 text-orange-300
                           border-b border-orange-400/60 pb-4"
              >
                {catIcon ? (
                  <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-md border border-white/20">
                    <div className="absolute inset-0 rounded-full bg-orange-400/30 animate-[ping_2s_linear_infinite] z-0" />
                    <img
                      src={catIcon}
                      alt={`${category} icon`}
                      className="w-10 h-10 z-10 relative object-contain rounded-full"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <FallbackCatIcon label={category} />
                )}

                <span className="text-center flex items-center gap-2">
                  {category}
                  {/* Count badge */}
                  <span className="text-xs sm:text-sm px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-200 border border-orange-500/40">
                    {count}
                  </span>
                </span>
              </h3>

              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {skills.map((skill, index) => {
                  const exp = Number(skill.experience_years) || 0;
                  const level = getExperienceLevel(exp);
                  const expBarWidth = Math.min(exp * 25, 100);

                  return (
                    <motion.div
                      key={`${skill.id || skill.name}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ rotateY: 6, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 120, damping: 10 }}
                      className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow hover:shadow-orange-500/30 transition-all duration-300 perspective-1000"
                    >
                      {/* Skill icon with glow */}
                      <div className="flex items-center gap-4 mb-3">
                        {skill.icon && (
                          <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md border border-white/20">
                            <div className="absolute inset-0 rounded-full bg-orange-400/30 animate-[ping_2s_linear_infinite] z-0" />
                            <img
                              src={skill.icon}
                              alt={skill.name}
                              className="w-8 h-8 z-10 relative object-contain"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-white text-sm">{skill.name}</p>
                          <p className="text-xs text-gray-400">Exp: {exp} yrs</p>
                        </div>
                      </div>

                      {/* Proficiency Bar */}
                      <div title={`Proficiency: ${skill.proficiency * 10}%`}>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                          <div
                            className="bg-orange-400 h-2 rounded-full transition-all duration-700"
                            style={{ width: `${skill.proficiency * 10}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-300 mb-1">
                          Proficiency: {skill.proficiency * 10}%
                        </div>
                      </div>

                      {/* Experience Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-green-400 h-2 rounded-full transition-all duration-700"
                          style={{ width: `${expBarWidth}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
                        <p>{exp} yrs</p>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${level.color}`}>
                          {level.label}
                        </span>
                      </div>

                      {/* Certificate */}
                      {skill.certificate_link && (
                        <a
                          href={skill.certificate_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-300 underline hover:text-blue-400 mt-2 block"
                        >
                          View Certificate
                        </a>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
