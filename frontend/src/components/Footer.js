import React from "react";
import "./footer.css";
const Footer = () => {
    return (
        <footer className="footer  ">
            &copy; {new Date().getFullYear()} All Rights Reserved
        </footer>
    );
};

export default Footer;