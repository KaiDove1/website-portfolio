import React, { useState } from 'react';
import './Projects.css';

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "Product Identification",
      subtitle: "AI/ML Project",
      description: "Created a streamlined web interface for simple image uploads and quick product identification.",
      details: [
        "Built with TensorFlow and Python",
        "Achieved significant benchmarks in accuracy",
        "1.5 second average processing time",
        "Streamlined user interface for uploads"
      ],
      link: "https://github.com/KaiDove/product-identification"
    },
    {
      id: 2,
      title: "Mobile Game Development",
      subtitle: "Unity3D Project",
      description: "Immersive tycoon-style mobile game with backend integration.",
      details: [
        "Built with Unity3D and Firebase",
        "Implemented in-game currency system",
        "Created custom theme and assets",
        "Backend system for data persistence"
      ],
      link: "https://github.com/KaiDove/mobile-game"
    },
    {
      id: 3,
      title: "Cancer Segmentation",
      subtitle: "Healthcare AI",
      description: "ML-powered cancer cell segmentation using advanced computer vision.",
      details: [
        "FastAPI backend architecture",
        "TensorFlow for image processing",
        "Advanced ML techniques",
        "High accuracy rate in detection"
      ],
      link: "https://github.com/KaiDove/cancer-segmentation"
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="projects-grid">
        {projects.map((project) => (
          <div 
            key={project.id}
            className={`project-item ${activeProject === project.id ? 'active' : ''}`}
            onMouseEnter={() => setActiveProject(project.id)}
            onMouseLeave={() => setActiveProject(null)}
          >
            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-subtitle">{project.subtitle}</p>
              
              <div className="project-details">
                <p className="project-description">{project.description}</p>
                <ul className="project-features">
                  {project.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                  View Project
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;