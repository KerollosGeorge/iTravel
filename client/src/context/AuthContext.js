import { createContext, useEffect, useReducer } from "react";

const INIT_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INIT_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_StART":
      return {
        ...INIT_STATE,
        loading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...INIT_STATE,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGIN_FAILED":
      return {
        ...INIT_STATE,
        error: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...INIT_STATE,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        INIT_STATE,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INIT_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  });

  const updateUser = (user) => {
    dispatch({
      type: "UPDATE_USER",
      payload: user,
    });
  };
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        loading: state.loading,
        error: state.error,
        dispatch,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
