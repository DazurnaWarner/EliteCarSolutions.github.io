import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Team from "../pages/team/page";
import Testing from "../pages/testing/page";
import Admin from "../pages/admin/page";
import Manager from "../pages/manager/page";
import Employee from "../pages/employee/page";
import HRManagerPage from '../pages/hr-manager/page';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/team",
    element: <Team />,
  },
  {
    path: "/testing",
    element: <Testing />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/manager",
    element: <Manager />,
  },
  {
    path: "/employee",
    element: <Employee />,
  },
  {
    path: "/hr-manager",
    element: <HRManagerPage />
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;