import React, { useState, useEffect } from "react";
import "./header.css";
import { nav } from "../../data/Data";
import { Link, useHistory, useLocation } from "react-router-dom";
import logo from "../../images/logo2.jpg";
import { isLoggedIn, canAccessAdmin, getUserRole, getUserName, clearSession } from "../../../utils/auth";

const Header = () => {
    const [mobile, setMobile] = useState(false);
    const history = useHistory();
    const location = useLocation();

    const [auth, setAuth] = useState({
        loggedIn: isLoggedIn(),
        role: getUserRole(),
        userName: getUserName(),
        canAdmin: canAccessAdmin()
    });

    const refreshAuth = () => {
        setAuth({
            loggedIn: isLoggedIn(),
            role: getUserRole(),
            userName: getUserName(),
            canAdmin: canAccessAdmin()
        });
    };

    useEffect(() => {
        refreshAuth();
        const handler = () => refreshAuth();
        window.addEventListener("auth-changed", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("auth-changed", handler);
            window.removeEventListener("storage", handler);
        };
    }, [location.pathname]);

    const handleAdminClick = () => {
        if (canAccessAdmin()) {
            history.push("/admin");
        } else {
            history.push("/admin/login");
        }
    };

    const handleLogout = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        clearSession();
        setAuth({
            loggedIn: false,
            role: "CUSTOMER",
            userName: "User",
            canAdmin: false
        });
        window.location.href = "/";
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
                    {!auth.loggedIn ? (
                        <>
                            <Link to="/login" className="signin-btn-link">Đăng nhập</Link>
                            <button type="button" className="signin-btn" onClick={handleAdminClick}>
                                Quản trị
                            </button>
                        </>
                    ) : (
                        <>
                            <span style={{ fontSize: "13px", fontWeight: "600", color: "#2c3e50" }}>
                                {auth.userName} <strong style={{ color: "#2980b9" }}>[{auth.role}]</strong>
                            </span>
                            {auth.canAdmin && (
                                <button type="button" className="signin-btn" onClick={handleAdminClick}>
                                    Quản trị
                                </button>
                            )}
                            <button
                                type="button"
                                className="header-logout-btn"
                                onClick={handleLogout}
                                title="Đăng xuất khỏi tài khoản"
                            >
                                <i className="fa fa-sign-out-alt"></i> Đăng xuất
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
