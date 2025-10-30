import React, { useState, useEffect } from 'react'
import "./header.css"
import content from "../../content.json";

const Header = () => {
    /* ========= Toggle Menu ================= */
    const [Toggle, showMenu] = useState(false);
    const [activeNav, setActiveNav] = useState("#home");

    /* ========= Change background header ================= */
    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('.header');
            if (window.scrollY >= 80) {
                header.classList.add('scroll-header');
            } else {
                header.classList.remove('scroll-header');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="header">
            <nav className="nav container">
                <a href="index.html" className="nav__logo">{content.Header.logoText}</a>

                <div className={Toggle ? "nav__menu show-menu" : "nav__menu"}>
                    <ul className="nav__list grid">
                        <li className="nav__item">
                            <a href="#home" onClick={() => { setActiveNav('#home'); showMenu(false); }} className={activeNav === "#home" ? "nav__link active-link" : "nav__link"}>
                                <i className="uil uil-estate nav__icon"></i> {content.Header.navLocation1}
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#about" onClick={() => { setActiveNav('#about'); showMenu(false); }} className={activeNav === "#about" ? "nav__link active-link" : "nav__link"}>
                                <i className="uil uil-user nav__icon"></i> {content.Header.navLocation2}
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#skills" onClick={() => { setActiveNav('#skills'); showMenu(false); }} className={activeNav === "#skills" ? "nav__link active-link" : "nav__link"}>
                                <i className="uil uil-file-alt nav__icon"></i> {content.Header.navLocation3}
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#github" onClick={() => { setActiveNav('#github'); showMenu(false); }} className={activeNav === "#github" ? "nav__link active-link" : "nav__link"}>
                                <i className="uil uil-github-alt nav__icon"></i> {content.Header.navLocation4}
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#projects" onClick={() => { setActiveNav('#projects'); showMenu(false); }} className={activeNav === "#projects" ? "nav__link active-link" : "nav__link"}>
                                <i className="uil uil-briefcase-alt nav__icon"></i> {content.Header.navLocation5}
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#qualification" onClick={() => { setActiveNav('#qualification'); showMenu(false); }} className={activeNav === "#qualification" ? "nav__link active-link" : "nav__link"}>
                                <i className="uil uil-graduation-cap nav__icon"></i> {content.Header.navLocation6}
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#certifications" onClick={() => { setActiveNav('#certifications'); showMenu(false); }} className={activeNav === "#certifications" ? "nav__link active-link" : "nav__link"}>
                                <i className="uil uil-award nav__icon"></i> {content.Header.navLocation7}
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#contact" onClick={() => { setActiveNav('#contact'); showMenu(false); }} className={activeNav === "#contact" ? "nav__link active-link" : "nav__link"}>
                                <i className="uil uil-message nav__icon"></i>{content.Header.navLocation8}
                            </a>
                        </li>
                    </ul>

                    <i className="uil uil-times nav__close" onClick={() => showMenu(!Toggle)}></i>
                </div>

                <div className="nav__toggle" onClick={() => showMenu(!Toggle)}>
                    <i className="uil uil-apps"></i>
                </div>
            </nav>
        </header>
    )
}

export default Header