import { useContext, useState } from "react";
import { Context } from "../utils/ContextProvider";

function Form2() {
  const { noOfHolders } = useContext(Context);
  const placeholderArray = Array.from({ length: JSON.parse(noOfHolders) });
  // console.log(placeholderArray);

  const [formData, setFormData] = useState(() =>
    Array.from({ length: JSON.parse(noOfHolders) }, () => ({
      firstName: "",
      lastName: "",
      nationality: "",
    })),
  );

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    // const formValues = Object.fromEntries(formData);

    formData.forEach((holder, index) => {
      data.append(`holders[${index}][firstName]`, holder.firstName);
      data.append(`holders[${index}][lastName]`, holder.lastName);
      data.append(`holders[${index}][nationality]`, holder.nationality);
    });

    for (const [key, value] of data.entries()) {
      console.log(key, value);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <form onSubmit={handleSubmit}>
        {placeholderArray.map((_, index) => {
          return (
            <div key={index}>
              <div style={{ marginBottom: "15px" }}>
                <label>First Name</label>
                <br />
                <input
                  type="text"
                  name="firstName"
                  value={formData[index].firstName}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label>Last Name</label>
                <br />
                <input
                  type="number"
                  name="lastName"
                  value={formData[index].lastName}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label>
                  Nationality
                  <span
                    className="italic text-base"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    (in Rs)
                  </span>
                </label>
                <br />
                <input
                  type="number"
                  name="nationality"
                  value={formData[index].nationality}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
              </div>
            </div>
          );
        })}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Form2;
