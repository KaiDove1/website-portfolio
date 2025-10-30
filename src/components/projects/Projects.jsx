import React, { useState } from 'react'
import "./projects.css"
import content from '../../content.json';

const Services = () => {
    const [toggleState, setToggleState] = useState(0);
    const projects = content.projects;

    const toggleTab = (index) => {
        setToggleState(index);
    }

    const icons = [
        "bx bx-brain",
        "bx bx-map-alt",
        "bx bx-health",
        "bx bx-restaurant",
        "bx bx-code-block",
        "bx bx-line-chart"
    ];

    return (
        <section className="services section" id="projects">
            <h2 className="section__title">Past Projects</h2>
            <span className="section__subtitle">Most relevant projects...</span>

            <div className="services__container container grid">
                {projects.map((project, index) => (
                    <div className="services__content" key={project.id}>
                        <div>
                            <i className={`${project.icon || icons[index]} services__icon`}></i>
                            <h3 className="services__title">
                                {project.outsidetitle.split('\\n').map((line, lineIndex) => (
                                    <React.Fragment key={lineIndex}>
                                        {line}
                                        {lineIndex < project.outsidetitle.split('\\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </h3>
                        </div>

                        <span className="services__button" onClick={() => toggleTab(project.id)}>
                            More Details
                            <i className="uil uil-arrow-right services__button-icon"></i>
                        </span>

                        <div className={toggleState === project.id ? "services__modal active-modal" : "services__modal"}>
                            <div className="services__modal-content">
                                <i onClick={() => toggleTab(0)} className="uil uil-times services__modal-close"></i>

                                <h3 className="services__modal-title">{project.insideTitle}</h3>
                                <p className="services__modal-description">
                                    {project.description.split('\\n').map((line, lineIndex) => (
                                        <React.Fragment key={lineIndex}>
                                            {line}
                                            {lineIndex < project.description.split('\\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </p>

                                <ul className="services__modal-services grid">
                                    {project.details.map((detail, detailIndex) => (
                                        <li className="services__modal-service" key={detailIndex}>
                                            <i className="bx bx-right-arrow services__modal-icon"></i>
                                            <p className="services__modal-info">{detail}</p>
                                        </li>
                                    ))}
                                </ul>

                                <div className="services__modal-buttons">
                                    {project.demoUrl && (
                                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="button button--flex button--small">
                                            <i className="uil uil-external-link-alt"></i> Live Demo
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="button button--flex button--small">
                                            <i className="uil uil-github-alt"></i> View Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Services
