import { Plus } from "@icon-park/react";
import { Button, Row, Select, Typography, message } from "antd";
import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../../../../../providers/user";
import { TaskBoard } from "./TaskBoard";

const { Title } = Typography;

export const WorkerTaskProcedureManagement = ({
	dataSource
}) => {

	const { user } = useContext(UserContext);
	
	const [filterTask, setFilterTask] = useState([]); 
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [taskCreating, setTaskCreating] = useState(false);
	const [taskUpdating, setTaskUpdating] = useState(false);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	console.log("Manager")
	console.log(dataSource)

	const taskRef = useRef();

	const handleSubmitCreate = async (values) => {
		const projectId = dataSource?.project?.id;
		const request = {
			projectId: projectId,
			taskName: values?.taskName,
			startTime: values?.startTime,
			endTime: values?.endTime,
			taskDescription: values?.taskDescription,
			status: values?.status,
			assignees: values?.assignees,
		};
		setTaskCreating(true);
		// const success = await TaskApi.createTask(request);
		// if (success) {
		// 	message.success("Đã tạo công việc");
		// 	reload(false);
		// } else {
		// 	message.error("Có lỗi xảy ra");
		// }
		setTaskCreating(false);
		setShowCreateModal(false);
	};

	const handleDeleteTask = async () => {
		const currentTask = taskRef.current;
		// const success = await TaskApi.deleteTask(currentTask.id);
		// if (success) {
		// 	message.success("Đã xóa công việc");
		// 	reload(false);
		// } else {
		// 	message.error("Có lỗi xảy ra");
		// }
		setShowDeleteModal(false);
	};

	const handleSubmitUpdate = async (values) => {
		console.log("update task: ", values);
		setTaskUpdating(true);
		// const success = await TaskApi.updateTask(values);
		// if (success) {
		// 	message.success("Đã cập nhật công việc");
		// 	reload(false);
		// } else {
		// 	message.error("Có lỗi xảy ra");
		// }
		setTaskUpdating(false);
		setShowDetailModal(false);
	};

	return (
		<div>
			<Row align="middle" className="mb-3" justify="space-between">
				<Row align="middle">
					<Title level={5} style={{ margin: 0 }}>
						Công việc ({dataSource?.tasks?.length})
					</Title>
					{/* {isLeader && ( */}
						<Button
							icon={<Plus />}
							className="flex-center ml-3"
							shape="circle"
							type="primary"
							onClick={() => setShowCreateModal(true)}
						/>
					{/* )} */}
					<span className="ml-10 mr-2">Thành viên: </span>
					<Select
						allowClear
						placeholder="Chọn thành viên"
						options={dataSource?.members?.map((e) => {
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
					setShowDetailModal(true);
				}}
				onDeleteTask={(task) => {
					taskRef.current = task;
					setShowDeleteModal(true);
				}}
				dataSource={dataSource}
			/>
			{/* <TaskCreateModal
				open={showCreateModal}
				onCancel={() => setShowCreateModal(false)}
				onSubmit={handleSubmitCreate}
				confirmLoading={taskCreating}
			/>
			<TaskDetailModal
				open={showDetailModal}
				onCancel={() => setShowDetailModal(false)}
				task={taskRef.current}
				onSubmit={handleSubmitUpdate}
				confirmLoading={taskUpdating}
			/>
			<ConfirmDeleteModal
				title="Bạn muốn xóa công việc này?"
				open={showDeleteModal}
				onCancel={() => setShowDeleteModal(false)}
				onOk={() => handleDeleteTask()}
			/> */}
		</div>
	);
};
