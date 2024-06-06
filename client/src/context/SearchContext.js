import { createContext, useReducer } from "react";

const INITIAL_STATE = {
    city:undefined,
    date:[],
    options:{
        adult:undefined,
        children: undefined,
        room:undefined
    }
}

export const SearchContext = createContext(INITIAL_STATE)

const SearchReducer = (state,action)=>{
    switch (action.type){
        case "New_Search":
            return action.payload
        
        case "Reset_Search" :
            return INITIAL_STATE

        default :
            return state
    }
}

export const SearchContextProvider = ({children}) =>{
    const [state,dispatch] = useReducer(SearchReducer , INITIAL_STATE)
    return (
        <SearchContext.Provider value={{city:state.city, date:state.date, options:state.options, dispatch}} >
            {children}
        </SearchContext.Provider>
    )
}