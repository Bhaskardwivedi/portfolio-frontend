import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from '../axios';
import bgImage from '../assets/blog.jpg';

// --- Top reading progress bar ---
function ProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const h = el.scrollHeight - el.clientHeight;
      setP(h > 0 ? Math.min(100, (el.scrollTop / h) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="fixed top-0 left-0 h-1 bg-orange-500 z-[60] transition-all" style={{ width: `${p}%` }} />;
}

const Blog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [honeypot, setHoneypot] = useState('');     // 🛡️ simple anti‑spam
  const [submitting, setSubmitting] = useState(false);
  const commentSectionRef = useRef(null);

  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/blogs/${slug}/`);
      setBlog(res.data);
      setComments(res.data.comments || []);
      // Plain doc title (no extra lib)
      if (res.data?.title) document.title = `${res.data.title} | Bhaskar.AI`;
    } catch (err) {
      console.error('Error fetching blog detail:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return; // bot caught
    try {
      setSubmitting(true);
      await axios.post(`/blogs/${slug}/comments/`, formData);
      setMessage('✅ Comment posted successfully!');
      setIsError(false);
      setFormData({ name: '', email: '', content: '' });
      fetchBlog();
      setTimeout(() => commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch (err) {
      console.error('Comment submission failed:', err);
      setMessage('❌ Failed to post comment');
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!blog) return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  // Read time & date
  const pubDate = new Date(blog.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const words = (blog.content || '').trim().split(/\s+/).length;
  const readMins = Math.max(1, Math.round(words / 220));

  // Cloudinary optimization if applicable
  const heroSrc = blog.image && blog.image.includes('/upload/')
    ? blog.image.replace('/upload/', '/upload/f_auto,q_auto,w_1200/')
    : blog.image;

  // Share helpers
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const share = (site) => {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(blog.title);
    const map = {
      x: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
      li: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      wa: `https://api.whatsapp.com/send?text=${t}%20${u}`,
    };
    window.open(map[site], '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <ProgressBar />

      <div
        className="min-h-screen bg-cover bg-center pt-24 pb-14 px-4 sm:px-6"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="max-w-3xl mx-auto bg-white/85 backdrop-blur-md rounded-lg p-6 lg:p-8 shadow">
          {/* Back + actions */}
          <div className="flex items-center justify-between mb-3">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Link>

            <div className="flex gap-3 text-sm text-gray-600">
              <button onClick={() => share('x')} className="hover:text-black">Share on X</button>
              <button onClick={() => share('li')} className="hover:text-black">LinkedIn</button>
              <button onClick={() => share('wa')} className="hover:text-black">WhatsApp</button>
            </div>
          </div>

          {/* Title & meta */}
          <h1 className="text-3xl font-bold mt-1 text-gray-900">{blog.title}</h1>
          <p className="text-sm text-gray-600 mt-1 mb-4">
            Published on {pubDate} • {readMins} min read
          </p>

          {/* Hero image */}
          {heroSrc && (
            <img
              src={heroSrc}
              alt={blog.title}
              className="w-full max-h-[480px] object-cover rounded-lg shadow mb-6"
              loading="lazy"
            />
          )}

          {/* Content */}
          <div className="text-gray-800 text-lg leading-7 whitespace-pre-line mb-8">
            {blog.content}
          </div>

          {/* Jump to comments */}
          <button
            onClick={() => commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm text-orange-600 hover:underline mb-6"
          >
            Jump to comments
          </button>

          {/* Comments */}
          <h2 ref={commentSectionRef} className="text-xl font-semibold mb-2">Comments</h2>
          {comments.length === 0 ? (
            <p className="text-gray-600 mb-4">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-4 mb-6">
              {comments.slice().reverse().map((c, i) => (
                <div key={i} className="border border-gray-200 p-3 rounded bg-white/70">
                  <p className="text-sm font-semibold text-gray-800">
                    {c.name}{' '}
                    <span className="text-xs text-gray-500">
                      ({new Date(c.created_at || c.timestamp).toLocaleString()})
                    </span>
                  </p>
                  <p className="text-gray-800">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2 text-gray-900">Leave a Comment</h3>
            {message && (
              <p className={`text-sm mb-2 ${isError ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}

            {/* Honeypot (hidden) */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-2 mb-2 border border-gray-300 rounded text-gray-900"
              value={formData.name}
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-2 mb-2 border border-gray-300 rounded text-gray-900"
              value={formData.email}
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <textarea
              placeholder="Your Comment"
              className="w-full p-2 mb-2 border border-gray-300 rounded text-gray-900"
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 rounded text-white ${submitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
            >
              {submitting ? 'Submitting…' : 'Submit Comment'}
            </button>
          </form>
        </div>
      </div>

      {/* Sticky mini back (mobile comfort) */}
      <Link
        to="/blog"
        className="fixed bottom-6 left-6 z-40 bg-white/90 border rounded-full px-3 py-2 shadow hover:bg-white"
      >
        ← Back
      </Link>
    </>
  );
};

export default Blog;
