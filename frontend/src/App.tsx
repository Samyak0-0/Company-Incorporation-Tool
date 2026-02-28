import "./App.css";
import { createBrowserRouter } from "react-router";
import Homepage from "./pages/Homepage.tsx";
import Incorporate from "./pages/Incorporate.tsx";
import Login from "./pages/Login.tsx";
import AdminPortal from "./pages/AdminPortal.tsx";
import { RouterProvider } from "react-router";
import NotFound from "./pages/NotFound.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import { Outlet } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Outlet />
        <Footer />
      </>
    ),
    children: [
      { index: true, element: <Homepage /> },
      { path: "incorporate", element: <Incorporate /> },
      { path: "login", element: <Login /> },
      { path: "admin", element: <AdminPortal /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
