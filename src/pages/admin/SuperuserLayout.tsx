import { Outlet } from "react-router-dom";

export const SuperuserLayout = () => (
  <div className="flex-1 flex flex-col">
    <Outlet />
  </div>
);
