import React, { useState } from "react";
import "../App.css";
import cross from "../cancel.svg";
const Card = (props) => {
  const [title, setTitle] = useState(props.title || "");
  const [text, setText] = useState(props.text || "");
  const [buttonText, setButtonText] = useState(props.buttonText || "");
  const { deleteCard, addCard } = props;
  const handleOnchangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleOnchangeText = (e) => {
    setText(e.target.value);
  };
  const handleEmpty = () => {
    if (title.length === 0) return false;
    return true;
  };
  return (
    <div className="card" id={props.id}>
      <img
        className="cross"
        src={cross}
        alt="cross"
        width="50"
        height="15"
        onClick={deleteCard}
      />
      <input
        type="text"
        id={`title_${props.id}`}
        placeholder="Title"
        value={title}
        onChange={handleOnchangeTitle}
      />
      <textarea
        placeholder="Type anything"
        id={`text_${props.id}`}
        rows={5}
        cols={10}
        value={text}
        onChange={handleOnchangeText}
      />
      <button
        onClick={(e) => {
          if (!handleEmpty()) {
            e.preventDefault();
            alert("Please Enter Title atleast");
          } else {
            setButtonText("Update");
            addCard(e, title, text, buttonText);
          }
        }}
      >
        {buttonText || "Save"}
      </button>
    </div>
  );
};

export default Card;
