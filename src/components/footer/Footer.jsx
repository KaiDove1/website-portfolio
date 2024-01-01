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
<<<<<<< HEAD
                        <a href="#future" className="footer__link">Future</a>
=======
                        <a href="#contact" className="footer__link">Contact</a>
>>>>>>> 5c60561cbc3966359c91e39b848dfe6c603065eb
                    </li>
                </ul>

                <div className="footer__social">
                    <a href="https://www.facebook.com/Kai2004/" className="footer__social-link" target="_blank">
                        <i className="bx bxl-facebook"></i>
                    </a>

                    <a href="https://www.instagram.com/kai.dove/" className="footer__social-link" target="_blank">
                        <i className="bx bxl-instagram"></i>
                    </a>

                    <a href="https://twitter.com/scanningkai" className="footer__social-link" target="_blank">
                        <i className="bx bxl-twitter"></i>
                    </a>
                </div>

                <span className='footer__copy'>&#169; KaiDove. All rights reserved</span>
            </div>
        </footer>
    )
}

export default Footer