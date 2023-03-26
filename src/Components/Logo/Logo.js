import React from "react";
import Tilt from "react-tilt";
import "./logo.css";
import Image from "./image.jpg";
const Logo = () => {
  return (
    <div
      style={{ position: "absolute", top: "5%", left: "2%" }}
      className="ma4 mt0"
    >
      <Tilt
        className="Tilt br2 shadow-2"
        options={{ max: 45 }}
        style={{ height: 150, width: 150, cursor: "pointer" }}
      >
        <div className="Tilt-inner Image-box">
          <img className="Image" alt="Logo" src={Image} />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
