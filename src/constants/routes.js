const routes = {
	root: "/",
	login: "/login",
	register: "/register",
	dashboard: {
		root: "/dashboard",
		courses: "courses",
		classes: "classes",
		accounts: "accounts",
		projects: "projects",
		teams: "teams",
		profile: "profile",
		teamRequest: "team-requests",
		report: "team-report",
		semester: "semester",
		studentReport: "student-report",
		statistics: "statistics",
	},
};

export const UnauthorizedRoutes = [routes.login, routes.register];

export default routes;
