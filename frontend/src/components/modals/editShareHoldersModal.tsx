import styles from "../../pages/admin-portal/AdminPortal.module.css";
import { MdClose } from "react-icons/md";
import FlagSelect from "../../utils/FlagSelect";

type editFormDataType = {
  firstName: string;
  lastName: string;
  nationality: string;
};

type props = {
  closeEditShareholderModal: () => void;
  editFormData: editFormDataType;
  setEditFormData: React.Dispatch<React.SetStateAction<editFormDataType>>;
  updateShareholder: () => void;
};

export const EditShareHoldersModal = ({
  closeEditShareholderModal,
  editFormData,
  setEditFormData,
  updateShareholder,
}: props) => {
  return (
    <div
      className={styles["modal-overlay"]}
      onClick={closeEditShareholderModal}
    >
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
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
                <label
                  htmlFor="nationality"
                  className="block mb-2 font-semibold"
                >
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
                  style={{ backgroundColor: "var(--color-accent)" }}
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
  );
};
