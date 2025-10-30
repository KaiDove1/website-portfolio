import React, { useState } from 'react'
import "./qualification.css"

const Qualification = () => {

    const [toggleState, setToggleState] = useState(0);

    const toggleTab = (index) => {
        setToggleState(index);
    }

    return (
        <section className="qualification section">
            <h2 className="section__title">Qualification</h2>
            <span className="section__subtitle">My Personal Journey (Press Icons)</span>

            <div className="qualification__container container">
                <div className="qualification__tabs">
                    <div className={toggleState === 1
                        ? "qualification__button qualification__active button--flex"
                        : "qualification__button button--flex"}
                        onClick={() => toggleTab(1)}>
                        <i className="uil uil-graduation-cap qualification__icon"></i>
                        Education
                    </div>

                    <div className={toggleState === 2
                        ? "qualification__button qualification__active button--flex"
                        : "qualification__button button--flex"}
                        onClick={() => toggleTab(2)}>
                        <i className="uil uil-briefcase-alt qualification__icon"></i>
                        Experience
                    </div>
                </div>

                <div className="qualification__sections">
                    <div className={toggleState === 1 ? "qualification__content qualification__content-active" : "qualification__content"}>
                        <div className="qualification__data">
                            <div>
                                <h3 className="qualification__title">University of Virginia</h3>
                                <span className="qualification__subtitle">B.S. Computer Science | GPA: 3.84</span>
                                <div className="qualification__calender">
                                    <i className="uil uil-calendar-alt"></i> August 2022 - May 2026
                                </div>
                            </div>

                            <div>
                                <span className="qualification__rounder"></span>
                                <span className="qualification__line"></span>
                            </div>
                        </div>

                        <div className="qualification__data">
                            <div></div>

                            <div>
                                <span className="qualification__rounder"></span>
                                <span className="qualification__line"></span>
                            </div>

                            <div>
                                <h3 className="qualification__title">Forest Park High School</h3>
                                <span className="qualification__subtitle">High School Diploma</span>
                                <div className="qualification__calender">
                                    <i className="uil uil-calendar-alt"></i> August 2018 - May 2022
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={toggleState === 2 ? "qualification__content qualification__content-active" : "qualification__content"}>
                        <div className="qualification__data">
                            <div>
                                <h3 className="qualification__title">Junior Software Developer</h3>
                                <span className="qualification__subtitle">LionPro.AI (Lion Federal)</span>
                                <div className="qualification__calender">
                                    <i className="uil uil-calendar-alt"></i> August 2025 - Present
                                </div>
                            </div>

                            <div>
                                <span className="qualification__rounder"></span>
                                <span className="qualification__line"></span>
                            </div>
                        </div>

                        <div className="qualification__data">
                            <div></div>

                            <div>
                                <span className="qualification__rounder"></span>
                                <span className="qualification__line"></span>
                            </div>

                            <div>
                                <h3 className="qualification__title">Software Engineer Intern</h3>
                                <span className="qualification__subtitle">Lion Federal</span>
                                <div className="qualification__calender">
                                    <i className="uil uil-calendar-alt"></i> May 2025 - August 2025
                                </div>
                            </div>
                        </div>

                        <div className="qualification__data">
                            <div>
                                <h3 className="qualification__title">Software Engineer Intern</h3>
                                <span className="qualification__subtitle">Electric On Ramp</span>
                                <div className="qualification__calender">
                                    <i className="uil uil-calendar-alt"></i> May 2024 - August 2024
                                </div>
                            </div>

                            <div>
                                <span className="qualification__rounder"></span>
                                <span className="qualification__line"></span>
                            </div>
                        </div>

                        <div className="qualification__data">
                            <div></div>

                            <div>
                                <span className="qualification__rounder"></span>
                                <span className="qualification__line"></span>
                            </div>

                            <div>
                                <h3 className="qualification__title">Teaching Assistant</h3>
                                <span className="qualification__subtitle">University of Virginia</span>
                                <div className="qualification__calender">
                                    <i className="uil uil-calendar-alt"></i> August 2024 - May 2026
                                </div>
                            </div>
                        </div>

                        <div className="qualification__data">
                            <div>
                                <h3 className="qualification__title">Research Assistant</h3>
                                <span className="qualification__subtitle">UVA Medical Image Lab</span>
                                <div className="qualification__calender">
                                    <i className="uil uil-calendar-alt"></i> May 2023 - August 2023
                                </div>
                            </div>

                            <div>
                                <span className="qualification__rounder"></span>
                                <span className="qualification__line"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Qualification
