import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import bgImage from '../assets/bg-blog.jpg';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get('https://api.bhaskarai.com/api/blogs/')
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error('Error fetching blogs:', err));
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-100 bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="bg-black/60 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-10 text-white text-center drop-shadow-md">
            Latest Blogs
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.slug}
                className="backdrop-blur-md bg-white/10 border border-white/30 rounded-xl text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden"
              >
                {blog.image && (
                  <div className="h-40 overflow-hidden flex justify-center items-center bg-gray-100/10">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="h-full w-auto object-contain transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-1">{blog.title}</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                  <div className="text-sm text-gray-200 mt-2">
                    {blog.summary
                      ? blog.summary.slice(0, 100) + '...'
                      : 'No summary available...'}
                  </div>
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-block mt-4 text-orange-300 font-medium hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
