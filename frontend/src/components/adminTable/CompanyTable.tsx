import styles from "../../pages/admin-portal/AdminPortal.module.css";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router";
import type { Company } from "../../pages/admin-portal/AdminPortal";

type props = {
  handleAdd: () => void;
  handleAddDummyData: () => void;
  companyData: Company[];
  handleCompanyColumnSort: (columnName: string) => void;
  companySortColumn: string;
  companySortOrder: "asc" | "desc";
  fetchCompanyDetails: (companyId: number) => void;
  pageNumber: number;
  editCompany: (companyId: number) => void;
  deleteCompany: (companyId: number) => void;
};

const CompanyTable = ({
  handleAdd,
  handleAddDummyData,
  companyData,
  handleCompanyColumnSort,
  companySortColumn,
  companySortOrder,
  fetchCompanyDetails,
  pageNumber,
  editCompany,
  deleteCompany,
}: props) => {
  return (
    <div className={styles["data-container"]}>
      <div className="flex justify-between mb-2 items-baseline">
        <h2>Company Data</h2>
        <div className="flex gap-4 ">
          <button
            className="flex justify-center items-center gap-4 px-4 py-2 rounded-[5px] cursor-pointer"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-bg)",
            }}
            onClick={handleAddDummyData}
          >
            <FaPlus /> Dummy Data
          </button>
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
      </div>
      {companyData.length > 0 ? (
        <div className={styles["table-wrapper"]}>
          <table className={styles["data-table"]}>
            <thead>
              <tr>
                <th>S.N.</th>
                {companyData[0] &&
                  Object.keys(companyData[0])
                    .filter((key) => key !== "id" && key !== "updated_at")
                    .map((key) => (
                      <th
                        key={key}
                        onClick={() => handleCompanyColumnSort(key)}
                        style={{
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                        title="Click to sort"
                      >
                        {key}
                        {companySortColumn === key && (
                          <span
                            style={{
                              float: "right",
                              color: "var(--color-bg)",
                              marginRight: "2px",
                            }}
                          >
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
                  <td>{index + 1 + (pageNumber - 1) * 5}</td>
                  {Object.entries(company)
                    .filter(([key]) => key !== "id" && key !== "updated_at")
                    .map(([key, value]) => (
                      <td key={key}>
                        {key === "created_at" ? (
                          <span className="flex justify-between">
                            {new Date(String(value))
                              .toISOString()
                              .slice(0, 10)
                              .replace(/-/g, "/")}
                            <span
                              className={`${styles["hover-buttons"]} flex text-lg gap-2 `}
                            >
                              <FaEdit
                                onClick={() => {
                                  editCompany(company.id);
                                }}
                              />
                              <button
                                onClick={() => deleteCompany(company.id)}
                                className={`${styles["delete-btn"]} hover:text-red-500 cursor-pointer`}
                                title="Delete company"
                              >
                                <RiDeleteBin6Line />
                              </button>
                            </span>
                          </span>
                        ) : key === "capital" ? (
                          "$ " + (value as number).toLocaleString()
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
  );
};

export default CompanyTable;
