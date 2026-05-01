import React from "react";
import "./Header.css";
import Image from "next/image";
import imglogo from "../../public/Logo.png";

function Header() {
  return (
    <div className="header_main">
      <div className="header_main_section_1">
        <div className="header_main_logo">
          <Image src={imglogo} alt="" />
        </div>
      </div>
      <div className="header_main_section_2">
        <div className="header_main_links">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
        </div>
      </div>
      <div className="header_main_section_3">
        <div className="header_main_startnowBtn">
          <a href="/uploadfile">
            <button>Start Now</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Header;
