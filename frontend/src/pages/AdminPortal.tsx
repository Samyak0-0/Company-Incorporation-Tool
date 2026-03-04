import "./AdminPortal.css";
import { useState, useEffect, useContext } from "react";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import { getCountryName } from "../utils/countryNames";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { Context } from "../utils/ContextProvider";

interface Company {
  id: number;
  name: string;
  no_of_holders: number;
  capital: number;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

interface Shareholder {
  id: number;
  first_name: string;
  last_name: string;
  nationality: string;
  company_id: number;
  company_name: string;
  [key: string]: unknown;
}

interface DetailedCompany extends Company {
  shareholders: Shareholder[];
}

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState<"company" | "shareholders">(
    "company",
  );
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [shareholdersData, setShareholdersData] = useState<Shareholder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] =
    useState<DetailedCompany | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();
  const {
    setForm1Data,
    setForm2Data,
    setNoOfHolders,
    setFormStep,
    setFormState,
    setTargetId,
    resetForm,
  } = useContext(Context);

  // Fetch detailed company data
  const fetchCompanyDetails = async (companyId: number) => {
    setModalLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/company/${companyId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch company details");
      const result = await response.json();
      if (result.success && result.data) {
        setSelectedCompany(result.data);
      }
    } catch (err) {
      console.error("Error fetching company details:", err);
    } finally {
      setModalLoading(false);
    }
  };

  // Fetch company data
  const fetchCompanyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/company");
      if (!response.ok) throw new Error("Failed to fetch company data");
      const result = await response.json();
      const companies = result.success && result.data ? result.data : [];
      setCompanyData(companies);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching company data",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch shareholders data
  const fetchShareholdersData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/shareholders");
      if (!response.ok) throw new Error("Failed to fetch shareholders data");
      const result = await response.json();
      const shareholders = result.success && result.data ? result.data : [];
      setShareholdersData(shareholders);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching shareholders data",
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete company
  const deleteCompany = async (companyId: number) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/company/${companyId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete company");
      }

      // Refresh company data after deletion
      await fetchCompanyData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while deleting",
      );
    }
  };

  const handleAdd = async (companyId: number) => {
    resetForm();
    setFormState("POST");
    navigate("/incorporate");
  };

  const editCompany = async (companyId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/company/${companyId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to edit company");
      }
      const data = await response.json();
      const res = data.data;
      console.log(res);

      setNoOfHolders(JSON.parse(res.no_of_holders));
      setFormStep(1);
      setTargetId(res.id);
      setForm1Data({
        name: res.name,
        capital: res.capital,
        noOfHolders: res.no_of_holders,
      });
      setForm2Data(
        res.shareholders.map((holder) => ({
          firstName: holder.first_name,
          lastName: holder.last_name,
          nationality: holder.nationality,
        })),
      );
      setFormState("PUT");
      navigate("/incorporate");

      // await fetchCompanyData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while editing company",
      );
    }
  };

  // Delete shareholder
  const deleteShareholder = async (shareholderId: number) => {
    if (!window.confirm("Are you sure you want to delete this shareholder?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/shareholders/${shareholderId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete shareholder");
      }

      // Refresh shareholders data after deletion
      await fetchShareholdersData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while deleting",
      );
    }
  };

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "company") {
      fetchCompanyData();
    } else {
      fetchShareholdersData();
    }
  }, [activeTab]);

  return (
    <div className="admin-portal">
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="toggle-container">
          <button
            className={`toggle-btn ${activeTab === "company" ? "active" : ""}`}
            onClick={() => setActiveTab("company")}
          >
            Company
          </button>
          <button
            className={`toggle-btn ${
              activeTab === "shareholders" ? "active" : ""
            }`}
            onClick={() => setActiveTab("shareholders")}
          >
            Shareholders
          </button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error">Error: {error}</div>}

          {!loading && !error && activeTab === "company" && (
            <div className="data-container">
              <div className="flex justify-between mb-2 items-baseline">
                <h2>Company Data</h2>
                <Link to={"/incorporate"}>
                  <button
                    className="flex justify-center items-center gap-4 px-4 py-2 rounded-[5px] cursor-pointer"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "var(--color-bg)",
                    }}
                    onClick={handleAdd}
                  >
                    <FaPlus /> Company
                  </button>
                </Link>
              </div>
              {companyData.length > 0 ? (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>S.N.</th>
                        {companyData[0] &&
                          Object.keys(companyData[0])
                            .filter(
                              (key) => key !== "id" && key !== "updated_at",
                            )
                            .map((key) => <th key={key}>{key}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {companyData.map((company, index) => (
                        <tr
                          key={company.id}
                          onClick={() => fetchCompanyDetails(company.id)}
                          className="company-row"
                        >
                          <td>{index + 1}</td>
                          {Object.entries(company)
                            .filter(
                              ([key]) => key !== "id" && key !== "updated_at",
                            )
                            .map(([key, value]) => (
                              <td key={key}>
                                {key === "created_at" ? (
                                  <span className="flex justify-between">
                                    {new Date(String(value))
                                      .toISOString()
                                      .slice(0, 10)
                                      .replace(/-/g, "/")}
                                    <span className="hover-buttons flex text-lg gap-2 ">
                                      <FaEdit
                                        onClick={() => {
                                          editCompany(company.id);
                                        }}
                                      />
                                      <button
                                        onClick={() =>
                                          deleteCompany(company.id)
                                        }
                                        className="delete-btn hover:text-red-500 cursor-pointer"
                                        title="Delete company"
                                      >
                                        <RiDeleteBin6Line />
                                      </button>
                                    </span>
                                  </span>
                                ) : (
                                  String(value)
                                )}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">No company data available</p>
              )}
            </div>
          )}

          {!loading && !error && activeTab === "shareholders" && (
            <div className="data-container">
              <h2>Shareholders Data</h2>
              {shareholdersData.length > 0 ? (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>S.N.</th>
                        {shareholdersData[0] &&
                          Object.keys(shareholdersData[0])
                            .filter(
                              (key) => key !== "id" && key !== "company_id",
                            )
                            .map((key) => {
                              return <th key={key}>{key}</th>;
                            })}
                      </tr>
                    </thead>
                    <tbody>
                      {shareholdersData.map((shareholder, index) => (
                        <tr key={shareholder.id}>
                          <td>{index + 1}</td>
                          {Object.entries(shareholder)
                            .filter(
                              ([key]) => key !== "id" && key !== "company_id",
                            )
                            .map(([key, value]) => {
                              return (
                                <td key={key}>
                                  {key === "company_name" ? (
                                    <span className="flex justify-between">
                                      {String(value)}
                                      <span className="hover-buttons flex text-lg gap-2 ">
                                        {/* <FaEdit /> */}
                                        <button
                                          onClick={() =>
                                            deleteShareholder(shareholder.id)
                                          }
                                          className="delete-btn hover:text-red-500 cursor-pointer"
                                          title="Delete shareholder"
                                        >
                                          <RiDeleteBin6Line />
                                        </button>
                                      </span>
                                    </span>
                                  ) : key === "nationality" ? (
                                    getCountryName(String(value))
                                  ) : (
                                    String(value)
                                  )}
                                </td>
                              );
                            })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">No shareholders data available</p>
              )}
            </div>
          )}
        </div>

        {/* Company Details Modal */}
        {selectedCompany && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedCompany(null)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Company Details</h2>
                <button
                  className="modal-close-btn"
                  onClick={() => setSelectedCompany(null)}
                  title="Close"
                >
                  <MdClose />
                </button>
              </div>

              {modalLoading ? (
                <div className="modal-loading">Loading company details...</div>
              ) : (
                <div className="modal-body">
                  <div className="modal-section">
                    <h3>Company Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Company Name</label>
                        <p>{selectedCompany.name}</p>
                      </div>
                      <div className="info-item">
                        <label>Company ID</label>
                        <p>{selectedCompany.id}</p>
                      </div>
                      <div className="info-item">
                        <label>Number of Shareholders</label>
                        <p>{selectedCompany.no_of_holders}</p>
                      </div>
                      <div className="info-item">
                        <label>Capital</label>
                        <p>${selectedCompany.capital.toLocaleString()}</p>
                      </div>
                      <div className="info-item">
                        <label>Created At</label>
                        <p>
                          {new Date(
                            selectedCompany.created_at,
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="info-item">
                        <label>Updated At</label>
                        <p>
                          {new Date(
                            selectedCompany.updated_at,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedCompany.shareholders &&
                    selectedCompany.shareholders.length > 0 && (
                      <div className="modal-section">
                        <h3>Shareholders</h3>
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
                              {selectedCompany.shareholders.map(
                                (shareholder, index) => (
                                  <tr key={shareholder.id}>
                                    <td>{index + 1}</td>
                                    <td>{shareholder.first_name}</td>
                                    <td>{shareholder.last_name}</td>
                                    <td>
                                      {getCountryName(shareholder.nationality)}
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
