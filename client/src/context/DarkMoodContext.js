import { createContext, useReducer } from "react";

const INIT_STATE = {
  darkMode: false,
};

export const darkModeContext = createContext(INIT_STATE);

const darkModeReducer = (state, action) => {
  switch (action.type) {
    case "LIGHT": {
      return { darkMode: false };
    }

    case "DARK": {
      return { darkMode: true };
    }

    case "TOGGLE": {
      return { darkMode: !state.darkMode };
    }
    default:
      return state;
  }
};

export const DarkModeContextProvider = ({ children }) => {
  const [state, dispatchDarkMode] = useReducer(darkModeReducer, INIT_STATE);
  return (
    <darkModeContext.Provider
      value={{ darkMode: state.darkMode, dispatchDarkMode }}
    >
      {children}
    </darkModeContext.Provider>
  );
};
