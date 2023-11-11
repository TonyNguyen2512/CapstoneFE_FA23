import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import routes, { UnauthorizedRoutes } from "../constants/routes";

const RootRoute = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const isAuthenticated = useAuth();

	useEffect(() => {
		const path = pathname;
		// navigate(routes.dashboard.root);

		if (UnauthorizedRoutes.includes(path)) {
			if (isAuthenticated) {
				navigate(routes.dashboard.root);
			}
		} else {
			if (!isAuthenticated) {
				navigate(routes.login);
			} else {
				if (path === routes.root) {
					navigate(routes.dashboard.root);
				} else {
					navigate(path);
				}
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname, isAuthenticated]);

	return <Outlet />;
};

export default RootRoute;
