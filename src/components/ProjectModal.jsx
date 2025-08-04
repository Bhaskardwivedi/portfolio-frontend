import React from "react";
import ReactPlayer from "react-player";

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 text-white rounded-lg max-w-3xl w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-4 text-white text-2xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-orange-500 mb-4">
          {project.title}
        </h2>

        <p className="text-gray-300 mb-4">{project.description}</p>

        {project.features?.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold">Key Features:</h4>
            <ul className="list-disc pl-5">
              {project.features.map((f) => (
                <li key={f.id}>{f.text}</li>
              ))}
            </ul>
          </div>
        )}

        {project.tech_stacks?.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold">Tech Stack:</h4>
            <p>{project.tech_stacks.map((t) => t.text).join(", ")}</p>
          </div>
        )}

        {/* Video Section */}
        {project.demo_video && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Demo Video:</h4>
            <div className="aspect-w-16 aspect-h-9">
              <ReactPlayer
                url={project.demo_video}
                controls
                width="100%"
                height="100%"
              />
            </div>
          </div>
        )}

        {/* Image */}
        {project.image && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Project Preview:</h4>
            <img
              src={project.image}
              alt={project.title}
              className="rounded-md border border-gray-700"
            />
          </div>
        )}

        {/* Links */}
        <div className="mt-4 space-x-4">
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              GitHub
            </a>
          )}
          {project.live_link && (
            <a
              href={project.live_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 underline"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
