import "./index.css";

import * as ReactDOM from "react-dom";
import { StrictMode } from "react";
import { disableOutlinesForClick } from "lib/outline-on-click";
import App from "app/components/App";
import reportWebVitals from "./reportWebVitals";
import "lib/slp-ship";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);

disableOutlinesForClick();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
