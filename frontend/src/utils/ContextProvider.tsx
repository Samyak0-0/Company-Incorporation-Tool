import { createContext, useState, useEffect } from "react";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [noOfHolders, setNoOfHolders] = useState(() => {
    const saved = localStorage.getItem("noOfHolders");
    return saved ? JSON.parse(saved) : 0;
  });
  const [formStep, setFormStep] = useState(() => {
    const saved = localStorage.getItem("formStep");
    return saved ? JSON.parse(saved) : 1;
  });
  const [form1Data, setForm1Data] = useState(() => {
    const saved = localStorage.getItem("form1Data");
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          capital: "",
          noOfHolders: "",
        };
  });
  const [form2Data, setForm2Data] = useState(() => {
    const saved = localStorage.getItem("form2Data");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("noOfHolders", JSON.stringify(noOfHolders));
  }, [noOfHolders]);

  useEffect(() => {
    localStorage.setItem("formStep", JSON.stringify(formStep));
  }, [formStep]);

  useEffect(() => {
    localStorage.setItem("form1Data", JSON.stringify(form1Data));
  }, [form1Data]);

  useEffect(() => {
    localStorage.setItem("form2Data", JSON.stringify(form2Data));
  }, [form2Data]);

  const resetForm = () => {
    localStorage.removeItem("formStep");
    localStorage.removeItem("form1Data");
    localStorage.removeItem("form2Data");
    localStorage.removeItem("noOfHolders");
    setForm1Data({
      name: "",
      capital: "",
      noOfHolders: "",
    });
    setForm2Data([]);
    setFormStep(1);
    setNoOfHolders(0);
    setFormState("POST");
  };

  const resetSection = () => {
    if (formStep == 1) {
      localStorage.removeItem("form1Data");
      setForm1Data({
        name: "",
        capital: "",
        noOfHolders: "",
      });
    } else {
      localStorage.removeItem("form2Data");
      setForm2Data([]);
    }
  };

  const [formState, setFormState] = useState("POST");
  const [targetId, setTargetId] = useState(0);

  return (
    <Context.Provider
      value={{
        noOfHolders,
        setNoOfHolders,
        formStep,
        setFormStep,
        form1Data,
        setForm1Data,
        form2Data,
        setForm2Data,
        resetForm,
        resetSection,
        formState,
        setFormState,
        targetId,
        setTargetId,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
