import { createContext } from "react";

const TaskContext = createContext({
	tasks: undefined,
	order: undefined,
	material: undefined,
	team: undefined,
	info: undefined,
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
	onReload,
	onFilterTask,
	onFilterMaterial,
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
				team: team,
				info: info,
			}}
		>
			{children}
		</TaskContext.Provider>
	);
};

export { TaskContext, TaskProvider };
