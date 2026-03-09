import { useContext, useRef } from "react";
import { Context, type ContextValue } from "../../utils/ContextProvider";
import { useToast } from "../../utils/ToastProvider";
import html2pdf from "html2pdf.js";
import "./Form3.css";
import { MdOutlineFileDownload } from "react-icons/md";
import { getCountryName } from "../../utils/countryNames";
import { useNavigate } from "react-router";
import { TfiReload } from "react-icons/tfi";

function Form3() {
  const { form1Data, form2Data, resetForm, formState, targetId } = useContext(
    Context,
  ) as ContextValue;
  const { toast } = useToast();
  const documentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    const element = documentRef.current;
    if (!element) return;
    const opt = {
      margin: 10,
      filename: `Incorporation_${form1Data.name}_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait" as const, unit: "mm", format: "a4" },
    };
    html2pdf().set(opt).from(element).save();
  };
  const handleEdit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const reqBody = {
      ...form1Data,
      holders: form2Data,
    };
    console.log(reqBody);
    try {
      const response = await fetch(
        `http://localhost:3000/api/company/${targetId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqBody),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json();
      toast.success(
        "Success!",
        `${res.data.name} has been successfully updated!`,
      );

      setTimeout(() => {
        navigate("/");
        resetForm();
      }, 1200);
    } catch (err) {
      toast.error("Failure", `Error occured while updating your Company`);
      console.log(err);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const reqBody = {
      ...form1Data,
      holders: form2Data,
    };
    console.log(reqBody);
    try {
      const response = await fetch("http://localhost:3000/api/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json();
      toast.success(
        "Success!",
        `${res.data.name} has been successfully! incorporated`,
      );

      setTimeout(() => {
        navigate("/");
        resetForm();
      }, 1200);
    } catch (err) {
      toast.error("Failure", `Error occured while registering your Company`);
      console.log(err);
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="form3-container">
      <div className="pdf-toolbar">
        <button
          onClick={resetForm}
          className="reset-buttons text-3xl mr-2 font-extrabold"
          title="Reset the entire form"
        >
          <TfiReload strokeWidth={0.5} />
        </button>
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="btn-download-pdf flex justify-center items-center gap-3"
        >
          <MdOutlineFileDownload className="inline text-2xl" /> Download PDF
        </button>
      </div>

      <div className="pdf-document" ref={documentRef}>
        <div className="pdf-header">
          <h1 className="document-title">Company Incorporation Form</h1>
          <div className="flex justify-between">
            <p className="document-subtitle">Via. IncorpFirm</p>
            <p className="document-date">Date: {getCurrentDate()}</p>
          </div>
        </div>

        <div className="pdf-content">
          <section className="pdf-section">
            <h2 className="pdf-section-title">1. Company Information: </h2>
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label">Company Name:</td>
                  <td className="value">{form1Data.name}</td>
                </tr>
                <tr>
                  <td className="label">Number of Shareholders:</td>
                  <td className="value">{form1Data.noOfHolders}</td>
                </tr>
                <tr>
                  <td className="label">Initial Capital:</td>
                  <td className="value">
                    $ {JSON.parse(form1Data.capital).toLocaleString("en-US")}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="pdf-section">
            <h2 className="pdf-section-title">2. Shareholder Details:</h2>
            <div className="shareholders-table-wrapper">
              <table className="shareholders-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Nationality</th>
                  </tr>
                </thead>
                <tbody>
                  {form2Data.map((holder, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{holder.firstName}</td>
                      <td>{holder.lastName}</td>
                      <td>{getCountryName(holder.nationality)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="pdf-section pdf-footer-section">
            <p className="declaration">
              I hereby declare that the information provided in this form is
              true, accurate, and complete to the best of my knowledge.
            </p>
            <div className="signature-area">
              <div className="signature-line"></div>
              <p className="signature-label">Authorized Signatory</p>
            </div>
          </section>
        </div>

        <div className="pdf-page-number">Page 1 of 1</div>
      </div>

      <form
        onSubmit={formState === "POST" ? handleSubmit : handleEdit}
        id="form3"
        className="review-actions-form hide"
      ></form>
    </div>
  );
}

export default Form3;
