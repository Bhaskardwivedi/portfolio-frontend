import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Skills', path: '/skills' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-md shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex justify-between items-center">
        <RouterLink to="/" className="text-2xl font-extrabold tracking-tight flex items-center">
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="text-orange-600"
          >
            Bhaskar
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="ml-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text"
          >
            .AI
          </motion.span>
        </RouterLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <Link
                to={link.path}
                className={`text-sm font-semibold transition-all duration-200 ease-in-out ${{
                  true: 'text-orange-400',
                  false: 'text-white hover:text-orange-400'
                }[location.pathname === link.path]}`}
              >
                {link.name}
              </Link>
              <motion.span
                layoutId="underline"
                className={`absolute left-0 -bottom-1 h-0.5 bg-orange-400 transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </motion.div>
          ))}

          {/* Hire Me Button */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/contact"
              className="bg-orange-500 text-white font-bold px-4 py-2 rounded-full shadow hover:shadow-[0_0_20px_#ff6a00] transition"
            >
              Hire Me
            </Link>
          </motion.div>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden text-white">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-black/90 backdrop-blur-sm px-6 py-4 space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-white font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block bg-orange-500 text-white font-bold px-4 py-2 rounded-full mt-2"
          >
            Hire Me
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
