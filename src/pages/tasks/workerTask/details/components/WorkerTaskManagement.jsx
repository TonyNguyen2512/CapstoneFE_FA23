import { Plus } from "@icon-park/react";
import { Button, Row, Select, Typography, message } from "antd";
import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../../../../../providers/user";
import { TaskBoard } from "./TaskBoard";
import { TaskCreateModal } from "../../../../../components/modals/task/create";
import WorkerTasksApi from "../../../../../apis/worker-task";
import { roles } from "../../../../../constants/app";
import { TaskContext } from "../../../../../providers/task";
import TaskDetailModal from "../../../../../components/modals/task/detail";
import { ConfirmDeleteModal } from "../../../../../components/ConfirmDeleteModal";
import { eTaskStatus } from "../../../../../constants/enum";

const { Title } = Typography;

export const WorkerTaskManagement = ({
}) => {

	const { user } = useContext(UserContext);
	const { filterTask, reload, tasks, info, team } = useContext(TaskContext);

	const isLeader = user?.role?.name === roles.LEADER || user?.role?.name === roles.FOREMAN;
	const isInProgress = info.status === eTaskStatus.InProgress;
	
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [taskCreating, setTaskCreating] = useState(false);
	const [taskUpdating, setTaskUpdating] = useState(false);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const taskRef = useRef();

	const handleSubmitCreate = async (values) => {
		const request = {
			leaderTaskId: info?.id,
			name: values?.taskName,
			priority: values?.priority,
			startTime: values?.startTime,
			endTime: values?.endTime,
			status: values?.status,
			description: values?.taskDescription,
			assignees: values?.assignees,
		};
		setTaskCreating(true);
		const resp = await WorkerTasksApi.createWorkerTask(request);
		if (resp?.code === 0) {
			message.success(resp?.message);
			setShowCreateModal(false);
			reload(false);
		} else {
			message.error(resp?.message);
		}
		setTaskCreating(false);
	};

	const handleDeleteTask = async () => {
		const currentTask = taskRef.current;
		const resp = await WorkerTasksApi.deleteWorkerTask(currentTask.id);
		if (resp?.code === 0) {
			message.success(resp?.message);
			reload(false);
		} else {
			message.error(resp?.message);
		}
		setShowDeleteModal(false);
	};

	const handleSubmitUpdate = async (values) => {
		setTaskUpdating(true);
		let resp = null;
		if (values.status !== eTaskStatus.Pending) {
			console.log("update task: ", values);
			resp = await WorkerTasksApi.updateWorkerTask(values);
		} else {
			console.log("send feedback task: ", values);
			resp = await WorkerTasksApi.sendFeedback(values);
		}
		if (resp?.code === 0) {
			message.success(resp?.message);
			reload(false);
			setShowDetailModal(false);
		} else {
			message.error(resp?.message);
		}
		setTaskUpdating(false);
	};

	return (
		<div>
			<Row align="middle" className="mb-3" justify="space-between">
				<Row align="middle">
					<Title level={5} style={{ margin: 0 }}>
						Công việc ({tasks?.length || 0})
					</Title>
					{isLeader && isInProgress && (
						<Button
							icon={<Plus />}
							className="flex-center ml-3"
							shape="circle"
							type="primary"
							onClick={() => setShowCreateModal(true)}
						/>
					)}
					<span className="ml-10 mr-2">Thành viên: </span>
					<Select
						allowClear
						placeholder="Chọn thành viên"
						options={team?.map((e) => {
							return {
								label: `${e.fullName}${e.id === user?.id ? " (Tôi)" : ""}`,
								value: e.id,
							};
						})}
						onChange={(value) => {
							filterTask && filterTask(value);
						}}
						style={{ width: 250 }}
					/>
				</Row>
			</Row>
			<TaskBoard
				onViewTask={(task) => {
					taskRef.current = task;
					console.log("taskRef.current ", taskRef.current )
					setShowDetailModal(true);
				}}
				onDeleteTask={(task) => {
					taskRef.current = task;
					setShowDeleteModal(true);
				}}
			/>
			<TaskCreateModal
				open={showCreateModal}
				onCancel={() => setShowCreateModal(false)}
				onSubmit={handleSubmitCreate}
				confirmLoading={taskCreating}
			/>
			<TaskDetailModal
				open={showDetailModal}
				onCancel={() => setShowDetailModal(false)}
				onSubmit={handleSubmitUpdate}
				confirmLoading={taskUpdating}
				task={taskRef.current}
			/>
			<ConfirmDeleteModal
				title={`Bạn muốn xóa công việc ${taskRef?.current?.name} ?`}
				open={showDeleteModal}
				onCancel={() => setShowDeleteModal(false)}
				onOk={() => handleDeleteTask()}
			/>
		</div>
	);
};
