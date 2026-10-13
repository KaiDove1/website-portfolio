import React from 'react'
import content from '../../content.json';

const Languages = () => {
    const languages = content.Languages['Programming Languages'];
    return (
        <div className="skills__content">
            <h3 className="skills__title">Programming Languages</h3>

            <div className="skills__box">
                <div className="skills__group">
                    {languages.map(({ name, icon }) => (
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

export default Languages
