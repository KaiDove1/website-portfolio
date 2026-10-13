import React from 'react'
import content from '../../content.json';

const Tools = () => {
    const tools = content.ToolsAndTechnologies.Tools;
    return (
        <div className="skills__content">
            <h3 className="skills__title">Tools and Technologies</h3>

            <div className="skills__box">
                <div className="skills__group">
                    {tools.map(({ name, icon }) => (
                        <div className="skills__data" key={name}>
                            <i className={icon}></i>

                            <div>
                                <h3 className="skills__name">{name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Tools
