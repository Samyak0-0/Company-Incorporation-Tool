import { useState } from "react";
import styles from "./Login.module.css";

type modes = "login" | "register";
interface adminInfoType {
  username: string;
  password: string;
  passwordConfirm: string;
}

const Login = () => {
  const [mode, setMode] = useState<modes>("login");
  const [adminInfo, setAdminInfo] = useState<adminInfoType>({
    username: "",
    password: "",
    passwordConfirm: "",
  });

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminInfo({
      ...adminInfo,
      [name]: value,
    });
    // console.log(name, value);
    // console.log(adminInfo);
  };

  const handleModeToggle = (mode: modes) => {
    setMode(mode);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`submitted`);
    console.log(adminInfo);
  };

  return (
    <div className={styles.login}>
      <div className={`${styles.modal} `}>
        <p className="text-3xl text-center my-4 font-semibold">
          Login to View the Admin Pannel
        </p>
        <div className={styles["form-box"]}>
          <form onSubmit={handleSubmit} id="auth" className={`${styles.form}`}>
            <div className={`w-full mb-4 `}>
              <button
                className={`px-4 py-2 mr-2 ${styles["toggle-btn"]} ${mode === "login" ? styles.active : ""}`}
                onClick={() => handleModeToggle("login")}
              >
                Login
              </button>
              <button
                className={`px-4 py-2 ${styles["toggle-btn"]} ${mode === "register" ? styles.active : ""}`}
                onClick={() => handleModeToggle("register")}
              >
                Register
              </button>
            </div>
            <label className="w-full" htmlFor="username">
              Username:
            </label>
            <input
              className="text-3xl"
              type="text"
              id="username"
              name="username"
              value={adminInfo.username}
              onChange={handleFormDataChange}
            />
            <label htmlFor="password" className="w-full ">
              Password:
            </label>
            <input
              className="text-3xl"
              type="password"
              id="password"
              name="password"
              minLength={8}
              value={adminInfo.password}
              onChange={handleFormDataChange}
            />
            {mode === "register" && (
              <>
                <label htmlFor="password" className="w-full ">
                  Confirm Password:
                </label>
                <input
                  className="text-3xl"
                  type="password"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  minLength={8}
                  value={adminInfo.passwordConfirm}
                  onChange={handleFormDataChange}
                />
              </>
            )}
            <button
              className={`${styles["submit-btn"]} text-3xl mt-8 mb-4 w-full py-2 cursor-pointer`}
              type="submit"
            >
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
