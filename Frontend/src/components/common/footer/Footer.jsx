import React from "react";
import { footer } from "../../data/Data";
import "./footer.css";
import logo from "../../images/logo2.jpg";

const Footer = () => {
    return (
        <>
            {/* Contact Section */}
            <section className="footerContact">
                <div className="container">
                    <div className="send flex">
                        <div className="text">
                            <h1>Do You Have Questions?</h1>
                            <p>We'll help you to solve your travel needs.</p>
                        </div>
                        <button className="btn5">Contact Us Today</button>
                    </div>
                </div>
            </section>

            {/* Main Footer */}
            <footer>
                <div className="container">
                    {/* Logo / Newsletter Box */}
                    <div className="box">
                        <div className="logo">
                            <img src={logo} alt="Footer logo" />
                            <h2>Do You Need Help With Anything?</h2>
                            <p>
                                Receive monthly travel deals, updates, and exclusive discounts
                                in your inbox
                            </p>

                            <div className="input flex">
                                <input type="text" placeholder="Email Address" />
                                <button>Subscribe</button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info Boxes */}
                    {footer.map((val, index) => (
                        <div className="box" key={index}>
                            <h3>{val.title}</h3>
                            <ul>
                                {val.text.map((item, subIndex) => (
                                    <li key={subIndex}>{item.list}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </footer>

            {/* Legal Section */}
            <div className="legal">
                <span>© 2025 TravelBook. Designed By TravelBook.</span>
            </div>
        </>
    );
};

export default Footer;
