import React from "react";
import Home from "./Home.tsx";
import "./styles.css";
import Favourites from "./Favourites.tsx";

export default function App() {
  return (
    <div className="App">
      <Home />
      <Favourites />
    </div>
  );
}
