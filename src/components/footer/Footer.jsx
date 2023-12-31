import React from 'react'
import "./footer.css"

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__container container">
                <h1 className="footer__title">Kai</h1>

                <ul className="footer__list">
                    <li>
                        <a href="#about" className="footer__link">About</a>
                    </li>

                    <li>
                        <a href="#projects" className="footer__link">Projects</a>
                    </li>

                    <li>
                        <a href="#contact" className="footer__link">Contact</a>
                    </li>
                </ul>

                <div className="footer__social">
                    <a href="https://www.facebook.com/Kai2004/" className="footer__social-link" target="_blank" rel="noopener noreferrer">
                        <i className="bx bxl-facebook"></i>
                    </a>

                    <a href="https://www.instagram.com/kai.dove/" className="footer__social-link" target="_blank" rel="noopener noreferrer">
                        <i className="bx bxl-instagram"></i>
                    </a>

                    <a href="https://twitter.com/scanningkai" className="footer__social-link" target="_blank" rel="noopener noreferrer">
                        <i className="bx bxl-twitter"></i>
                    </a>
                </div>


                <span className='footer__copy'>&#169; KaiDove. All rights reserved  v1.07</span>
            </div>
        </footer>
    )
}

export default Footer