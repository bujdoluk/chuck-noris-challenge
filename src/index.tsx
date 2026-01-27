import React from "react";
import ReactDOM from "react-dom";
import "./i18n/index.ts";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
