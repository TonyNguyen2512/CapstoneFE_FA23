import { Check, Forbid, More } from "@icon-park/react";
import {
	Button,
	Dropdown,
	Empty,
	List,
	Table,
	Tag,
	Typography,
	message,
} from "antd";
import React from "react";
import TeamApi from "../../../../apis/group";
import { roles } from "../../../../constants/app";
import { TeamRequestStatus } from "../../../../constants/enum";
import { useRole } from "../../../../hooks/role";

const { Text } = Typography;

export const TeamRequestList = ({ teamRequests, onClickItem, reload }) => {
	const role = useRole();

	const handleApprove = async (teamId) => {
		const success = await TeamApi.AcceptTeamRequest(teamId);
		if (success) {
			message.success("Đã duyệt yêu cầu đăng ký nhóm");
			reload();
		} else {
			message.error("Sinh viên này đã có nhóm, vui lòng từ chối yêu cầu");
		}
	};

	const handleDeny = async (teamId) => {
		const success = await TeamApi.DenyTeamRequest(teamId);
		if (success) {
			message.success("Đã từ chối yêu cầu đăng ký nhóm");
			reload();
		} else {
			message.error("Có lỗi xảy ra");
		}
	};

	const handleCancel = async (teamId) => {
		const success = await TeamApi.cancelTeamRequest(teamId);
		if (success) {
			message.success("Đã hủy yêu cầu đăng ký nhóm");
			reload();
		} else {
			message.error("Có lỗi xảy ra");
		}
	};

	const getActionItems = (record) => {
		if (role === roles.FOREMAN) {
			return [
				{
					label: "Duyệt yêu cầu",
					icon: <Check />,
					onClick: () => handleApprove(record?.teamId),
				},
				{
					label: "Từ chối yêu cầu",
					icon: <Forbid />,
					danger: true,
					onClick: () => handleDeny(record?.teamId),
				},
			];
		}

		if (
			role === roles.WORKER &&
			record?.status === TeamRequestStatus.pending
		) {
			return [
				{
					label: "Hủy yêu cầu",
					icon: <Forbid />,
					danger: true,
					onClick: () => handleCancel(record?.teamId),
				},
			];
		}

		return [];
	};

	const columns = [
		{
			title: "Dự án",
			dataIndex: "projectName",
			key: "projectName",
		},
		{
			title: "Tạo bởi",
			key: "members",
			render: (_, { users, createdBy }) => {
				const creator = users?.find((e) => e.userId === createdBy);
				return (
					<Text>
						{creator.mssv} - {creator.fullName}
					</Text>
				);
			},
		},
		{
			title: "Trạng thái",
			key: "status",
			render: (_, { status }) => {
				return (
					<Tag
						color={
							status === TeamRequestStatus.approved
								? "green"
								: status === TeamRequestStatus.denied
								? "red"
								: "blue"
						}
					>
						{status === TeamRequestStatus.approved
							? "Đã duyệt"
							: status === TeamRequestStatus.denied
							? "Từ chối"
							: "Chờ duyệt"}
					</Tag>
				);
			},
		},
		{
			title: "Thao tác",
			key: "action",
			render: (_, record) => {
				return (
					<>
						{record?.status === TeamRequestStatus.pending && (
							<Dropdown menu={{ items: getActionItems(record) }}>
								<Button icon={<More />} className="flex-center" />
							</Dropdown>
						)}
					</>
				);
			},
		},
	];

	const expandedRowRender = ({ users }) => {
		return (
			<div>
				<Text strong style={{ fontSize: 16 }}>
					Thành viên tham gia:
				</Text>
				<List
					rowKey={(r) => r.userId}
					split={false}
					dataSource={users}
					renderItem={(item) => {
						return (
							<List.Item>
								<Text>
									{item.mssv} - {item.fullName}
								</Text>
							</List.Item>
						);
					}}
				/>
			</div>
		);
	};

	return (
		<div>
			<Table
				rowKey={(r) => r.teamId}
				pagination={false}
				columns={columns}
				dataSource={teamRequests}
				expandable={{
					expandedRowRender: expandedRowRender,
				}}
				locale={{
					emptyText: (
						<Empty
							description={<Text disabled>Chưa có yêu cầu đăng nhóm</Text>}
						/>
					),
				}}
			/>
		</div>
	);
};
