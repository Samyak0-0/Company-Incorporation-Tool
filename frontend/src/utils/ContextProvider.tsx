import { createContext, useState } from "react";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [menu, setMenu] = useState(false);
  return (
    <Context.Provider value={{ menu, setMenu }}>{children}</Context.Provider>
  );
};

export { Context, ContextProvider };
