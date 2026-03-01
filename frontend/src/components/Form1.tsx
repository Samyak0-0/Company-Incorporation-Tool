import { useContext, useState } from "react";
import "./Form1.css";
import { Context } from "../utils/ContextProvider";

function Form1() {
  const { setNoOfHolders } = useContext(Context);
  const [formData, setFormData] = useState({
    name: "",
    capital: "",
    noOfHolders: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "noOfHolders") {
      setNoOfHolders(value);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Data:", formData);
    alert(`Name: ${formData.name}
        Capital: ${formData.capital}
        NoOfHolders: ${formData.noOfHolders}`);
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
            name="noOfHolders"
            value={formData.noOfHolders}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Capital</label>
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
