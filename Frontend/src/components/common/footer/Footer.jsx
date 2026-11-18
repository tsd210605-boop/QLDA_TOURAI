import React from "react";
import { footer } from "../../data/Data";
import "./footer.css";
import Brand from "../brand/Brand";

const Footer = () => {
    return (
        <>
            {/* Contact Section */}
            <section className="footerContact">
                <div className="container">
                    <div className="send flex">
                        <div className="text">
                            <h1>Bạn cần tư vấn?</h1>
                            <p>Chúng tôi sẵn sàng hỗ trợ nhu cầu du lịch của bạn.</p>
                        </div>
                        <button className="btn5">Liên hệ ngay</button>
                    </div>
                </div>
            </section>

            {/* Main Footer */}
            <footer>
                <div className="container">
                    {/* Logo / Newsletter Box */}
                    <div className="box">
                        <div className="logo">
                            <Brand light />
                            <h2>Bạn cần chúng tôi hỗ trợ điều gì?</h2>
                            <p>
                                Nhận thông tin du lịch, cập nhật hành trình và ưu đãi hàng tháng qua email.
                            </p>

                            <div className="input flex">
                                <input type="text" placeholder="Địa chỉ email" />
                                <button>Đăng ký nhận tin</button>
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
                <span>© {new Date().getFullYear()} Tourism. Bảo lưu mọi quyền.</span>
            </div>
        </>
    );
};

export default Footer;
