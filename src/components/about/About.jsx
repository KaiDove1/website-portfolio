import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about">
      <div className="head">
        <h1 className="pageTtl">About</h1>
        <p className="sub">Profile & Skills</p>
      </div>
      
      <div className="box">
        <div className="text">
          <p>
            I am a passionate software developer with a focus on creating beautiful and functional web applications.
            My journey in technology has led me to develop expertise in modern web technologies and best practices.
          </p>
        </div>

        <table className="detail">
          <tbody>
            <tr>
              <th>Name</th>
              <td>Kai Do</td>
            </tr>
            <tr>
              <th>Skills</th>
              <td>
                <div>Frontend Development: React.js, Next.js, TypeScript, CSS/SCSS</div>
                <div>Backend Development: Node.js, Python, Java</div>
                <div>Tools & Others: Git, Docker, AWS, CI/CD</div>
              </td>
            </tr>
            <tr>
              <th>Experience</th>
              <td>
                <div>Full Stack Developer with expertise in modern web technologies</div>
                <div>Passionate about creating intuitive user interfaces and robust backend systems</div>
                <div>Strong focus on code quality and performance optimization</div>
              </td>
            </tr>
            <tr>
              <th>Education</th>
              <td>
                <div>Computer Science Degree</div>
                <div>Continuous learning through online courses and professional development</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default About;