import React from 'react';
import './certifications.css';

const Certifications = () => {
  const certifications = [
    {
      id: 1,
      icon: 'bx bxl-github',
      title: 'Open Source Contributor',
      organization: 'Hugging Face Transformers',
      date: 'Jan 2024 - Mar 2024',
      description: '3 merged PRs improving BERT documentation and fixing token classification edge cases',
      link: 'https://github.com/huggingface/transformers/pulls?q=is%3Apr+author%3AKaiDove1'
    },
    {
      id: 2,
      icon: 'bx bx-trophy',
      title: 'Dean\'s List',
      organization: 'University of Virginia',
      date: '6 Semesters',
      description: 'Maintained GPA of 3.84 across Computer Science curriculum'
    },
    {
      id: 3,
      icon: 'bx bx-code-alt',
      title: 'LeetCode Active',
      organization: 'LeetCode Platform',
      date: 'Ongoing',
      description: '150+ problems solved across Easy, Medium, and Hard difficulties',
      link: 'https://leetcode.com/KaiDove'
    },
    {
      id: 4,
      icon: 'bx bx-meteor',
      title: 'Research Presenter',
      organization: 'UVA Engineering Symposium',
      date: 'November 2023',
      description: 'Presented medical image segmentation research comparing CNN architectures'
    },
    {
      id: 5,
      icon: 'bx bx-bulb',
      title: 'Capstone Showcase',
      organization: 'UVA CS Department',
      date: 'December 2024',
      description: 'Demonstrated geospatial crop yield prediction system at CS Capstone Showcase'
    },
    {
      id: 6,
      icon: 'bx bx-chalkboard',
      title: 'Teaching Assistant',
      organization: 'Advanced Software Engineering',
      date: '2024 - 2026',
      description: 'Mentoring 6 teams through full SDLC using Django, PostgreSQL, and Scrum'
    }
  ];

  return (
    <section className="certifications section" id="certifications">
      <h2 className="section__title">Achievements & Certifications</h2>
      <span className="section__subtitle">Recognition & Contributions</span>

      <div className="certifications__container container">
        <div className="certifications__grid">
          {certifications.map((cert) => (
            <div key={cert.id} className="certification__card">
              <div className="certification__icon">
                <i className={cert.icon}></i>
              </div>

              <div className="certification__content">
                <h3 className="certification__title">{cert.title}</h3>
                <span className="certification__organization">{cert.organization}</span>
                <p className="certification__description">{cert.description}</p>
                <div className="certification__footer">
                  <span className="certification__date">
                    <i className="uil uil-calendar-alt"></i> {cert.date}
                  </span>
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="certification__link"
                    >
                      View <i className="uil uil-arrow-right"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
