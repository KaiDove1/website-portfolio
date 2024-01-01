import React from 'react'
import content from '../../content.json';

const Backend = () => {
    const toolsData = content.ToolsAndTechnologies.Tools;
    return (
        <div className="skills__content">
            <h3 className="skills__title">Tools and Technologies</h3>

            <div className="skills__box">
                <div className="skills__group">
                    <div className="skills__data">
                        <i class='bx bxl-github' ></i>

                        <div>
                            <h3 className="skills__name">{toolsData.title1}</h3>
                            <span className="skills__level">{toolsData.level1}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bxl-visual-studio' ></i>

                        <div>
                            <h3 className="skills__name">{toolsData.title2}</h3>
                            <span className="skills__level">{toolsData.level2}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bx-search-alt' ></i>

                        <div>
                            <h3 className="skills__name">{toolsData.title3}</h3>
                            <span className="skills__level">{toolsData.level3}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bxl-python' ></i>

                        <div>
                            <h3 className="skills__name">{toolsData.title4}</h3>
                            <span className="skills__level">{toolsData.level4}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bx-math' ></i>

                        <div>
                            <h3 className="skills__name">{toolsData.title5}</h3>
                            <span className="skills__level">{toolsData.level5}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bxl-firebase' ></i>

                        <div>
                            <h3 className="skills__name">{toolsData.title6}</h3>
                            <span className="skills__level">{toolsData.level6}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bxl-react' ></i>

                        <div>
                            <h3 className="skills__name">{toolsData.title7}</h3>
                            <span className="skills__level">{toolsData.level7}</span>
                        </div>
                    </div>

                    <div className="skills__data">
                        <i class='bx bxl-slack' ></i>

                        <div>
                            <h3 className="skills__name">{toolsData.title8}</h3>
                            <span className="skills__level">{toolsData.level8}</span>
                        </div>
                    </div>

                   


                </div>
            </div>
        </div>
    )
}

export default Backend