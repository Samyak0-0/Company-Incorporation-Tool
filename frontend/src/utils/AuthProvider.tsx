import {
  createContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";

interface User {
  id: number;
  email: string;
  username: string;
}
export interface AuthContextType {
  authToken: string | null;
  user: User | null;
  setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (arg0: string, arg1: User) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = (authToken: string, user: User) => {
    setAuthToken(authToken);
    setUser(user);
  };

  const logOut = () => {
    setAuthToken(null);
    setUser(null);
  };

  useEffect(() => {
    const refreshAuthTokenOnReload = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/auth/refresh-token`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();

        if (data.accessToken && data.user) {
          login(data.accessToken, data.user);
        }
      } catch (err) {
        console.error("Failed to refresh token on reload:", err);
      }
    };

    refreshAuthTokenOnReload();
  }, []);

  return (
    <AuthContext.Provider
      value={{ authToken, user, setAuthToken, setUser, login, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider, AuthContext };
