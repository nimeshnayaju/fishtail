import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = document.createElement("div");
root.id = "fishtail-root";
document.body.append(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
