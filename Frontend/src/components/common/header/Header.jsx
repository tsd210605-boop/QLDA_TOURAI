import React, { useState } from "react";
import "./header.css";
import { nav } from "../../data/Data";
import { Link, useHistory } from "react-router-dom";
import logo from "../../images/logo2.jpg";
import { isLoggedIn, canAccessAdmin, getUserRole, getUserName, clearSession } from "../../../utils/auth";

const Header = () => {
    const [mobile, setMobile] = useState(false);
    const history = useHistory();
    const role = getUserRole();
    const userName = getUserName();

    const handleAdminClick = () => {
        if (canAccessAdmin()) {
            history.push("/admin");
        } else {
            history.push("/admin/login");
        }
    };

    const handleLogout = () => {
        clearSession();
        history.push("/");
    };

    return (
        <header className="header">
            <div className="container header-container">
                <div className="logo">
                    <img src={logo} alt="Site Logo" />
                </div>

                <nav className={mobile ? "nav-links mobile-nav" : "nav-links"}>
                    <ul>
                        {nav.map((item, index) => (
                            <li key={index} onClick={() => setMobile(false)}>
                                <Link to={item.path}>{item.text}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="header-btn">
                    {!isLoggedIn() ? (
                        <>
                            <Link to="/login" className="signin-btn-link">Đăng nhập</Link>
                            <button className="signin-btn" onClick={handleAdminClick}>
                                Quản trị
                            </button>
                        </>
                    ) : (
                        <>
                            <span style={{ fontSize: "13px", fontWeight: "600", color: "#2c3e50" }}>
                                {userName} <strong style={{ color: "#2980b9" }}>[{role}]</strong>
                            </span>
                            {canAccessAdmin() && (
                                <button className="signin-btn" onClick={handleAdminClick}>
                                    Quản trị
                                </button>
                            )}
                            <button type="button" className="signin-btn" onClick={handleLogout}>
                                Đăng xuất
                            </button>
                        </>
                    )}
                </div>

                <div className="mobile-toggle" onClick={() => setMobile(!mobile)}>
                    {mobile ? <i className="fa fa-times"></i> : <i className="fa fa-bars"></i>}
                </div>
            </div>
        </header>
    );
};

export default Header;
