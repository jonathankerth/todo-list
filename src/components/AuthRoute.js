import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ user, children, redirectTo }) =>
	user ? children : <Navigate to={redirectTo} />;

export default AuthRoute;
