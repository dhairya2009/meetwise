import React from "react";
import Header from "./Header/Header";
import Body from "./LandingPageBody/Body";

function page() {
  return (
    <div>
      <div className="header_page">
        <Header />
      </div>
      <div className="body_page">
        <Body/>
      </div>
    </div>
  );
}

export default page;
