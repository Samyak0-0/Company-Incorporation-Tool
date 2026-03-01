import { createContext, useState } from "react";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [noOfHolders, setNoOfHolders] = useState(0);
  const [formStep, setFormStep] = useState(1);
  return (
    <Context.Provider
      value={{
        noOfHolders,
        setNoOfHolders,
        formStep,
        setFormStep,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
