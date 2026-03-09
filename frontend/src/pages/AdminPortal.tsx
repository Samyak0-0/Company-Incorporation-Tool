import styles from "./AdminPortal.module.css"
import { useState, useEffect, useContext, useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import { getCountryName } from "../utils/countryNames";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { Context, type ContextValue } from "../utils/ContextProvider";
import FlagSelect from "../utils/FlagSelect";

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

interface EditingShareHolder {
  id: number;
  first_name: string;
  last_name: string;
  nationality: string;
  company_name: string;
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
  const [companySortColumn, setCompanySortColumn] = useState<string>("created_at");
  const [companySortOrder, setCompanySortOrder] = useState<"asc" | "desc">("desc");
  const [shareholderSortColumn, setShareholderSortColumn] = useState<string>("company_name");
  const [shareholderSortOrder, setShareholderSortOrder] = useState<"asc" | "desc">("asc");
  const [editingShareholder, setEditingShareholder] = useState<EditingShareHolder | null>(null);
  const [editFormData, setEditFormData] = useState({ firstName: "", lastName: "", nationality: "" });
  const navigate = useNavigate();
  const {
    setForm1Data,
    setForm2Data,
    setNoOfHolders,
    setFormStep,
    setFormState,
    setTargetId,
    resetForm,
  } = useContext(Context) as ContextValue;

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

  const fetchCompanyData = useCallback( async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/company?sortBy=${companySortColumn}&sortOrder=${companySortOrder}`,
      );
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
  }, [companySortColumn, companySortOrder])
                                      
  const fetchShareholdersData = useCallback (async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/shareholders?sortBy=${shareholderSortColumn}&sortOrder=${shareholderSortOrder}`,
      );
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
  }, [shareholderSortOrder, shareholderSortColumn])

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

      await fetchCompanyData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while deleting",
      );
    }
  };

  const handleAdd = () => {
    resetForm();
    setFormState("POST");
    navigate("/incorporate");
  };

  const handleCompanyColumnSort = (columnName: string) => {
    if (columnName === "S.N.") return; 

    if (companySortColumn === columnName) {
      setCompanySortOrder(companySortOrder === "asc" ? "desc" : "asc");
    } else {
      setCompanySortColumn(columnName);
      setCompanySortOrder("asc");
    }
  };

  const handleShareholderColumnSort = (columnName: string) => {
    if (columnName === "S.N.") return; 

    if (shareholderSortColumn === columnName) {
      setShareholderSortOrder(shareholderSortOrder === "asc" ? "desc" : "asc");
    } else {
      setShareholderSortColumn(columnName);
      setShareholderSortOrder("asc");
    }
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
        res.shareholders.map((holder: EditingShareHolder) => ({
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

      await fetchShareholdersData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while deleting",
      );
    }
  };

  const openEditShareholderModal = (shareholder: Shareholder) => {
    setEditingShareholder(shareholder as unknown as EditingShareHolder);
    setEditFormData({
      firstName: shareholder.first_name,
      lastName: shareholder.last_name,
      nationality: shareholder.nationality,
    });
  };

  const closeEditShareholderModal = () => {
    setEditingShareholder(null);
    setEditFormData({ firstName: "", lastName: "", nationality: "" });
  };

  const updateShareholder = async () => {
    if (!editingShareholder) return;

    if (!editFormData.firstName || !editFormData.lastName || !editFormData.nationality) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/shareholders/${editingShareholder.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: editFormData.firstName,
            lastName: editFormData.lastName,
            nationality: editFormData.nationality,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update shareholder");
      }

      await fetchShareholdersData();
      closeEditShareholderModal();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating shareholder",
      );
    }
  };

  useEffect(() => {
    if (activeTab === "company") {
      fetchCompanyData();
    } else {
      fetchShareholdersData();
    }
  }, [activeTab, companySortColumn, companySortOrder, shareholderSortColumn, shareholderSortOrder, fetchCompanyData, fetchShareholdersData]);

  return (
    <div className={styles["admin-portal"]}>
      <div className={styles["admin-container"]}>
        <h1 className={styles["admin-title"]}>Admin Dashboard</h1>

        <div className={styles["toggle-container"]}>
          <button
            className={`${styles["toggle-btn"]} ${activeTab === "company" ? styles.active : ""}`}
            onClick={() => setActiveTab("company")}
          >
            Company
          </button>
          <button
            className={`${styles["toggle-btn"]} ${
              activeTab === "shareholders" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("shareholders")}
          >
            Shareholders
          </button>
        </div>

        <div className={styles["content-area"]}>
          {loading && <div className={styles["loading"]}>Loading...</div>}
          {error && <div className={styles["error"]}>Error: {error}</div>}

          {!loading && !error && activeTab === "company" && (
            <div className={styles["data-container"]}>
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
                <div className={styles["table-wrapper"]}>
                  <table className={styles["data-table"]}>
                    <thead>
                      <tr>
                        <th>S.N.</th>
                        {companyData[0] &&
                          Object.keys(companyData[0])
                            .filter(
                              (key) => key !== "id" && key !== "updated_at",
                            )
                            .map((key) => (
                              <th
                                key={key}
                                onClick={() => handleCompanyColumnSort(key)}
                                style={{ cursor: "pointer", userSelect: "none" }}
                                title="Click to sort"
                              >
                                {key}
                                {companySortColumn === key && (
                                  <span style={{float: "right", color:"var(--color-bg)", marginRight: "2px" }}>
                                    {companySortOrder === "asc" ? "▲" : "▼"}
                                  </span>
                                )}
                              </th>
                            ))}
                      </tr>
                    </thead>
                    <tbody>
                      {companyData.map((company, index) => (
                        <tr
                          key={company.id}
                          onClick={() => fetchCompanyDetails(company.id)}
                          className={styles["company-row"]}
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
                                    <span className={`${styles["hover-buttons"]} flex text-lg gap-2 `}>
                                      <FaEdit
                                        onClick={() => {
                                          editCompany(company.id);
                                        }}
                                      />
                                      <button
                                        onClick={() =>
                                          deleteCompany(company.id)
                                        }
                                        className={`${styles["delete-btn"]} hover:text-red-500 cursor-pointer`}
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
                <p className={styles["no-data"]}>No company data available</p>
              )}
            </div>
          )}

          {!loading && !error && activeTab === "shareholders" && (
            <div className={styles["data-container"]}>
              <h2>Shareholders Data</h2>
              {shareholdersData.length > 0 ? (
                <div className={styles["table-wrapper"]}>
                  <table className={styles["data-table"]}>
                    <thead>
                      <tr>
                        <th>S.N.</th>
                        {shareholdersData[0] &&
                          Object.keys(shareholdersData[0])
                            .filter(
                              (key) => key !== "id" && key !== "company_id",
                            )
                            .map((key) => {
                              return (
                                <th
                                  key={key}
                                  onClick={() => handleShareholderColumnSort(key)}
                                  style={{ cursor: "pointer", userSelect: "none" }}
                                  title="Click to sort"
                                >
                                  {key}
                                  {shareholderSortColumn === key && (
                                  <span style={{float: "right", color:"var(--color-bg)", marginRight: "2px" }}>
                                      {shareholderSortOrder === "asc" ? "▲" : "▼"}
                                    </span>
                                  )}
                                </th>
                              );
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
                                      <span className={`${styles["hover-buttons"]} flex text-lg gap-2 `}>
                                        <FaEdit 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openEditShareholderModal(shareholder);
                                          }}
                                          style={{ cursor: "pointer" }}
                                          title="Edit shareholder"
                                        />
                                        <button
                                          onClick={() =>
                                            deleteShareholder(shareholder.id)
                                          }
                                          className={`${styles["delete-btn"]} hover:text-red-500 cursor-pointer`}
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
                <p className={styles["no-data"]}>No shareholders data available</p>
              )}
            </div>
          )}
        </div>

        {selectedCompany && (
          <div
            className={styles["modal-overlay"]}
            onClick={() => setSelectedCompany(null)}
          >
            <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
              <div className={styles["modal-header"]}>
                <h2>Company Details</h2>
                <button
                  className={styles["modal-close-btn"]}
                  onClick={() => setSelectedCompany(null)}
                  title="Close"
                >
                  <MdClose />
                </button>
              </div>

              {modalLoading ? (
                <div className={styles["modal-loading"]}>Loading company details...</div>
              ) : (
                <div className={styles["modal-body"]}>
                  <div className={styles["modal-section"]}>
                    <h3>Company Information</h3>
                    <div className={styles["info-grid"]}>
                      <div className={styles["info-item"]}>
                        <label>Company Name</label>
                        <p>{selectedCompany.name}</p>
                      </div>
                      <div className={styles["info-item"]}>
                        <label>Company ID</label>
                        <p>{selectedCompany.id}</p>
                      </div>
                      <div className={styles["info-item"]}>
                        <label>Number of Shareholders</label>
                        <p>{selectedCompany.no_of_holders}</p>
                      </div>
                      <div className={styles["info-item"]}>
                        <label>Capital</label>
                        <p>${selectedCompany.capital.toLocaleString()}</p>
                      </div>
                      <div className={styles["info-item"]}>
                        <label>Created At</label>
                        <p>
                          {new Date(
                            selectedCompany.created_at,
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className={styles["info-item"]}>
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
                      <div className={styles["modal-section"]}>
                        <h3>Shareholders</h3>
                        <div className={styles["shareholders-table-wrapper"]}>
                          <table className={styles["shareholders-table"]}>
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

        {editingShareholder && (
          <div
            className={styles["modal-overlay"]}
            onClick={closeEditShareholderModal}
          >
            <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
              <div className={styles["modal-header"]}>
                <h2>Edit Shareholder</h2>
                <button
                  className={styles["modal-close-btn"]}
                  onClick={closeEditShareholderModal}
                  title="Close"
                >
                  <MdClose />
                </button>
              </div>

              <div className={styles["modal-body"]}>
                <div className={styles["modal-section"]}>
                  <form className={styles["space-y-4"]}>
                    <div className={styles["form-group"]}>
                      <label htmlFor="firstName" className="block mb-2 font-semibold">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={editFormData.firstName}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className={styles["form-group"]}>
                      <label htmlFor="lastName" className="block mb-2 font-semibold">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={editFormData.lastName}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className={styles["form-group"]}>
                      <label htmlFor="nationality" className="block mb-2 font-semibold">
                        Nationality
                      </label>
                      <FlagSelect
                        value={editFormData.nationality}
                        onChange={(code) =>
                          setEditFormData({
                            ...editFormData,
                            nationality: code,
                          })
                        }
                      />
                    </div>

                    <div className="flex gap-4 justify-end mt-6">
                      <button
                        type="button"
                        onClick={closeEditShareholderModal}
                        className="px-4 py-2 bg-gray-300 text-gray-800 cursor-pointer rounded-md hover:-translate-y-0.5"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={updateShareholder}
                        style={{ backgroundColor: "var(--color-accent)"}}
                        className="px-4 py-2  text-white rounded-md hover:-translate-y-0.5 cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPortal;
