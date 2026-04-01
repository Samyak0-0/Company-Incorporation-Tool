import { useContext, useState } from "react";
import styles from "./Login.module.css";
import { useToast } from "../../utils/ToastProvider";
import { AuthContext, type AuthContextType } from "../../utils/AuthProvider";
import { Navigate, useNavigate } from "react-router";

type modes = "login" | "register";
interface adminInfoType {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

function Login() {
  const { toast } = useToast();
  const { login, user } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const [mode, setMode] = useState<modes>("login");
  const [adminInfo, setAdminInfo] = useState<adminInfoType>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  if (user) {
    return <Navigate to="/admin" replace />;
  }

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

  function checkUserExists(): boolean {
    return false;
  }

  function validateSubmission(): boolean {
    if (mode === "register") {
      if (adminInfo.password !== adminInfo.passwordConfirm) {
        toast.warning(
          "Invalid form submission!",
          "The confirmed password is not the same as the original password.",
        );
        return false;
      }
      if (checkUserExists()) {
        return false;
      }
    }
    // if (mode === "login") {
    //
    // }

    return true;
  }

  const handleRegister = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: adminInfo.email,
          username: adminInfo.username,
          password: adminInfo.password,
        }),
      });
      if (!res.ok) {
        return toast.error(`Failure`, `User Couldn't be Registered`);
      }
      const data = await res.json();
      login(data.accessToken, data.user);
      navigate("/admin");
      return toast.success(`Successs`, `User Registered Sucessfully`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: adminInfo.email,
          password: adminInfo.password,
        }),
      });
      if (!res.ok) {
        return toast.error(`Error`, `Login Unsuccessfull!`);
      }
      const data = await res.json();
      login(data.accessToken, data.user);
      navigate("/admin");
      return toast.success(`Success`, `Successfully logged in!`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateSubmission()) return;

    if (mode === "register") {
      return await handleRegister();
    }
    return await handleLogin();
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
                type="button"
                className={`px-4 py-2 mr-2 ${styles["toggle-btn"]} ${mode === "login" ? styles.active : ""}`}
                onClick={() => handleModeToggle("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${styles["toggle-btn"]} ${mode === "register" ? styles.active : ""}`}
                onClick={() => handleModeToggle("register")}
              >
                Register
              </button>
            </div>
            <label className="w-full" htmlFor="email">
              Email:
            </label>
            <input
              className="text-3xl"
              type="email"
              id="email"
              name="email"
              value={adminInfo.email}
              onChange={handleFormDataChange}
              required
            />
            {mode === "register" && (
              <>
                <label className="w-full" htmlFor="email">
                  Username:
                </label>
                <input
                  className="text-3xl"
                  type="username"
                  id="username"
                  name="username"
                  value={adminInfo.username}
                  onChange={handleFormDataChange}
                  required
                />
              </>
            )}
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
              required
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
                  required
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
}

export default Login;
