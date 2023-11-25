import React, { useContext, useEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { TaskColumn } from "./TaskColumn";
import { Col, Row, message } from "antd";
import { TaskColumnId, roles } from "../../../../../../constants/app";
import { TaskStatus } from "../../../../../../constants/enum";
import { UserContext } from "../../../../../../providers/user";
import WorkerTasksApi from "../../../../../../apis/worker-task";
import { TaskContext } from "../../../../../../providers/task";

export const TaskBoard = ({ onViewTask, onDeleteTask }) => {

	const { user } = useContext(UserContext);
	const { tasks, reload } = useContext(TaskContext);

	const isLeader = user?.role?.name === roles.LEADER || user?.role?.name === roles.FOREMAN;

	const [columns, setColumns] = useState([
		{
			id: TaskColumnId.TODO,
			title: "Cần làm",
			tasks: [],
		},
		{
			id: TaskColumnId.IN_PROGRESS,
			title: "Trong tiến độ",
			tasks: [],
		},
		{
			id: TaskColumnId.IN_APPROVE,
			title: "Chờ duyệt",
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
		const task = tasks?.find((e) => e.id === taskId);
		const ownedTask =
			task?.members.find((e) => e.id === user?.id) !== undefined;

		if (!isLeader && !ownedTask) {
			canDrop = false;
		}

		if (!canDrop) {
			message.info(
				"Chỉ trưởng nhóm hoặc những thành viên được phân công mới được chuyển trạng thái công việc này"
			);
			return;
		}

		const finish = columns.find((e) => e.id === destination.droppableId);

		if (!isLeader) {
			if (finish.id === TaskColumnId.IN_APPROVE
				|| finish.id === TaskColumnId.COMPLETED) {
					message.info(
						"Chỉ trưởng nhóm mới được chuyển trạng thái công việc này"
					);
					return;
				}
		}

		// TODO
		// const sourceTask = columns.find((e) => e.id === source.droppableId);
		// if (sourceTask.id === TaskColumnId.COMPLETED) {
		// 	message.error(
		// 		"Không thể chuyển trạng thái công việc đã hoàn thành"
		// 	);
		// 	return;
		// }

		let taskStatus;
		switch (finish.id) {
			case TaskColumnId.TODO:
				taskStatus = TaskStatus.new;
				break;
			case TaskColumnId.IN_PROGRESS:
				taskStatus = TaskStatus.inProgress;
				break;
			case TaskColumnId.IN_APPROVE:
				taskStatus = TaskStatus.pending;
				break;
			case TaskColumnId.COMPLETED:
				taskStatus = TaskStatus.completed;
				break;
			default:
				taskStatus = TaskStatus.new;
				break;
		}

		if (taskId !== undefined && taskStatus !== undefined) {
			console.log("drag drop", taskId, taskStatus)
			WorkerTasksApi.updateWorkerTasksStatus(taskId, taskStatus).then((success) => {
				if (success?.code === 0) {
					console.log("success")
					reload(false);
				} else {
					message?.error(success?.message);
				}
			});
		}
	};

	function loadColumn() {

		const todoTasks = tasks?.filter(
			(e) => e.status === TaskStatus.new
		);
		const inProgressTasks = tasks?.filter(
			(e) => e.status === TaskStatus.inProgress
		);
		const inApproveTasks = tasks?.filter(
			(e) => e.status === TaskStatus.pending
		);
		const completedTasks = tasks?.filter(
			(e) => e.status === TaskStatus.completed
		);
		const newColumns = [...columns];
		for (let i = 0; i < newColumns.length; i++) {
			const column = newColumns[i];
			if (column.id === TaskColumnId.TODO) {
				column.tasks = todoTasks || [];
			}
			if (column.id === TaskColumnId.IN_PROGRESS) {
				column.tasks = inProgressTasks || [];
			}
			if (column.id === TaskColumnId.IN_APPROVE) {
				column.tasks = inApproveTasks || [];
			}
			if (column.id === TaskColumnId.COMPLETED) {
				column.tasks = completedTasks || [];
			}
		}
		setColumns(newColumns);
	}

	useEffect(() => {
		loadColumn();
	}, []);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Row gutter={16}>
				{columns.map((column) => (
					<Col key={column.id} span={6}>
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
