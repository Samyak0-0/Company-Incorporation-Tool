import type { DetailedCompany } from "../../pages/admin-portal/AdminPortal";
import styles from "../../pages/admin-portal/AdminPortal.module.css";
import { MdClose } from "react-icons/md";
import { getCountryName } from "../../utils/countryNames";

type props = {
  setSelectedCompany: React.Dispatch<
    React.SetStateAction<DetailedCompany | null>
  >;
  modalLoading: boolean;
  selectedCompany: DetailedCompany | null;
};

const SelectedCompanyModal = ({
  setSelectedCompany,
  modalLoading,
  selectedCompany,
}: props) => {
  return (
    <div
      className={styles["modal-overlay"]}
      onClick={() => setSelectedCompany(null)}
    >
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
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
          <div className={styles["modal-loading"]}>
            Loading company details...
          </div>
        ) : (
          <div className={styles["modal-body"]}>
            {selectedCompany && (
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
                      {new Date(selectedCompany.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className={styles["info-item"]}>
                    <label>Updated At</label>
                    <p>
                      {new Date(selectedCompany.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedCompany &&
              selectedCompany.shareholders &&
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
                              <td>{getCountryName(shareholder.nationality)}</td>
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
  );
};

export default SelectedCompanyModal;
