import React from 'react'

const Info = () => {
  return (
    <div className="about__info grid">
        
        <div className="about__box">
        <i class='bx bx-award about__icon'></i>
            <h3 className="about__title">Experience</h3>
            <span className="about_subtitle"> List Experiences</span>
        </div>

        <div className="about__box">
        <i class='bx bx-briefcase-alt about_icon' ></i>
            <h3 className="about__title">Completed</h3>
            <span className="about_subtitle"># Projects</span>
        </div>

        <div className="about__box">
        <i class='bx bx-support about__icon' ></i>
            <h3 className="about__title">Support</h3>
            <span className="about_subtitle">Online 24/7</span>
        </div>


    </div>
  )
}

export default Info