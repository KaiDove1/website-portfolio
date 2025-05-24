import React, { useState } from 'react';
import './Experience.css';

const Experience = () => {
  const [activeExperience, setActiveExperience] = useState(null);

  const experiences = [
    {
      id: 1,
      company: "Tech Solutions Inc.",
      role: "Senior Software Engineer",
      period: "2021 - Present",
      description: "Leading development of enterprise-scale applications and mentoring junior developers.",
      highlights: [
        "Architected and implemented microservices infrastructure reducing deployment time by 60%",
        "Led a team of 5 developers in successful delivery of client projects",
        "Implemented CI/CD pipelines improving deployment efficiency",
        "Reduced system downtime by 40% through infrastructure improvements"
      ],
      technologies: ["React", "Node.js", "AWS", "Docker", "Kubernetes"]
    },
    {
      id: 2,
      company: "Innovation Labs",
      role: "Full Stack Developer",
      period: "2019 - 2021",
      description: "Developed and maintained multiple web applications for enterprise clients.",
      highlights: [
        "Built responsive web applications using React and Node.js",
        "Optimized database queries reducing load times by 50%",
        "Implemented automated testing reducing bugs in production by 30%",
        "Collaborated with UX team to improve user experience"
      ],
      technologies: ["JavaScript", "Python", "PostgreSQL", "Redis", "Jest"]
    },
    {
      id: 3,
      company: "Digital Dynamics",
      role: "Software Developer",
      period: "2017 - 2019",
      description: "Focused on front-end development and UI/UX implementation.",
      highlights: [
        "Developed mobile-first web applications",
        "Created reusable component library",
        "Improved site performance scores by 40%",
        "Implemented analytics tracking system"
      ],
      technologies: ["HTML/CSS", "JavaScript", "Vue.js", "Sass", "Webpack"]
    }
  ];

  return (
    <section id="experience" className="experience">
      <h2 className="section__title">Work Experience</h2>
      <div className="experience-grid">
        {experiences.map((exp) => (
          <div 
            key={exp.id}
            className={`experience-item ${activeExperience === exp.id ? 'active' : ''}`}
            onMouseEnter={() => setActiveExperience(exp.id)}
            onMouseLeave={() => setActiveExperience(null)}
          >
            <div className="experience-content">
              <div className="experience-header">
                <h3 className="company-name">{exp.company}</h3>
                <span className="role">{exp.role}</span>
                <span className="period">{exp.period}</span>
              </div>
              
              <div className="experience-details">
                <p className="description">{exp.description}</p>
                <ul className="highlights">
                  {exp.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
                <div className="technologies">
                  {exp.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience; 