import "./App.css";
import Header from "./Components/Header";
import GridColumn from "./Components/GridColumn";
import React from "react";
import AddNewList from "./Components/AddListIcon";
import Db from "./Components/LocalDb";

const App = () => {
  const dbName = "trello";
  async function InitDB() {
    await Db.InitDB(dbName, 1);
  }
  InitDB();
  return (
    <div className="app">
      <Header />
      <GridColumn />
    </div>
  );
};

export default App;
