import React, { useContext, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { TaskColumn } from "./TaskColumn";
import { Col, Row, message } from "antd";
// import { TeamContext } from "../../../../../providers/team";
// import TaskApi from "../../../../../apis/task";
import { TaskColumnId } from "../../../../../../constants/app";
import { TaskStatus } from "../../../../../../constants/enum";
import { UserContext } from "../../../../../../providers/user";
import { TeamContext } from "../../../../../../providers/team";
import AuthApi from "../../../../../../apis/auth";

export const TaskBoard = ({ onViewTask, onDeleteTask, dataSource }) => {

	// const [user, setUser] = useState([]);
	const { user } = useContext(UserContext);
	const { team, reload } = useContext(TeamContext);

	console.log("team");
	console.log(team);
	console.log("reload");
	
	console.log(reload);

	// const isLeader = user?.userId === team?.leader?.id;

	const [columns, setColumns] = useState([
		{
			id: TaskColumnId.TODO,
			title: "Cần làm",
			tasks: [],
		},
		{
			id: TaskColumnId.IN_PROGRESS,
			title: "Đang làm",
			tasks: [],
		},
		{
			id: TaskColumnId.COMPLETED,
			title: "Đã hoàn thành",
			tasks: [],
		},
	]);

	const onDragEnd = (result) => {
		console.log("onDragEnd");
		console.log(result)

		const { destination, source, draggableId } = result;

		if (!destination) {
			return;
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		var canDrop = true;
		const taskId = draggableId;
		const task = dataSource?.tasks.find((e) => e.id === taskId);
		const ownedTask =
			dataSource?.members.find((e) => e.id === user?.userId) !== undefined;

		// if (!isLeader && !ownedTask) {
		// 	canDrop = false;
		// }

		if (!canDrop) {
			message.info(
				"Chỉ trưởng nhóm hoặc những thành viên được phân công mới được chuyển trạng thái công việc này"
			);
			return;
		}

		const finish = columns.find((e) => e.id === destination.droppableId);
		let taskStatus;
		switch (finish.id) {
			case TaskColumnId.TODO:
				taskStatus = TaskStatus.new;
				break;
			case TaskColumnId.IN_PROGRESS:
				taskStatus = TaskStatus.inProgress;
				break;
			case TaskColumnId.COMPLETED:
				taskStatus = TaskStatus.completed;
				break;
			default:
				taskStatus = TaskStatus.new;
				break;
		}

		if (taskId !== undefined && taskStatus !== undefined) {
			//Todo: call api. if success reload column
			AuthApi.login("0123456789", "123456").then((success) => {
				if(success) {
					console.log("success")
					message.success("Đã cập nhật công việc");
					task.status = taskStatus;
					loadColumn(dataSource?.tasks);
					reload(false);
				}
			})
		}
	};

	function loadColumn(tasks) {
		console.log("test reload")
		const todoTasks = tasks?.filter((e) => e.status === TaskStatus.new);

		const inProgressTasks = tasks?.filter(
			(e) => e.status === TaskStatus.inProgress
		);
		const completedTasks = tasks?.filter(
			(e) => e.status === TaskStatus.completed
		);
		const newColumns = [...columns];
		for (let i = 0; i < newColumns.length; i++) {
			const column = newColumns[i];
			if (column.id === TaskColumnId.TODO) {
				column.tasks = todoTasks;
			}
			if (column.id === TaskColumnId.IN_PROGRESS) {
				column.tasks = inProgressTasks;
			}
			if (column.id === TaskColumnId.COMPLETED) {
				column.tasks = completedTasks;
			}
		}
		setColumns(newColumns);
	}

	useEffect(() => {
		const tasks = dataSource?.tasks;
		loadColumn(tasks);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataSource]);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Row gutter={16}>
				{columns.map((column) => (
					<Col key={column.id} span={8}>
						<TaskColumn
							column={column}
							onViewTask={onViewTask}
							onDeleteTask={onDeleteTask}
						/>
					</Col>
				))}
			</Row>
		</DragDropContext>
	);
};
