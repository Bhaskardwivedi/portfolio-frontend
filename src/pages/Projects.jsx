import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { X } from "lucide-react";
import * as FaIcons from "react-icons/fa";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [imageModal, setImageModal] = useState({ open: false, src: "" });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);

  const lastScrollY = useRef(0);

  useEffect(() => {
    axios.get("https://portfolio-backend-production-d996.up.railway.app/api/projects/").then((res) => {
      setProjects(res.data);
    });
  }, []);

  const groupedByCategory = projects.reduce((acc, project) => {
    const cat = project.category?.name || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(project);
    return acc;
  }, {});

  const categories = projects
    .map((project) => project.category)
    .filter((v, i, a) => v && a.findIndex((t) => t.name === v.name) === i);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) return;
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const openImageModal = (src) => setImageModal({ open: true, src });
  const closeImageModal = () => setImageModal({ open: false, src: "" });

  // Motion values for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [100, -100], [-15, 15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  return (
    <section
      className="relative min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: `url('/src/assets/project.jpg')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 px-4 py-16">
        <div className="relative mb-10 px-2 md:px-0 text-center">
          <h2 className="text-4xl font-bold">
            <span className="text-white">My </span>
            <span className="bg-gradient-to-r from-orange-400 via-white to-pink-500 bg-clip-text text-transparent animate-shimmer inline-block">Projects</span>
          </h2>
          <button
            onClick={() => setShowSidebar((prev) => !prev)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full shadow-lg md:hidden"
          >
            ☰
          </button>
        </div>

        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: showSidebar ? 0 : -300 }}
          transition={{ type: "tween", duration: 0.4 }}
          className={`fixed top-0 left-0 h-full w-64 z-50 border-r border-orange-500 overflow-y-auto custom-scrollbar
    bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] rounded-r-2xl
    animate-border-glow
    ${showSidebar ? "block" : "hidden md:block"}
  `}
          onMouseEnter={() => setShowSidebar(true)}
          onMouseLeave={() => setShowSidebar(false)}
        >
          <div className="fixed bottom-8 left-4 z-50 md:hidden">
            <button
              onClick={() => setShowSidebar((prev) => !prev)}
              className="bg-orange-500 text-white p-2 rounded-full shadow-lg"
            >
              ☰
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-orange-400">Projects</h3>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {Object.entries(groupedByCategory).map(([category, projList], idx) => {
              const categoryData = categories.find((cat) => cat.name === category);
              let CategoryIcon = null;
              if (categoryData?.icon) {
                const IconComponent = FaIcons[categoryData.icon];
                CategoryIcon = IconComponent ? <IconComponent className="text-lg" /> : <FaIcons.FaFolder className="text-lg" />;
              } else if (categoryData?.image) {
                CategoryIcon = (
                  <img
                    src={categoryData.image}
                    alt={category}
                    className="w-8 h-8 object-contain rounded"
                  />
                );
              } else {
                CategoryIcon = <FaIcons.FaFolder className="text-lg" />;
              }

              return (
                <div key={idx}>
                  <h4
                    onClick={() => toggleCategory(category)}
                    className="text-orange-400 text-sm font-semibold uppercase border-b border-gray-700 pb-1 tracking-wide cursor-pointer flex items-center gap-2 transition duration-300 hover:drop-shadow-glow hover:text-white"
                  >
                    {CategoryIcon}
                    {showSidebar && (
                      <span className="truncate transition-opacity duration-200">{category}</span>
                    )}
                  </h4>
                  {showSidebar && expandedCategories[category] && (
                    <div className="space-y-2 mt-2">
                      {projList.map((project, idx) => (
                        <motion.div
                          key={project.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          onClick={() => {
                            setSelectedProject(project);
                            setShowSidebar(false);
                          }}
                          className={`px-3 py-2 rounded-md cursor-pointer transition-all border-l-4 text-sm
                            ${
                              selectedProject?.id === project.id
                                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-white shadow"
                                : "hover:bg-orange-500/30 hover:text-white text-gray-300 border-transparent"
                            }`}
                        >
                          {project.title}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.aside>

        {/* Project Detail */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showSidebar ? "ml-64 md:ml-64" : "ml-0 md:ml-16"
          }`}
        >
          <div className="max-w-5xl mx-auto p-6">
            {selectedProject ? (
              <motion.div
                key={selectedProject.id}
                style={{ rotateX, rotateY }}
                className="space-y-6 border-2 animate-border-glow rounded-xl p-6 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-3xl font-bold text-orange-500">
                  {selectedProject.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {selectedProject.description}
                </p>

                {selectedProject.features?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white text-lg">Key Features:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      {selectedProject.features.map((f) => (
                        <li key={f.id}>{f.text}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProject.tech_stacks?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white text-lg">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech_stacks.map((tech) => (
                        <span
                          key={tech.id}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-sm text-white shadow"
                        >
                          {tech.text}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.project_images?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-2">Project Images:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {selectedProject.project_images.map((img, idx) => (
                        <motion.div
                          key={idx}
                          className="w-full h-32 cursor-pointer rounded-lg border border-gray-700 overflow-hidden"
                          whileHover={{ rotateX: 5, rotateY: -5, scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                          onClick={() => openImageModal(img.image)}
                        >
                          <img
                            src={img.image}
                            alt={`Project Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.demo_video && (
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-2">Demo Video:</h4>
                    <div className="w-full max-w-xl aspect-video border border-gray-600 rounded overflow-hidden">
                      <video
                        src={selectedProject.demo_video}
                        controls
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 mt-4">
                  {selectedProject.github_link && (
                    <a
                      href={selectedProject.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md"
                    >
                      <FaGithub /> GitHub
                    </a>
                  )}
                  {selectedProject.live_link && (
                    <a
                      href={selectedProject.live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md"
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="text-gray-400 text-lg mt-10">
                Click on a project to view full details.
              </div>
            )}
          </div>
        </div>

        {imageModal.open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
            onClick={closeImageModal}
          >
            <img
              src={imageModal.src}
              alt="Full Project"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg border border-white"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
