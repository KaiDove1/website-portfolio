import React from 'react'
import content from '../../content.json';
const Frontend = () => {
    const skillsData = content.Langugaes['Programming Languages']
    return (
        <div className="skills__content">
            <h3 className="skills__title">Programming Langugaes</h3>

            <div className="skills__box">
                <div className="skills__group">
                    <div className="skills__data">
                        <i class='bx bxl-python'></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title1}</h3>
                            <span className="skills__level">{skillsData.level1}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bxl-java' ></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title2}</h3>
                            <span className="skills__level">{skillsData.level2}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bxl-html5' ></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title3}</h3>
                            <span className="skills__level">{skillsData.level3}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bxl-css3' ></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title4}</h3>
                            <span className="skills__level">{skillsData.level4}</span>
                        </div>
                    </div>


                    <div className="skills__data">
                        <i class='bx bxl-typescript' ></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title5}</h3>
                            <span className="skills__level">{skillsData.level5}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bxl-javascript' ></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title6}</h3>
                            <span className="skills__level">{skillsData.level6}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bx-data' ></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title7}</h3>
                            <span className="skills__level">{skillsData.level7}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bxl-c-plus-plus' ></i>

                        <div>
                            <h3 className="skills__name">{skillsData.title8}</h3>
                            <span className="skills__level">{skillsData.level8}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Frontend