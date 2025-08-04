import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const Hero = () => {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    axios
      .get('https://portfolio-backend-production-d996.up.railway.app/api/aboutus/home-hero/')
      .then((res) => setHeroData(res.data))
      .catch((err) => console.error('Error fetching hero data:', err));
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    background: {
      color: { value: 'transparent' },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
        resize: true,
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: { value: '#ffa500' },
      links: { enable: true, color: '#ffa500', distance: 150, opacity: 0.4, width: 1 },
      collisions: { enable: true },
      move: { enable: true, speed: 2, outModes: 'bounce' },
      number: { value: 50, density: { enable: true, area: 800 } },
      opacity: { value: 0.5 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 5 } },
    },
    detectRetina: true,
  };

  if (!heroData) return <div className="text-center p-10 text-gray-700">Loading...</div>;

  return (
    <section
      id="home"
      className="relative snap-start min-h-screen flex flex-col-reverse md:flex-row items-center justify-center px-4 sm:px-6 lg:px-20 py-20 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/coding-bg.jpg')" }}
    >
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 -z-10"
      />

      {/* Floating Blob */}
      <motion.div
        className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-tr from-orange-500 to-purple-600 rounded-full blur-3xl opacity-30 -z-10"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />

      {/* Left Content */}
      <motion.div
        className="w-full md:w-1/2 z-10 bg-white/30 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-2xl text-center md:text-left border border-white/20 hover:shadow-[0_0_40px_rgba(255,106,0,0.4)]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
          I’m <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 animate-pulse">{heroData.name}</span>
        </h1>

        <h2 className="text-base sm:text-lg md:text-xl mt-2 font-semibold text-gray-700 border-b border-orange-300 inline-block pb-1">
          <span className="text-blue-600">Data Engineer</span> | <span className="text-purple-500">AI Automation Specialist</span> | <span className="text-orange-400">Portfolio Developer</span>
        </h2>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mt-6 animate-fadeIn">
          <Typewriter
            words={[heroData.headline]}
            loop={false}
            cursor
            cursorStyle='|'
            typeSpeed={70}
            deleteSpeed={40}
            delaySpeed={1800}
          />
        </h3>

        <div className="text-md sm:text-lg mt-5 text-gray-700 flex flex-wrap justify-center md:justify-start gap-4 font-medium">
          <span className="flex items-center gap-1 text-orange-600">
            👨‍💻 <CountUp end={heroData.total_tech_experience} duration={2} />+ <span className="text-gray-700">Years Experience</span>
          </span>
          <span className="flex items-center gap-1 text-orange-600">
            🚀 <CountUp end={heroData.total_projects} duration={2} />+ <span className="text-gray-700">Projects</span>
          </span>
          <span className="flex items-center gap-1 text-orange-600">
            🤝 <CountUp end={heroData.total_clients} duration={2} />+ <span className="text-gray-700">Clients</span>
          </span>
        </div>

        <div className="flex gap-4 justify-center md:justify-start mt-6">
          <a
            href="#contact"
            className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold transform hover:scale-110 shadow-lg hover:shadow-orange-400 transition-all duration-300 ring-2 ring-transparent hover:ring-white/50"
          >
            Hire Me
          </a>
          <a
            href="#projects"
            className="border border-orange-500 text-orange-500 px-6 py-2 rounded-full font-semibold hover:bg-orange-500 hover:text-white transform hover:scale-110 transition-all duration-300"
          >
            See Projects
          </a>
        </div>
      </motion.div>

      {/* Right Profile Image */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0 z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-56 h-56 md:w-72 md:h-72 rounded-full border-4 border-orange-500 shadow-xl overflow-hidden relative hover:scale-105 transition-transform duration-500">
          <img
            src={heroData.hero_image}
            alt={heroData.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 rounded-full border-2 border-white blur-md opacity-10" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
