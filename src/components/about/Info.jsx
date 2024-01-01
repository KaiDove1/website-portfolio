import React from 'react'
import content from '../../content.json'

const Info = () => {
  return (
    <div className="about__info grid">
        
        <div className="about__box">
        <i class='bx bx-award about__icon'></i>
            <h3 className="about__title">{content.Info.positionsTitle}</h3>
            <span className="about__subtitle">{content.Info.positionsSubtitle}</span>
        </div>

        <div className="about__box">
        <i class='bx bx-briefcase-alt about__icon' ></i>
            <h3 className="about__title">{content.Info.completedTitle}</h3>
            <span className="about__subtitle">{content.Info.completedSubtitle}</span>
        </div>

        <div className="about__box">
        <i class='bx bxs-graduation about__icon' ></i>
            <h3 className="about__title">{content.Info.studentTitle}</h3>
            <span className="about__subtitle">{content.Info.studentSubtitle}</span>
        </div>


    </div>
  )
}

export default Info