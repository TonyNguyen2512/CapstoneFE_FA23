import { createContext } from "react";

const TaskContext = createContext({
	tasks: undefined,
	allTasks: undefined,
	leader: undefined,
	order: undefined,
	orderDetails: undefined,
	materials: undefined,
	team: undefined,
	info: undefined,
	acceptance: undefined,
	reload: () => {},
	filterTask: (memberId) => {},
	filterOrderDetail: (value) => {},
});

const TaskProvider = ({
	children,
	tasks,
	allTasks,
	leader,
	order,
	orderDetails,
	materials,
	team,
	info,
	acceptance,
	onReload,
	onFilterTask,
	onFilterDetail,
	onAcceptanceTask,
}) => {
	return (
		<TaskContext.Provider
			value={{
				tasks: tasks,
				allTasks: allTasks,
				leader: leader,
				order: order,
				orderDetails: orderDetails,
				materials: materials,
				reload: onReload,
				filterTask: onFilterTask,
				orderDetail: onFilterDetail,
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
