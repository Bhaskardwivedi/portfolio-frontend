import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    axios
      .get("https://portfolio-backend-production-d996.up.railway.app/api/contact/contact-info/")
      .then((res) => setContactInfo(res.data))
      .catch((err) => console.error("Contact Info Error:", err));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://192.168.31.164:8000/api/contact/", formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat py-16 px-6"
      style={{ backgroundImage: "url('/src/assets/contact.jpg')" }} // Change to your actual path
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 text-white min-h-screen items-center">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-orange-400">Let's Innovate Together.</h2>

          {contactInfo?.description && (
            <p className="text-gray-200 whitespace-pre-line">{contactInfo.description}</p>
          )}

          {contactInfo && (
            <div className="space-y-2 text-sm text-gray-300">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-400" />
                {contactInfo.location}
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-orange-400" />
                {contactInfo.phone}
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-orange-400" />
                {contactInfo.email}
              </p>
              {contactInfo.freelance_status && (
                <p className="flex items-center gap-2">
                  💼 {contactInfo.freelance_status}
                </p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT FORM SIDE */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-orange-400">Contact Us</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-white/20 text-white px-4 py-2 rounded-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/20 text-white px-4 py-2 rounded-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full bg-white/20 text-white px-4 py-2 rounded-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full bg-white/20 text-white px-4 py-2 rounded-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-lg transition duration-300"
            >
              Send Message
            </button>
          </form>

          {status === "success" && (
            <p className="text-green-400 mt-4 text-center">Message sent successfully!</p>
          )}
          {status === "error" && (
            <p className="text-red-400 mt-4 text-center">Something went wrong. Try again.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
