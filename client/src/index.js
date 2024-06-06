import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { SearchContextProvider } from "./context/SearchContext";
import { DarkModeContextProvider } from "./context/DarkMoodContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <SearchContextProvider>
        <DarkModeContextProvider>
          <App />
        </DarkModeContextProvider>
      </SearchContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
