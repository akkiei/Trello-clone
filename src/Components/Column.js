import React, { useState, useEffect } from "react";
import "../App.css";
import Card from "./Card";
import AddCardIcon from "./AddCardIcon";
// import idb from "indexed-db-lite";
import Db from "./LocalDb";
// import _ from "lodash";
const Column = (props) => {
  // const [cards, setCards] = useState(props.cards || []);
  const [cardDetails, setCardDetails] = useState(props.cards || []);

  const cardId = [];
  const dbName = "trello";

  const addNewCard = async (e) => {
    const curId = cardDetails.length + 1;
    setCardDetails([...cardDetails, { id: curId.toString() }]);
  };

  const saveCard = async (e, title, text, buttonText) => {
    const curId = e.target.parentElement.id;
    const parentId = e.target.parentElement.parentElement.parentElement.id;
    if (buttonText === "Update") {
      await Db.updateCard(parentId, curId.toString(), {
        title: title,
        text: text,
      });
    } else
      await Db.addCard(
        parentId,
        { title: title, text: text, create_tm: new Date().getTime() },
        curId.toString()
      );
    let cardIndex = -1;
    cardDetails.forEach((card, index) => {
      if (card.id == curId.toString()) cardIndex = index;
    });
    if (cardIndex >= 0)
      cardDetails[cardIndex] = {
        id: curId.toString(),
        data: {
          title: title,
          text: text,
          create_tm: new Date().getTime(),
        },
      };

    setCardDetails(cardDetails);
  };

  const deleteCard = async (e) => {
    const parentId = e.target.parentElement.parentElement.parentElement.id;
    const cardId = e.target.parentElement.id;
    const newCards = cardDetails.filter((card) => {
      console.log(card.id, cardId);
      return card.id != cardId;
    });
    const sortedCards = newCards.sort((a, b) => {
      return b?.data?.create_tm - a?.data?.create_tm;
    });
    setCardDetails(sortedCards);
    await Db.deleteCard(parentId, cardId);
  };

  return (
    <div className="column">
      {cardDetails.map((card) => {
        const id = card.id;
        let buttonTitle = "Save";
        if (card?.data?.title?.length > 0) buttonTitle = "Update";
        return (
          <Card
            id={id}
            deleteCard={deleteCard}
            key={id}
            addCard={saveCard}
            title={card?.data?.title}
            text={card?.data?.text}
            buttonText={buttonTitle}
          />
        );
      })}
      <AddCardIcon addCard={addNewCard} />
    </div>
  );
};

export default Column;
