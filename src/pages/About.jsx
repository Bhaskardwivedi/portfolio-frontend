import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const About = () => {
  const [about, setAbout] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    axios
      .get("https://api.bhaskarai.com/api/aboutus/")
      .then((res) => setAbout(res.data))
      .catch((err) => console.error("Error fetching About data:", err));
  }, []);

  if (!about)
    return <div className="text-center py-20 text-gray-400">Loading About...</div>;

  return (
    <section
      id="about"
      className="relative bg-cover bg-center bg-no-repeat min-h-screen pt-32 pb-24 px-4 sm:px-8 lg:px-20"
      style={{ backgroundImage: `url('/assets/about.jpg')` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
        className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 bg-white/5 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-2xl"
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center items-center"
        >
          <div className="rounded-full border-4 border-orange-500 shadow-xl overflow-hidden w-64 h-64 sm:w-72 sm:h-72 hover:scale-105 transition duration-500">
            <img
              src={about.aboutus_image}
              alt={about.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <div className="inline-block border border-orange-400 rounded-md px-3 py-1 mb-3">
            <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text">
              {about.name}
            </h2>
          </div>
          <div className="h-2" />
          <h3 className="text-xl md:text-2xl font-bold text-white bg-white/10 backdrop-blur-sm px-3 py-1 rounded-md inline-block shadow-md">
            {about.title}
          </h3>
          <div className="h-6" />
          <p className="text-gray-200 italic text-sm tracking-wide">
            {showMore ? about.description : `${about.description.slice(0, 220)}...`}
          </p>
          <div className="h-4" />
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-sm text-orange-300 hover:underline mb-6"
          >
            {showMore ? "Read Less" : "Read More"}
          </button>

          <div className="flex flex-wrap justify-between gap-y-4 mb-6 text-white text-center">
            {[{
              value: about.total_tech_experience,
              label: "Years in Tech"
            }, {
              value: about.total_projects,
              label: "Projects"
            }, {
              value: about.total_clients,
              label: "Clients"
            }].map((stat, idx) => (
              <div key={idx} className="w-1/3 hover:scale-105 transition-transform">
                <p className="text-4xl font-bold text-orange-400">
                  <CountUp end={stat.value} duration={2} />+
                </p>
                <p className="text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-white/70 italic mb-3">
            Currently open for freelance work, part-time projects, or full-time data roles. Let's connect!
          </p>

          <a
            href={about.resume}
            className="inline-block px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 transition text-sm"
          >
            Download <span className="text-orange-300">CV / Resume</span>
          </a>

          <div className="flex flex-wrap gap-2 mt-4">
            {about?.skills?.map((skill, i) => (
              <span
                key={i}
                className="bg-white/20 text-sm px-3 py-1 rounded-full text-orange-200 font-medium shadow-sm flex items-center gap-2"
              >
                {skill.icon && <span>{skill.icon}</span>}
                <span>{skill.name}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-4xl mx-auto mt-12 bg-black/50 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-xl text-white"
      >
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-6 text-center text-orange-400"
        >
          Work Experience
        </motion.h3>

        {about.experiences?.map((exp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="mb-6 bg-white/5 p-4 rounded-md shadow border-l-4 border-orange-500"
          >
            <p className="text-sm font-semibold text-orange-300 mb-1">
              {exp.duration} ({exp.total_years} yrs)
            </p>
            <h4 className="text-lg font-bold text-white mb-1">{exp.job_title}</h4>
            <p className="text-base italic font-semibold tracking-wide text-blue-300">
              {exp.company_name}
            </p>
            {exp.description && (
              <p className="text-sm text-white/80 mt-1">{exp.description}</p>
            )}
          </motion.div>
        ))}
      </motion.div>

      <div className="w-full flex justify-center mt-10 px-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-5xl bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-xl shadow-xl text-white"
        >
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-6 text-center text-orange-400"
          >
            Highlights & Achievements
          </motion.h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {[{
              icon: "✅",
              text: "Successfully transitioned from ops to data & AI automation in 1 year"
            }, {
              icon: "🤖",
              text: "Built an AI chatbot with feedback learning using LangChain & OpenAI"
            }, {
              icon: "📈",
              text: "Created Power BI dashboards & automation tools in personal projects"
            }, {
              icon: "🚀",
              text: "Currently building real-world projects with Azure, SQL, and Django"
            }].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 p-4 rounded-lg shadow-md backdrop-blur-sm flex items-start gap-3 hover:scale-[1.02] transition-transform"
              >
                <span className="text-2xl text-orange-400">{item.icon}</span>
                <p className="text-white/90 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
