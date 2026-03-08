import React, { createContext, useState, useEffect } from "react";

interface Form1Data {
  name: string;
  capital: string;
  noOfHolders: string;
}

export interface Form2DataItem {
  firstName: string;
  lastName: string;
  nationality: string;
}

export interface ContextValue {
  noOfHolders: number;
  setNoOfHolders: React.Dispatch<React.SetStateAction<number>>;
  formStep: number;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
  form1Data: Form1Data;
  setForm1Data: React.Dispatch<React.SetStateAction<Form1Data>>;
  form2Data: Form2DataItem[];
  setForm2Data: React.Dispatch<React.SetStateAction<Form2DataItem[]>>;
  resetForm: () => void;
  resetSection: () => void;
  formState: "PUT" | "POST";
  setFormState: React.Dispatch<React.SetStateAction<"PUT" | "POST">>;
  targetId: number;
  setTargetId: React.Dispatch<React.SetStateAction<number>>;
}

const Context = createContext<ContextValue | undefined>(undefined);

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [noOfHolders, setNoOfHolders] = useState<number>(() => {
    const saved = localStorage.getItem("noOfHolders");
    return saved ? JSON.parse(saved) : 0;
  });

  const [formStep, setFormStep] = useState<number>(() => {
    const saved = localStorage.getItem("formStep");
    return saved ? JSON.parse(saved) : 1;
  });

  const [form1Data, setForm1Data] = useState<Form1Data>(() => {
    const saved = localStorage.getItem("form1Data");
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          capital: "",
          noOfHolders: "",
        };
  });
  const [form2Data, setForm2Data] = useState<Form2DataItem[]>(() => {
    const saved = localStorage.getItem("form2Data");
    return saved ? JSON.parse(saved) : [];
  });

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

  const [formState, setFormState] = useState<"POST" | "PUT">("POST");
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
