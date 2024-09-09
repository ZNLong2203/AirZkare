import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { initialState, reducer, Action } from './StateReducers';

interface StateProviderProps {
  children: ReactNode;
}

interface StateContextType {
  state: typeof initialState;
  dispatch: Dispatch<Action>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const contextValue = { state, dispatch };
  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateProvider = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useStateProvider must be used within a StateProvider');
  }
  return context;
};