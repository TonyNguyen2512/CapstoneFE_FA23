import { createContext } from "react";

const TeamContext = createContext({
	team: undefined,
	reload: () => {},
	filterTask: (memberId) => {},
});

const TeamProvider = ({
	children,
	team,
	onReload,
	onFilterTask,
	taskFilter,
	setTaskFilter,
}) => {
	return (
		<TeamContext.Provider
			value={{
				team: team,
				reload: onReload,
				filterTask: onFilterTask,
			}}
		>
			{children}
		</TeamContext.Provider>
	);
};

export { TeamContext, TeamProvider };
