import { useContext, useEffect, useState } from "react";
import { Context, type ContextValue } from "../utils/ContextProvider";
import FlagSelect from "../utils/FlagSelect";
import { RiResetLeftLine } from "react-icons/ri";
import { TfiReload } from "react-icons/tfi";
import { CiLineHeight } from "react-icons/ci";
import { FaArrowsLeftRightToLine } from "react-icons/fa6";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useToast } from "../utils/ToastProvider";

function Form2() {
  const {
    noOfHolders,
    setFormStep,
    form2Data,
    setForm2Data,
    resetSection,
    resetForm,
  } = useContext(Context) as ContextValue;
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"single" | "individual">("single");
  const [currentIndex, setCurrentIndex] = useState(0);
  const placeholderArray = Array.from({ length: noOfHolders });

  useEffect(() => {
    const holdersCount = noOfHolders;

    setForm2Data((prevData) => {
      if (prevData.length === holdersCount) return prevData;

      if (prevData.length < holdersCount) {
        const newEntries = Array.from(
          { length: holdersCount - prevData.length },
          () => ({
            firstName: "",
            lastName: "",
            nationality: "",
          }),
        );

        return [...prevData, ...newEntries];
      }

      return prevData.slice(0, holdersCount);
    });
  }, [noOfHolders, setForm2Data]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } },
    index: number,
  ) => {
    const { name, value } = e.target;
    setForm2Data((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const validateForm = () => {
    for (let i = 0; i < form2Data.length; i++) {
      const holder = form2Data[i];

      if (!holder.firstName || holder.firstName.trim().length < 3) {
        toast.warning(
          "Invalid Form Submission!",
          `Shareholder ${i + 1}: First name must be at least 3 characters`,
        );
        return false;
      }

      if (!holder.lastName || holder.lastName.trim().length < 3) {
        toast.warning(
          "Invalid Form Submission!",
          `Shareholder ${i + 1}: Last name must be at least 3 characters`,
        );
        return false;
      }

      if (!holder.nationality || holder.nationality.trim() === "") {
        toast.warning(
          "Invalid Form Submission!",
          `Shareholder ${i + 1}: Nationality must be selected`,
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setFormStep(3);
    }
  };

  return (
    <div className="h-full">
      <form onSubmit={handleSubmit} id="form2" className="flex flex-col gap-8">
        <div className="flex flex-row mt-5 w-full justify-between items-center gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode("single")}
              className={`px-2 py-1 rounded text-3xl font-medium cursor-pointer`}
              style={
                viewMode === "single"
                  ? {
                      color: "var(--color-bg)",
                      backgroundColor: "var(--color-accent)",
                    }
                  : {
                      backgroundColor: "var(--color-bg)",
                    }
              }
              title="Single Page View"
            >
              <CiLineHeight strokeWidth={1} />
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("individual");
                setCurrentIndex(0);
              }}
              className={`px-2 py-1 rounded text-3xl font-medium cursor-pointer`}
              style={
                viewMode === "individual"
                  ? {
                      color: "var(--color-bg)",
                      backgroundColor: "var(--color-accent)",
                    }
                  : {
                      backgroundColor: "var(--color-bg)",
                    }
              }
              title="Individual Field View"
            >
              <FaArrowsLeftRightToLine />
            </button>
          </div>

          <div className="flex gap-2">
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
        </div>

        {viewMode === "single" ? (
          <>
            {placeholderArray.map((_, index) => {
              return (
                <div
                  className="flex flex-col justify-center items-center"
                  key={index}
                >
                  <p className="text-left w-full text-[1.6rem] mb-2">
                    Shareholder No: {index + 1}
                  </p>
                  <div>
                    <label>
                      First Name <span>*</span>
                    </label>
                    <br />
                    <input
                      className="fields"
                      type="text"
                      name="firstName"
                      minLength={3}
                      value={form2Data[index]?.firstName || ""}
                      onChange={(e) => handleChange(e, index)}
                      required
                    />
                  </div>

                  <div>
                    <label>
                      Last Name <span>*</span>
                    </label>
                    <br />
                    <input
                      className="fields"
                      type="text"
                      name="lastName"
                      minLength={3}
                      value={form2Data[index]?.lastName || ""}
                      onChange={(e) => handleChange(e, index)}
                      required
                    />
                  </div>

                  <div
                    className="w-full pb-2"
                    style={{
                      borderBottom: "3px dashed var(--color-primary)",
                    }}
                  >
                    <label>
                      Nationality <span>*</span>
                    </label>
                    <FlagSelect
                      value={form2Data[index]?.nationality || ""}
                      onChange={(code) =>
                        handleChange(
                          { target: { name: "nationality", value: code } },
                          index,
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === 0 ? placeholderArray.length - 1 : prev - 1,
                  )
                }
                style={{
                  color: "var(--color-bg)",
                  backgroundColor: "var(--color-accent)",
                }}
                className="p-2 hover:scale-105 rounded cursor-pointer"
                title="Previous shareholder"
                disabled={placeholderArray.length === 1}
              >
                <MdNavigateBefore size={24} />
              </button>

              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  Shareholder {currentIndex + 1} of {placeholderArray.length}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === placeholderArray.length - 1 ? 0 : prev + 1,
                  )
                }
                style={{
                  color: "var(--color-bg)",
                  backgroundColor: "var(--color-accent)",
                }}
                className="p-2 hover:scale-105 rounded cursor-pointer"
                title="Next shareholder"
                disabled={placeholderArray.length === 1}
              >
                <MdNavigateNext size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-4  rounded-lg">
              <div>
                <label>
                  First Name <span>*</span>
                </label>
                <br />
                <input
                  className="fields"
                  type="text"
                  name="firstName"
                  minLength={3}
                  value={form2Data[currentIndex]?.firstName || ""}
                  onChange={(e) => handleChange(e, currentIndex)}
                  required
                />
              </div>

              <div>
                <label>
                  Last Name <span>*</span>
                </label>
                <br />
                <input
                  className="fields"
                  type="text"
                  name="lastName"
                  minLength={3}
                  value={form2Data[currentIndex]?.lastName || ""}
                  onChange={(e) => handleChange(e, currentIndex)}
                  required
                />
              </div>

              <div className="w-full">
                <label>
                  Nationality <span>*</span>
                </label>
                <FlagSelect
                  value={form2Data[currentIndex]?.nationality || ""}
                  onChange={(code) =>
                    handleChange(
                      { target: { name: "nationality", value: code } },
                      currentIndex,
                    )
                  }
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Form2;
