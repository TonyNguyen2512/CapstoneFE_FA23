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
import ReportApi from "../../../../../apis/task-report";

const { Title } = Typography;

export const WorkerTaskManagement = ({
	dataLeaderTasks,
	dataWorkerTasks,
	dataGroupMembers,
}) => {

	const { user } = useContext(UserContext);
	const { filterTask, reload } = useContext(TaskContext);

	const isLeader = user?.role?.name === roles.LEADER || user?.role?.name === roles.FOREMAN;
	
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [taskCreating, setTaskCreating] = useState(false);
	const [taskUpdating, setTaskUpdating] = useState(false);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const taskRef = useRef();

	const handleSubmitCreate = async (values) => {
		const request = {
			leaderTaskId: dataLeaderTasks?.id,
			// stepId: '',
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
		if (resp.code === 0) {
			message.success(resp.message);
			setShowCreateModal(false);
			reload(false);
		} else {
			message.error(resp.message);
		}
		setTaskCreating(false);
	};

	const handleDeleteTask = async () => {
		const currentTask = taskRef.current;
		const resp = await WorkerTasksApi.deleteWorkerTask(currentTask.id);
		if (resp.code === 0) {
			message.success(resp.message);
			reload(false);
		} else {
			message.error(resp.message);
		}
		setShowDeleteModal(false);
	};

	const handleSubmitUpdate = async (values) => {
		console.log("update task: ", values);
		setTaskUpdating(true);
		let resp = null;
		if (values.status) {
			resp = await WorkerTasksApi.updateWorkerTask(values);
		} else {
			resp = await ReportApi.sendAcceptanceReport(values);
		}
		if (resp.code === 0) {
			message.success(resp.message);
			reload(false);
		} else {
			message.error(resp.message);
		}
		setTaskUpdating(false);
		setShowDetailModal(false);
	};

	return (
		<div>
			<Row align="middle" className="mb-3" justify="space-between">
				<Row align="middle">
					<Title level={5} style={{ margin: 0 }}>
						Công việc ({dataWorkerTasks?.length || 0})
					</Title>
					{isLeader && (
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
						options={dataGroupMembers?.map((e) => {
							return {
								label: `${e.fullName}${e.id === user?.userId ? " (Tôi)" : ""}`,
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
				dataSource={dataWorkerTasks}
			/>
			<TaskCreateModal
				open={showCreateModal}
				onCancel={() => setShowCreateModal(false)}
				onSubmit={handleSubmitCreate}
				confirmLoading={taskCreating}
				dataGroupMembers={dataGroupMembers}
			/>
			<TaskDetailModal
				open={showDetailModal}
				onCancel={() => setShowDetailModal(false)}
				onSubmit={handleSubmitUpdate}
				confirmLoading={taskUpdating}
				task={taskRef.current}
				dataGroupMembers={dataGroupMembers}
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
