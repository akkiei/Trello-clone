import React from "react";
import "../App.css";
import PlusLogo from "../plus.svg";
const AddCardIcon = (props) => {
  const { addCard } = props;
  return (
    <div className="AddCardIcon">
      <img
        style={{ "marginLeft": "10%" }}
        src={PlusLogo}
        alt="plusLogo"
        width="60"
        height="100"
        onClick={addCard}
      />
    </div>
  );
};

export default AddCardIcon;
