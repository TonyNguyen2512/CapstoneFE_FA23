import { createContext } from "react";

const TaskContext = createContext({
	tasks: undefined,
	order: undefined,
	material: undefined,
	team: undefined,
	info: undefined,
	acceptance: undefined,
	reload: () => {},
	filterTask: (memberId) => {},
	filterMaterial: (value) => {},
});

const TaskProvider = ({
	children,
	tasks,
	order,
	material,
	team,
	info,
	acceptance,
	onReload,
	onFilterTask,
	onFilterMaterial,
	onAcceptanceTask,
}) => {
	return (
		<TaskContext.Provider
			value={{
				tasks: tasks,
				order: order,
				material: material,
				reload: onReload,
				filterTask: onFilterTask,
				filterMaterial: onFilterMaterial,
				acceptanceTask: onAcceptanceTask,
				team: team,
				info: info,
				acceptance: acceptance,
			}}
		>
			{children}
		</TaskContext.Provider>
	);
};

export { TaskContext, TaskProvider };
