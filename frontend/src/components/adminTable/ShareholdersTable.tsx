import styles from "../../pages/admin-portal/AdminPortal.module.css";
import { FaEdit } from "react-icons/fa";
import { getCountryName } from "../../utils/countryNames";
import type { Shareholder } from "../../pages/admin-portal/AdminPortal";
import { RiDeleteBin6Line } from "react-icons/ri";

type props = {
  shareholdersData: Shareholder[];
  shareholderSortOrder: "asc" | "desc";
  pageNumber: number;
  handleShareholderColumnSort: (columnName: string) => void;
  openEditShareholderModal: (shareholder: Shareholder) => void;
  deleteShareholder: (shareholderId: number) => void;
  shareholderSortColumn: string;
};

const ShareholdersTable = ({
  shareholdersData,
  handleShareholderColumnSort,
  shareholderSortOrder,
  pageNumber,
  openEditShareholderModal,
  deleteShareholder,
  shareholderSortColumn,
}: props) => {
  return (
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
                    .filter((key) => key !== "id" && key !== "company_id")
                    .map((key) => {
                      return (
                        <th
                          key={key}
                          onClick={() => handleShareholderColumnSort(key)}
                          style={{
                            cursor: "pointer",
                            userSelect: "none",
                          }}
                          title="Click to sort"
                        >
                          {key}
                          {shareholderSortColumn === key && (
                            <span
                              style={{
                                float: "right",
                                color: "var(--color-bg)",
                                marginRight: "2px",
                              }}
                            >
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
                  <td>{index + 1 + (pageNumber - 1) * 5}</td>
                  {Object.entries(shareholder)
                    .filter(([key]) => key !== "id" && key !== "company_id")
                    .map(([key, value]) => {
                      return (
                        <td key={key}>
                          {key === "company_name" ? (
                            <span className="flex justify-between">
                              {String(value)}
                              <span
                                className={`${styles["hover-buttons"]} flex text-lg gap-2 `}
                              >
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
  );
};

export default ShareholdersTable;
