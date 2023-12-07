import { Add, Info } from "@icon-park/react";
import { Button, Divider, Spin, Typography, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectApi from "../../../apis/project";
import TaskApi from "../../../apis/task";
import { ProgressIndicator } from "../../../components/ProgressIndicator";
import { ETaskStatus } from "../../../constants/enum";
import { BasePageContent } from "../../../layouts/containers/BasePageContent";
import { ProjectProvider } from "../../../providers/project";
import { ProjectDescriptionModal } from "../components/ProjectDescriptionModal";
import { DeleteProjectModal } from "./components/DeleteProjectModal";
import { DeleteTaskModal } from "./components/DeleteTaskModal";
import { TaskListSection } from "./components/TaskListSection";
import { TaskModal } from "./components/TaskModal";
import { useRole } from "../../../hooks/role";
import { roles } from "../../../constants/app";
import { ProjectStudentList } from "./components/ProjectStudentList";

const { Text } = Typography;

const ProjectDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	const role = useRole();

	// Loading states
	const [loading, setLoading] = useState(false);
	const [taskLoading, setTaskLoading] = useState(false);
	const [taskCreating, setTaskCreating] = useState(false);
	const [taskUpdating, setTaskUpdating] = useState(false);

	// Data states
	const [project, setProject] = useState({});
	const [tasks, setTasks] = useState([]);
	const newTasks = tasks.filter((e) => e.status === ETaskStatus.new);
	const inProgressTasks = tasks.filter(
		(e) => e.status === ETaskStatus.inProgress
	);
	const completedTasks = tasks.filter((e) => e.status === ETaskStatus.completed);

	// Modal states
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showDescModal, setShowDescModal] = useState(false);
	const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
	const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
	const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);

	const updatingTask = useRef();
	const deletingTask = useRef();

	const getProject = async () => {
		setLoading(true);
		const data = await ProjectApi.getProjectById(id);
		if (data) {
			setProject(data);
		}
		setLoading(false);
	};
	const getProjectTasks = async () => {
		setTaskLoading(true);
		const data = await TaskApi.getAllTasks(id);
		if (data) {
			setTasks(data);
		}
		setTaskLoading(false);
	};

	useEffect(() => {
		if (!id) return;
		getProject();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const handleTaskItemClick = (task) => {
		updatingTask.current = task;
		setShowUpdateTaskModal(true);
	};
	const handleTaskItemDelete = (task) => {
		deletingTask.current = task;
		setShowDeleteTaskModal(true);
	};

	const handleCreateTask = async (values) => {
		const { taskName, taskDescription, dates } = values;
		setTaskCreating(true);
		const success = await TaskApi.createTask({
			projectId: id,
			taskName: taskName,
			timeStart: dates[0],
			timeEnd: dates[1],
			taskDescription: taskDescription,
		});
		if (success) {
			message.success("Đã thêm công việc mới");
			getProjectTasks();
		} else {
			message.error("Thêm công việc thất bại");
		}
		setTaskCreating(false);
		setShowCreateTaskModal(false);
	};

	const handleUpdateTask = async (values) => {
		const { taskName, taskDescription, taskId, status } = values;
		setTaskUpdating(true);
		const success = await TaskApi.updateTask({
			taskId,
			taskName,
			description: taskDescription,
			status,
		});
		if (success) {
			getProjectTasks();
		} else {
			message.error("Có lỗi xảy ra");
		}
		setTaskUpdating(false);
		setShowUpdateTaskModal(false);
	};

	const handleUnAssignMember = (taskId, memberId) => {
		TaskApi.unAssignTask(taskId, memberId).then((success) => {
			if (success) {
				getProjectTasks();
			}
		});
	};

	useEffect(() => {
		if (!id) return;

		getProject();
		getProjectTasks();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return (
		<>
			<Spin spinning={loading || taskLoading}>
				<ProjectProvider project={project}>
					<BasePageContent
						title={
							<span>
								{project?.projectName}{" "}
								<Button
									size={32}
									type="link"
									icon={<Info />}
									onClick={() => setShowDescModal(true)}
								/>
							</span>
						}
					>
						{role === roles.FOREMAN && (
							<div className="mt-4">
								<ProjectStudentList />
								<Divider />
							</div>
						)}
						<div className="my-4">
							<Text>
								Công việc đã hoàn thành:{" "}
								<strong>
									{completedTasks.length}/{tasks.length}
								</strong>
							</Text>
							<ProgressIndicator
								completed={completedTasks.length}
								total={tasks.length}
							/>
						</div>
						<TaskListSection
							title="Công việc cần làm"
							tasks={newTasks}
							action={
								role === roles.WORKER && (
									<Button
										type="primary"
										icon={<Add />}
										className="flex-center"
										onClick={() => setShowCreateTaskModal(true)}
									>
										Thêm công việc
									</Button>
								)
							}
							onTaskItemClick={handleTaskItemClick}
							onTaskItemDelete={handleTaskItemDelete}
							onAssignMember={() => getProjectTasks()}
							onUnAssignMember={handleUnAssignMember}
						/>
						<Divider />
						<TaskListSection
							title="Công việc đang làm"
							tasks={inProgressTasks}
							onTaskItemClick={handleTaskItemClick}
							onTaskItemDelete={handleTaskItemDelete}
							onAssignMember={() => getProjectTasks()}
							onUnAssignMember={handleUnAssignMember}
						/>
						<Divider />
						<TaskListSection
							title="Công việc đã hoàn thành"
							tasks={completedTasks}
							onTaskItemClick={handleTaskItemClick}
							onTaskItemDelete={handleTaskItemDelete}
							onAssignMember={() => getProjectTasks()}
							onUnAssignMember={handleUnAssignMember}
						/>
					</BasePageContent>
				</ProjectProvider>
			</Spin>
			<DeleteProjectModal
				open={showDeleteModal}
				onCancel={() => setShowDeleteModal(false)}
				projectId={project?.projectId}
				onSuccess={() => navigate(-1)}
			/>
			<ProjectDescriptionModal
				open={showDescModal}
				project={project}
				onCancel={() => setShowDescModal(false)}
			/>
			<TaskModal
				open={showCreateTaskModal}
				onCancel={() => setShowCreateTaskModal(false)}
				title="Thêm công việc"
				onSubmit={handleCreateTask}
				confirmLoading={taskCreating}
			/>
			<TaskModal
				open={showUpdateTaskModal}
				onCancel={() => setShowUpdateTaskModal(false)}
				title="Cập nhật công việc"
				task={updatingTask.current}
				confirmLoading={taskUpdating}
				edit={true}
				onSubmit={handleUpdateTask}
			/>
			<DeleteTaskModal
				task={deletingTask.current}
				open={showDeleteTaskModal}
				onCancel={() => setShowDeleteTaskModal(false)}
				onSuccess={() => {
					getProjectTasks();
				}}
			/>
		</>
	);
};

export default ProjectDetailPage;
