import { useContext } from "react";
import "./Form1.css";
import { Context, type ContextValue } from "../utils/ContextProvider";
import { RiResetLeftLine } from "react-icons/ri";
import { TfiReload } from "react-icons/tfi";
import { useToast } from "../utils/Notifications";

function Form1() {
  const {
    setNoOfHolders,
    setFormStep,
    form1Data,
    setForm1Data,
    resetForm,
    resetSection,
  } = useContext(Context) as ContextValue;
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name == "noOfHolders") {
      setNoOfHolders(JSON.parse(value));
    }
    setForm1Data({
      ...form1Data,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (form1Data.name.length < 3) {
      toast.warning(
        "Invalid Form Submission!",
        "Company name must be at least 3 characters long",
      );
      return false;
    }

    const noOfHolders = parseInt(form1Data.noOfHolders);
    if (
      isNaN(noOfHolders) ||
      noOfHolders < 1 ||
      !Number.isInteger(noOfHolders)
    ) {
      toast.warning(
        "Invalid Form Submission!",
        "Number of shareholders must be a whole number and at least 1",
      );
      return false;
    }

    const capital = parseFloat(form1Data.capital);
    if (isNaN(capital) || capital < 10000) {
      toast.warning(
        "Invalid Form Submission!",
        "Capital must be at least 10000",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setFormStep(2);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} id="form1">
        <div className="flex flex-row  w-full justify-end gap-2">
          <button
            onClick={resetSection}
            className="reset-buttons text-3xl"
            title="Reset this section"
          >
            <RiResetLeftLine strokeWidth={0.5} />
          </button>
          <button
            onClick={resetForm}
            className="reset-buttons text-3xl font-extrabold"
            title="Reset the entire form"
          >
            <TfiReload strokeWidth={0.5} />
          </button>
        </div>
        <div className=" text-3xl">
          <label>
            Name <span>*</span>
          </label>
          <br />
          <input
            type="text"
            name="name"
            value={form1Data.name}
            onChange={handleChange}
            minLength={3}
            required
          />
        </div>
        <div className=" text-3xl">
          <label>
            Number of Shareholders <span>*</span>
          </label>
          <br />
          <input
            type="number"
            name="noOfHolders"
            value={form1Data.noOfHolders}
            onChange={handleChange}
            min={1}
            step={1}
            required
          />
        </div>

        <div className=" text-3xl">
          <label>
            Capital <span>*</span>
          </label>
          <br />
          <input
            type="number"
            name="capital"
            value={form1Data.capital}
            onChange={handleChange}
            min={10000}
            step={0.001}
            required
          />
        </div>
      </form>
    </div>
  );
}

export default Form1;
