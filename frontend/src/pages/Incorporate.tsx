import { useContext } from "react";
import "./Incorporate.css";
import Form1 from "../components/Form1";
import Form2 from "../components/Form2";
import Form3 from "../components/Form3";
import { Context } from "../utils/ContextProvider";
import { StepProgress } from "../utils/StepProgress";
import { FaCircleCheck } from "react-icons/fa6";

function Incorporate() {
  const { formStep, setFormStep } = useContext(Context);

  const steps = [
    { id: 1, label: "Company Information" },
    { id: 2, label: "Shareholder Details" },
    { id: 3, label: "Review & Submit" },
  ];

  return (
    <div className="incorporate">
      <div className="progress-bar">
        <div className="form-box w-9/10 flex flex-col items-center justify-center">
          <div className="">
            <h2 className="text-4xl my-4 text-center">Incorporation Form</h2>
            <StepProgress steps={steps} current={formStep} />
          </div>
          {formStep == 1 ? <Form1 /> : formStep == 2 ? <Form2 /> : <Form3 />}
          <div className="flex gap-2.5 mt-9 justify-center">
            <button
              onClick={() => setFormStep((c) => Math.max(1, c - 1))}
              className="btn-back"
            >
              ← Back
            </button>
            <button
              className="btn-next"
              type="submit"
              form={formStep == 1 ? "form1" : formStep == 2 ? "form2" : "form3"}
            >
              {formStep == 3 ? (
                <span>
                  Submit <FaCircleCheck className="inline" />
                </span>
              ) : (
                "Next →"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Incorporate;
