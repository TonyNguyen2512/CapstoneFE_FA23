import { createContext } from "react";

const TaskContext = createContext({
	team: undefined,
	reload: () => {},
	filterTask: (memberId) => {},
});

const TaskProvider = ({
	children,
	team,
	onReload,
	onFilterTask,
}) => {
	return (
		<TaskContext.Provider
			value={{
				team: team,
				reload: onReload,
				filterTask: onFilterTask,
			}}
		>
			{children}
		</TaskContext.Provider>
	);
};

export { TaskContext, TaskProvider };
