import { Delete, Edit, More, Plus } from "@icon-park/react";
import { Button, Col, Dropdown, Row, message } from "antd";
import React, { useContext, useRef, useState } from "react";
import ProjectApi from "../../../../apis/project";
import GroupApi from "../../../../apis/group";
import { BaseTable } from "../../../../components/BaseTable";
import { ConfirmDeleteModal } from "../../../../components/ConfirmDeleteModal";
import { ALL_PERMISSIONS, roles } from "../../../../constants/app";
import { usePermissions } from "../../../../hooks/permission";
import { useRole } from "../../../../hooks/role";
import { ClassContext } from "../../../../providers/class";
import { UserContext } from "../../../../providers/user";
import { ProjectDetailModal } from "../../../project/components/ProjectDetailModal";
import { ClassDetailArea } from "../../components/ClassDetailArea";
import { TeamRegistrationModal } from "./TeamRegistrationModal";
import { TextTile } from "../../../../components/TextTile";
import { RawHtml } from "../../../../components/RawHtml";

export const ClassProjectList = ({ onViewDescription }) => {
	const role = useRole();
	const { data, reload } = useContext(ClassContext);
	const { user } = useContext(UserContext);
	const permissions = usePermissions();
	const canCreateProject = permissions?.includes(
		ALL_PERMISSIONS.project.create
	);

	const canRegisterTeamRequest = permissions?.includes(
		ALL_PERMISSIONS.team.create
	);
	const [projectCreating, setProjectCreating] = useState(false);
	const [projectDeleting, setProjectDeleting] = useState(false);

	const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
	const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
	const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
	const [teamCreating, setTeamCreating] = useState(false);

	const projectIdRef = useRef();
	const projectRef = useRef();

	const handleCreateProject = async (values) => {
		setProjectCreating(true);
		const { classId } = data;
		const success = await ProjectApi.createProject({ ...values, classId });
		if (success) {
			message.success("Tạo dự án thành công");
			reload(false);
		} else {
			message.error("Tạo dự án thất bại");
		}
		setProjectCreating(false);
	};

	const handleCloseCreateTeamRequestModal = () => {
		setShowCreateTeamModal(false);
		setTeamCreating(false);
	};

	const handleCreateTeam = async (request) => {
		setTeamCreating(true);

		const { projectId, listStudent } = request;
		const data = {
			projectId: projectId,
			users: listStudent.filter((item) => item !== user?.userId),
		};

		const response = await GroupApi.registerProjectTeam(data);
		if (response.code === 0) {
			message.success("Đăng ký nhóm thành công");
			reload(false);
		} else {
			message.error(response.message);
		}
		setTeamCreating(false);
		setShowCreateTeamModal(false);
	};

	const handleDeleteProject = () => {
		const projectId = projectIdRef.current;
		if (!projectId) return;
		setProjectDeleting(true);
		ProjectApi.deleteProject(projectId).then((success) => {
			if (success) {
				message.success("Đã xóa dự án");
				reload(false);
			} else {
				message.error("Xóa dự án thất bại");
			}
		});
		setProjectDeleting(false);
		setShowDeleteProjectModal(false);
	};

	const teacherActionItems = (record) => [
		{
			label: "Cập nhật",
			icon: <Edit />,
			onClick: () => {
				onViewDescription(record);
			},
		},
		{
			label: "Xóa",
			danger: true,
			icon: <Delete />,
			onClick: () => {
				projectIdRef.current = record.id;
				setShowDeleteProjectModal(true);
			},
		},
	];

	const columns = [
		{
			title: "Tên dự án",
			dataIndex: "name",
		},
		{
			title: "Thao tác",
			render: (_, record) => {
				return (
					<Row gutter={8}>
						<Col>
							{canRegisterTeamRequest && (
								<Button
									type="primary"
									onClick={() => {
										projectRef.current = record;
										setShowCreateTeamModal(true);
									}}
								>
									Đăng ký nhóm
								</Button>
							)}
						</Col>
						<Col>
							{role === roles.FOREMAN && (
								<Dropdown menu={{ items: teacherActionItems(record) }}>
									<Button icon={<More />} className="flex-center" />
								</Dropdown>
							)}
						</Col>
					</Row>
				);
			},
		},
	];

	return (
		<ClassDetailArea
			title={`Danh sách dự án (${data?.projects?.length ?? 0})`}
			defaultOpen
			action={
				canCreateProject && (
					<Row>
						<Button
							type="primary"
							icon={<Plus />}
							className="flex-center"
							onClick={(e) => {
								e.stopPropagation();
								setShowCreateProjectModal(true);
							}}
						>
							Thêm dự án
						</Button>
					</Row>
				)
			}
		>
			<BaseTable
				rowKey={(record) => record.id}
				dataSource={data?.projects}
				columns={columns}
				searchOptions={{
					visible: false,
				}}
				pagination={false}
				expandedRowRender={({
					description,
					functionalReq,
					nonfunctionalReq,
				}) => {
					return (
						<div>
							<TextTile label="Mô tả" colon>
								<RawHtml html={description} />
							</TextTile>
							<TextTile
								className="mt-4"
								label="Yêu cầu chức năng (Functional)"
								colon
							>
								{functionalReq}
							</TextTile>
							<TextTile
								className="mt-4"
								label="Yêu cầu phi chức năng (Non-functional)"
								colon
							>
								{nonfunctionalReq}
							</TextTile>
						</div>
					);
				}}
			/>
			<ProjectDetailModal
				title="Thêm dự án"
				open={showCreateProjectModal}
				onCancel={() => setShowCreateProjectModal(false)}
				onSubmit={handleCreateProject}
				submitting={projectCreating}
			/>
			<TeamRegistrationModal
				open={showCreateTeamModal}
				title="Đăng ký nhóm làm dự án"
				onCancel={handleCloseCreateTeamRequestModal}
				confirmLoading={teamCreating}
				students={data?.students}
				onSubmit={handleCreateTeam}
				project={projectRef.current}
				classId={data.classId}
			/>
			<ConfirmDeleteModal
				title="Bạn muốn xóa dự án này?"
				open={showDeleteProjectModal}
				onCancel={() => setShowDeleteProjectModal(false)}
				onOk={handleDeleteProject}
				loading={projectDeleting}
			/>
		</ClassDetailArea>
	);
};
