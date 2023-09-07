import React from 'react'

const Info = () => {
  return (
    <div className="about__info grid">
        
        <div className="about__box">
        <i class='bx bx-award about__icon'></i>
            <h3 className="about__title">Past Positions</h3>
            <span className="about__subtitle">President of SHS</span>
        </div>

        <div className="about__box">
        <i class='bx bx-briefcase-alt about__icon' ></i>
            <h3 className="about__title">Completed</h3>
            <span className="about__subtitle">6 Projects</span>
        </div>

        <div className="about__box">
        <i class='bx bxs-graduation about__icon' ></i>
            <h3 className="about__title">Student</h3>
            <span className="about__subtitle">@ UVA</span>
        </div>


    </div>
  )
}

export default Info