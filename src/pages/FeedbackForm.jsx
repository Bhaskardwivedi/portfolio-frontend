import React, { useState } from 'react';
import axios from 'axios';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    designation: '',
    message: '',
    rating: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://portfolio-backend-production-d996.up.railway.app/api/feedback/", formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        designation: '',
        message: '',
        rating: '',
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-slate-800 px-4">
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/10 text-white">
        <h2 className="text-3xl font-bold text-center text-orange-400 mb-6">📝 Client Feedback</h2>
        
        {submitted ? (
          <p className="text-green-400 text-center text-lg font-semibold">Thanks for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name *"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white/20 p-2 rounded text-white placeholder-gray-300"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email *"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/20 p-2 rounded text-white placeholder-gray-300"
            />
            <input
              type="text"
              name="company"
              placeholder="Company (optional)"
              value={formData.company}
              onChange={handleChange}
              className="w-full bg-white/20 p-2 rounded text-white placeholder-gray-300"
            />
            <input
              type="text"
              name="designation"
              placeholder="Designation (optional)"
              value={formData.designation}
              onChange={handleChange}
              className="w-full bg-white/20 p-2 rounded text-white placeholder-gray-300"
            />
            <textarea
              name="message"
              placeholder="Your Feedback *"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full bg-white/20 p-2 rounded text-white placeholder-gray-300"
            />
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full bg-white/20 p-2 rounded text-white"
            >
              <option value="">Rate us (optional)</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num} Star{num > 1 && 's'}</option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded font-bold transition"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
