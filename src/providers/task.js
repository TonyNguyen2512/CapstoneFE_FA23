import { createContext } from "react";

const TaskContext = createContext({
	task: undefined,
	order: undefined,
	material: undefined,
	reload: () => {},
	filterTask: (memberId) => {},
});

const TaskProvider = ({
	children,
	task,
	order,
	material,
	onReload,
	onFilterTask,
}) => {
	return (
		<TaskContext.Provider
			value={{
				task: task,
				order: order,
				material: material,
				reload: onReload,
				filterTask: onFilterTask,
			}}
		>
			{children}
		</TaskContext.Provider>
	);
};

export { TaskContext, TaskProvider };
