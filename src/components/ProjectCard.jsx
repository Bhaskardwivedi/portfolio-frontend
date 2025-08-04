import React from "react";

const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:scale-[1.02] transition-all"
      onClick={() => onClick(project)}
    >
      <img
        src={project.thumbnail}
        alt={project.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{project.tagline}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
