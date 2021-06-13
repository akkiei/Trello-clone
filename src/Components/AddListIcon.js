import React from "react";
import "../App.css";
import PlusLogo from "../reminders.svg";

const AddListIcon = (props) => {
  const { add } = props;
  return (
    <div>
      <img
        style={{ marginLeft: "80%", marginTop: "70%" }}
        src={PlusLogo}
        alt="plusLogo"
        width="100"
        height="80"
        onClick={add}
      />
    </div>
  );
};

export default AddListIcon;
