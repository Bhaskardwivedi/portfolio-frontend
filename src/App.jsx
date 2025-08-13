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
import ProjectsList from "./pages/ProjectsList";
import ProjectDetail from "./pages/ProjectDetail";

import BlogList from "./pages/BlogList";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import FeedbackPage from "./pages/FeedbackForm";
import axios from "./axios";
import TestChat from "./pages/TestChat";

// ✅ import chat widget
import ChatWidget from "./components/ChatWidget"; 

// ---- helpers ----
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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
      <ScrollToTop />

      {!hideNavFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/skills" element={<Skills />} />

        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />

        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/test-chat" element={<TestChat />} />
      </Routes>

      {/* Footer hide on /feedback */}
      {!hideNavFooter && <Footer />}

      {/* ✅ Floating chat widget – hide on /feedback */}
      {!hideNavFooter && (
        <ChatWidget
          title="AI Assistant"
          subtitle="Ask anything about my work"
          welcomeText="Hey! How can I help you today? 😊"
          position="fixed"
          offset={{ bottom: 100, right: 20 }}
        />
      )}
    </div>
  );
}

export default AppWrapper;
