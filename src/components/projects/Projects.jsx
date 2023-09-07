import React, { useState } from 'react'
import "./projects.css"

const Services = () => {
    const [toggleState, setToggleState] = useState(0);

    const toggleTab = (index) => {
        setToggleState(index);
    }


    return (
        <section className="services section" id="projects">
            <h2 className="section__title">Past Projects</h2>
            <span className="section__subtitle">Most relevant projects...</span>

            <div className="services__container container grid">
                <div className="services__content">
                    <div>
                        <i className="bx bx-barcode-reader services__icon"></i>
                        <h3 className="services__title">Product <br />Identification Project</h3>
                    </div>

                    <span className="services__button" onClick={() => toggleTab(1)}>More Details
                        <i className="uil uil-arrow-right services__button-icon"></i></span>

                    <div className={toggleState === 1 ? "services__modal active-modal" : "services__modal"}>
                        <div className="services__modal-content">
                            
                            <i onClick={() => toggleTab(0)} className="uil uil-times services__modal-close"></i>

                            <h3 className="services__modal-title">Product Identification Project</h3>
                            <p className="services__modal-description">Tools and Technologies used: <br />TensorFlow, Python, HTML & CSS</p>
                            <ul className="services__modal-services grid">
                                <li className="services__modal-service">

                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">Created a streamlined web interface for simple image uploads and quick product identification.</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">Attained significant benchmarks in accuracy and system performance.</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">Successfully managed and completed the project individually from March to June 2023.</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">Identifies products within an impressive average time frame of 1.5 seconds, greatly enhancing the overall efficiency and user satisfaction.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="services__content">
                    <div>
                        <i className="bx bx-mobile-alt services__icon"></i>
                        <h3 className="services__title">Individual Mobile<br /> App Project<br /></h3>
                    </div>

                    <span onClick={() => toggleTab(2)} className="services__button">More Details
                        <i className="uil uil-arrow-right services__button-icon"></i></span>

                    <div className={toggleState === 2 ? "services__modal active-modal" : "services__modal"}>
                        <div className="services__modal-content">
                            <i onClick={() => toggleTab(0)} className="uil uil-times services__modal-close"></i>

                            <h3 className="services__modal-title">Individual Mobile<br /> App Project</h3>
                            <p className="services__modal-description">Tools and Technologies used: <br />Unity3D, JavaScript, FireBase</p>
                            <ul className="services__modal-services grid">
                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">Creation of an immersive tycoon-style mobile app.</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">Implemented a backend system resulting in efficient data storage and retrieval processes</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">Built a in-game currency system that utilizes the back-end system.</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">Built around the "7 Deadly Sins" theme created from my own creativity</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="services__content">
                    <div>
                        <i className="bx bxl-twitter services__icon"></i>
                        <h3 className="services__title">Twitter <br />Replica</h3>
                    </div>

                    <span onClick={() => toggleTab(3)} className="services__button">More Details
                        <i className="uil uil-arrow-right services__button-icon"></i></span>

                    <div className={toggleState === 3 ? "services__modal active-modal" : "services__modal"}>
                        <div className="services__modal-content">
                            <i onClick={() => toggleTab(0)} className="uil uil-times services__modal-close"></i>

                            <h3 className="services__modal-title">Twitter Replica</h3>
                            <p className="services__modal-description">Tools and Technologies used: <br />React, JavaScript, HTML, CSS, FireBase</p>
                            <ul className="services__modal-services grid">
                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">Created with the HackCville group taught by the class: Source</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">Successfully implemented user authentication and real-time updates on the platform</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">Utilized a blend of React, JavaScript, HTML, and CSS to craft a responsive interface</p>
                                </li>

                                <li className="services__modal-service">
                                    <i className="bx bx-right-arrow services__modal-icon"></i>
                                    <p className="services__modal-info">Integrated a dynamic feature that enabled real-time updates on both the Twitter replica and To-Do list components</p>
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