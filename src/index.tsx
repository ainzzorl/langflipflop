import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DAO } from "./common/DAO";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

DAO.getSettings().then((settings) => {
  document.body.classList.toggle("dark", settings.theme === "dark");
});

serviceWorker.register();
