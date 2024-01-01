import React, { useState } from 'react'
import "./projects.css"
import content from '../../content.json';

const Services = () => {
    const [toggleState, setToggleState] = useState(0);
    const project1 = content.projects[0];
    const project2 = content.projects[1];
    const project3 = content.projects[2];

    const toggleTab = (index) => {
        setToggleState(index);
    }


    return (
        <section className="services section" id="projects">
            <h2 className="section__title">Past Projects</h2>
            <span className="section__subtitle">Most relevant projects...</span>

            <div className="services__container container grid">
                {/* Project 1 */}
                <div className="services__content">
                    <div>
                        <i className="bx bx-barcode-reader services__icon"></i>
                        <h3 className="services__title">
                            {project1.outsidetitle.split('\\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    {index < project1.outsidetitle.split('\\n').length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </h3>
                    </div>

                    <span className="services__button" onClick={() => toggleTab(1)}>More Details
                        <i className="uil uil-arrow-right services__button-icon"></i></span>

                    <div className={toggleState === 1 ? "services__modal active-modal" : "services__modal"}>
                        <div className="services__modal-content">
                            
                            <i onClick={() => toggleTab(0)} className="uil uil-times services__modal-close"></i>

                            <h3 className="services__modal-title">{project1.insideTitle}</h3>
                            <p className="services__modal-description">
                                {project1.description.split('\\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        {index < project1.description.split('\\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </p>
                            <ul className="services__modal-services grid">
                                <li className="services__modal-service">

                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">{project1.details[0]}</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">{project1.details[1]}</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">{project1.details[2]}</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">{project1.details[3]}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="services__content">
                    <div>
                        <i className="bx bx-mobile-alt services__icon"></i>
                        <h3 className="services__title">
                            {project2.outsidetitle.split('\\n').map((line, index, array) => (
                                <React.Fragment key={index}>
                                    {line}
                                    {index < array.length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </h3>

                    </div>

                    <span onClick={() => toggleTab(2)} className="services__button">More Details
                        <i className="uil uil-arrow-right services__button-icon"></i></span>

                    <div className={toggleState === 2 ? "services__modal active-modal" : "services__modal"}>
                        <div className="services__modal-content">
                            <i onClick={() => toggleTab(0)} className="uil uil-times services__modal-close"></i>

                            <h3 className="services__modal-title">
                                {project2.insideTitle.split('\\n').map((line, index, array) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        {index < array.length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </h3>

                            <p className="services__modal-description">
                                {project2.description.split('\\n').map((line, index, array) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        {index < array.length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </p>

                            <ul className="services__modal-services grid">
                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">{project2.details[0]}</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">{project2.details[1]}</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">{project2.details[2]}</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">{project2.details[3]}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="services__content">
                    <div>
                        <i className="bx bxl-twitter services__icon"></i>
                        <h3 className="services__title">
                            {project3.outsidetitle.split('\\n').map((line, index, array) => (
                                <React.Fragment key={index}>
                                    {line}
                                    {index < array.length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </h3>
                    </div>

                    <span onClick={() => toggleTab(3)} className="services__button">More Details
                        <i className="uil uil-arrow-right services__button-icon"></i></span>

                    <div className={toggleState === 3 ? "services__modal active-modal" : "services__modal"}>
                        <div className="services__modal-content">
                            <i onClick={() => toggleTab(0)} className="uil uil-times services__modal-close"></i>

                            <h3 className="services__modal-title">{project3.insideTitle}</h3>
                            <p className="services__modal-description">
                                {project3.description.split('\\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        {index < project1.description.split('\\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </p>
                            <ul className="services__modal-services grid">
                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">{project3.details[0]}</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">{project3.details[1]}</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">{project3.details[2]}</p>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Services