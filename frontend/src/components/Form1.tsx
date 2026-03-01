import { useState } from "react";

function Form1() {
  const [formData, setFormData] = useState({
    name: "",
    capital: "",
    age: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert(`Name: ${formData.name}
        Capital: ${formData.capital}
        Age: ${formData.age}`);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name</label>
          <br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Number of Shareholders</label>
          <br />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            Capital
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
            name="capital"
            value={formData.capital}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Form1;
