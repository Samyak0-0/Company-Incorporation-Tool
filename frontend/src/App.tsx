import { createBrowserRouter } from "react-router";
import Homepage from "./pages/homepage/Homepage.tsx";
import Incorporate from "./pages/incorporate/Incorporate.tsx";
import Login from "./pages/login/Login.tsx";
import AdminPortal from "./pages/admin-portal/AdminPortal.tsx";
import { RouterProvider } from "react-router";
import NotFound from "./pages/not-found/NotFound.tsx";
import Navbar from "./components/navbar/Navbar.tsx";
import { Outlet } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <Homepage /> },
      { path: "incorporate", element: <Incorporate /> },
      { path: "auth", element: <Login /> },
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
