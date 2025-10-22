import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/assets/css/index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import AuthBootstrap from "./components/AuthBootstrap.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthBootstrap />
      <App />
    </BrowserRouter>
  </StrictMode>
);
