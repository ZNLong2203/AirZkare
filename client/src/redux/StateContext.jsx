import React, { createContext, useContext, useReducer } from 'react';
import { initialState, reducer } from './StateReducers';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const contextValue = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateProvider = () => {
  const context = useContext(StateContext);
  return context;
};