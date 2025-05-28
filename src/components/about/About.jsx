import React from 'react';
import './About.css';
import {
  FaCode, FaServer, FaTools, FaGraduationCap,
  FaReact, FaNodeJs, FaGithub, FaDocker
} from 'react-icons/fa';
import * as Si from 'react-icons/si';
import { BiCodeAlt } from 'react-icons/bi';
import { MdOutlineEngineering } from 'react-icons/md';


const About = () => {
  return (
    <section id="about">
      <div className="about__container">
        {/* Header Section */}

        {/* Main Content */}
        <div className="about__content">
          {/* Introduction */}
          <div className="about__intro">
            <p className="about__description">
              I am a passionate software engineer with a deep love for creating elegant solutions to complex problems. 
              My journey in technology has been driven by curiosity and a constant desire to learn and grow.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="skills__section">
            <h3 className="skills__title">Technical Expertise</h3>
            <div className="skills__container">
              <div className="skill__group">
                <h4 className="skill__group-title">Frontend Development</h4>
                <div className="skill__items">
                  <div className="skill__item">
                    <FaReact className="skill__icon" />
                    <span>React.js</span>
                  </div>
                  <div className="skill__item">
                    <span>TypeScript</span>
                  </div>
                  <div className="skill__item">
                    <FaCode className="skill__icon" />
                    <span>Next.js</span>
                  </div>
                </div>
              </div>

              <div className="skill__group">
                <h4 className="skill__group-title">Backend Development</h4>
                <div className="skill__items">
                  <div className="skill__item">
                    <FaNodeJs className="skill__icon" />
                    <span>Node.js</span>
                  </div>
                  <div className="skill__item">
                    <span>Python</span>
                  </div>
                  <div className="skill__item">
                    <span>Java</span>
                  </div>
                </div>
              </div>

              <div className="skill__group">
                <h4 className="skill__group-title">Tools & Technologies</h4>
                <div className="skill__items">
                  <div className="skill__item">
                    <FaGithub className="skill__icon" />
                    <span>Git/GitHub</span>
                  </div>
                  <div className="skill__item">
                    <FaDocker className="skill__icon" />
                    <span>Docker</span>
                  </div>
                  <div className="skill__item">
                    <span>AWS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="timeline">
            <h3 className="timeline__title">Professional Journey</h3>
            <div className="timeline__container">
              <div className="timeline__item">
                <BiCodeAlt className="timeline__icon" />
                <div className="timeline__content">
                  <h4>Full Stack Developer</h4>
                  <p>Leading development of modern web applications using React and Node.js</p>
                  <span className="timeline__date">2022 - Present</span>
                </div>
              </div>

              <div className="timeline__item">
                <MdOutlineEngineering className="timeline__icon" />
                <div className="timeline__content">
                  <h4>Software Engineer</h4>
                  <p>Building robust backend systems and APIs</p>
                  <span className="timeline__date">2020 - 2022</span>
                </div>
              </div>

              <div className="timeline__item">
                <FaGraduationCap className="timeline__icon" />
                <div className="timeline__content">
                  <h4>Computer Science Degree</h4>
                  <p>Focused on software engineering and algorithms</p>
                  <span className="timeline__date">2016 - 2020</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Interests */}
          <div className="interests">
            <h3 className="interests__title">Beyond Coding</h3>
            <div className="interests__content">
              <p>
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects,
                and staying up-to-date with the latest industry trends. I'm passionate about creating software that
                makes a positive impact and solving challenging problems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;