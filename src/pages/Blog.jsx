import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axios'; // ✅ Custom axios with CSRF
import bgImage from '../assets/blog.jpg'; // ✅ Import background image

const Blog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const commentSectionRef = useRef(null);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/blogs/${slug}/`);
      setBlog(res.data);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error('Error fetching blog detail:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/blogs/${slug}/comments/`, formData);
      setMessage('✅ Comment posted successfully!');
      setIsError(false);
      setFormData({ name: '', email: '', content: '' });
      fetchBlog(); // Refresh comments
      setTimeout(() => {
        commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error('Comment submission failed:', err);
      setMessage('❌ Failed to post comment');
      setIsError(true);
    }
  };

  if (!blog) return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center py-8 px-4 sm:px-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-lg p-6">
        <Link to="/blog" className="text-blue-500 hover:underline">← Back to Blogs</Link>

        {/* Blog Content */}
        <h1 className="text-3xl font-bold mt-4 text-gray-800">{blog.title}</h1>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Published on {new Date(blog.created_at).toLocaleDateString()}
        </p>
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-72 object-cover rounded-lg shadow mb-6"
          />
        )}
        <div className="text-gray-800 text-lg leading-7 whitespace-pre-line mb-8">
          {blog.content}
        </div>

        {/* Comments Section */}
        <h2 ref={commentSectionRef} className="text-xl font-semibold mb-2">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500 mb-4">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-4 mb-6">
            {comments.slice().reverse().map((c, i) => (
              <div key={i} className="border border-gray-300 p-3 rounded">
                <p className="text-sm font-semibold text-gray-700">
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
        <form onSubmit={handleSubmit} className="bg-white/90 p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2 text-black">Leave a Comment</h3>
          {message && (
            <p className={`text-sm mb-2 ${isError ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
            value={formData.name}
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
            value={formData.email}
            required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <textarea
            placeholder="Your Comment"
            className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
            rows={4}
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Blog;
