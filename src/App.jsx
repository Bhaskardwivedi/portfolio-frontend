import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import BlogList from "./pages/BlogList";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import FeedbackPage from "./pages/FeedbackForm";
import axios from "./axios";

// ✅ Helper wrapper to access location outside <Router>
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const hideNavFooter = location.pathname === "/feedback";

  useEffect(() => {
    axios
      .get("get-csrf/")
      .then(() => console.log("✅ CSRF Token Set"))
      .catch((err) => console.error("❌ CSRF Error:", err));
  }, []);

  return (
    <div className="relative z-0 text-white font-poppins">
      {!hideNavFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>

      {!hideNavFooter && <Footer />}
    </div>
  );
}

export default AppWrapper;
