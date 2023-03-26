import React from "react";
import "./Rank.css";
const Rank = ({ name, entries, html }) => {
  return (
    <div className="">
      <div className="white f1">{entries}</div>
      {html}
      <div className="white f5">
        {`${name}, your current entry count is...`}
      </div>
      <h3 className="TitleBr">Smart Brain to Recognize FACES.</h3>
    </div>
  );
};

export default Rank;
