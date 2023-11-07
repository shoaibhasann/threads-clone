import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth() {
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  return isLoggedIn && isLoggedIn ? (<Outlet/>) : <Navigate to='/login'/>
}

export default RequireAuth