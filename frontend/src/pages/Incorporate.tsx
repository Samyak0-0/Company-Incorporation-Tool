import { useState } from "react";
import "./Incorporate.css";
import Form1 from "../components/Form1";

function StepProgress({ steps, current }) {
  return (
    <div className="grid grid-rows-2 items-center justify-center relative">
      <div className="flex flex-row justify-center pl-8 pr-4 items-center">
        {steps.map((step, i) => {
          const isCompleted = step.id < current;
          const isActive = step.id === current;

          return (
            <div key={step.id} className="flex w-full flex-row ">
              <div key={step.id} className="flex flex-row items-center">
                {i > 0 && (
                  <div
                    className={`step-connector ${isCompleted || isActive ? "step-connector-active" : ""}`}
                  />
                )}

                <div className="flex flex-row items-center gap-2">
                  {/* Circle */}
                  <div
                    className={`step-circle ${
                      isCompleted || isActive
                        ? "step-circle-active"
                        : "step-circle-upcoming"
                    } ${isActive ? "step-circle-ring" : ""}`}
                  >
                    {isCompleted ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3 8l3.5 3.5L13 5"
                          stroke="white"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-row justify-between items-center">
        {steps.map((step, i) => {
          const isCompleted = step.id < current;
          const isActive = step.id === current;
          return (
            <div
              className={`text-sm font-medium text-center  transition-colors duration-300`}
              style={{
                color:
                  isCompleted || isActive
                    ? "var(--color-secondary)"
                    : "#9F9F9280",
              }}
            >
              {step.label.split(" ")[0]}
              <br />
              {step.label.replace(/^\S+\s/, "")}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Incorporate() {
  const [current, setCurrent] = useState(1);

  const steps = [
    { id: 1, label: "Company Information" },
    { id: 2, label: "Shareholder Details" },
    { id: 3, label: "Review & Submit" },
  ];

  return (
    <div className="incorporate">
      <div className="progress-bar">
        <div className="form-box w-9/10">
          <h2 className="text-4xl my-4 text-center">Incorporation Form</h2>
          <StepProgress steps={steps} current={current} />
          <Form1 />
          <div className="flex gap-2.5 mt-9 justify-center">
            <button
              onClick={() => setCurrent((c) => Math.max(1, c - 1))}
              className="btn-back"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrent((c) => Math.min(steps.length, c + 1))}
              className="btn-next"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Incorporate;
