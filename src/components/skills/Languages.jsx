import React from 'react'
import content from '../../content.json';

const Languages = () => {
    const skillsData = content.Languages['Programming Languages']
    return (
        <div className="skills__content">
            <h3 className="skills__title">Programming Languages</h3>

            <div className="skills__box">
                <div className="skills__group">
                    <div className="skills__data">
                        <i className='bx bxl-python'></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title1}</h3>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i className='bx bxl-java'></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title2}</h3>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i className='bx bxl-html5'></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title3}</h3>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i className='bx bxl-css3'></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title4}</h3>
                        </div>
                    </div>


                    <div className="skills__data">
                        <i className='bx bxl-typescript'></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title5}</h3>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i className='bx bxl-javascript'></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title6}</h3>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i className='bx bx-data'></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title7}</h3>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i className='bx bxl-c-plus-plus'></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title8}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Languages
