import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { PanierProvider } from "./context/PanierContext";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>

    <PanierProvider>
      <App />
    </PanierProvider>

  </React.StrictMode>
);