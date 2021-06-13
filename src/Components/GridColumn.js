import React, { useEffect, useState } from "react";
import "../App.css";
import Column from "./Column";
import AddNewList from "./AddListIcon";
import cross from "../cancel.svg";
// import idb from "indexed-db-lite"; This is my own npm package.
import Db from "./LocalDb";

const GridColumn = () => {
  const [columns, setColumns] = useState([]);
  const [load, setLoad] = useState(0);
  const [colId, setColId] = useState(1);
  const columnId = [];
  let idCounter = colId;
  const dbName = "trello";

  const appendNewList = async () => {
    idCounter = colId + 1;
    setColumns([...columns, { id: idCounter }]);
    columnId.push(idCounter);
    await Db.createListStore(dbName, idCounter, false);
    setColId(idCounter + 1);
    localStorage.setItem("listCounter", parseInt(idCounter, 10) + 1);
  };

  const deleteList = async (e) => {
    const columnId = e.target.parentElement.id;
    // let colIndex = -1;
    // columns.forEach((col, index) => {
    //   if (col.id == columnId) colIndex = index;
    // });
    const newCols = columns.filter((col) => col.id != columnId);
    // const newCols = [
    //   ...columns.slice(0, colIndex),
    //   ...columns.slice(colIndex + 1),
    // ];
    setColumns(newCols);
    // if (colIndex !== -1) {
    await Db.deleteList(dbName, columnId);
  };
  useEffect(() => {
    const dbVer = localStorage.getItem("dbVer") || 1;
    const listCounter = localStorage.getItem("listCounter") || 1;
    async function readEntireDb(dbName, dbVer) {
      const list = await Db.readAllLists(dbName, dbVer);
      const listArr = [...list];
      const finalListObj = [];
      for (let index = 0; index < listArr.length; index++) {
        const listCardObj = {};
        const listName = listArr[index];
        const cards = await Db.getAllCards(listName);
        listCardObj.id = listName;
        listCardObj.cards = cards;
        finalListObj.push(listCardObj);
      }

      setColumns(
        finalListObj.map((list) => {
          return { id: list.id, cards: list.cards };
        })
      );
      localStorage.setItem("listCounter", parseInt(listCounter, 10) + 1);
      setColId(parseInt(listCounter, 10));
      console.log(list);
    }
    readEntireDb(Db.InitDB, dbName, dbVer);
  }, [load]);

  return (
    <div className="grid">
      {columns.map((col) => {
        // console.log(col);
        return (
          <div id={col.id} key={col.id}>
            <img
              className="crossColumn"
              src={cross}
              alt="cross"
              width="50"
              height="20"
              onClick={deleteList}
            />
            <Column id={col.id} key={col.id} cards={col.cards} />
          </div>
        );
      })}
      <div className="addNewList" key={idCounter}>
        <AddNewList add={appendNewList} />
      </div>
    </div>
  );
};

export default GridColumn;
