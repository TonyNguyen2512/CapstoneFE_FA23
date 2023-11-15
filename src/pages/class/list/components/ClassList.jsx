import { Edit, More, PreviewOpen } from "@icon-park/react";
import { Button, Dropdown, Empty, Table, Tag, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import { roles } from "../../../../constants/app";
import { useRole } from "../../../../hooks/role";

const { Text, Title } = Typography;

export const ClassList = ({ classes, onDelete }) => {
	const role = useRole();
	const navigate = useNavigate();

	const getActionItems = (record) => {
		return [
			{
				label: "Xem chi tiết",
				icon: <PreviewOpen />,
				onClick: () => {
					navigate(record?.classId);
				},
			},
			role === roles.ADMIN && {
				label: "Thay đổi giáo viên",
				icon: <Edit />,
				// onClick: () => {
				// 	onUpdate(record);
				// },
			},
		];
	};

	const columns = [
		{
			title: "Tên lớp",
			dataIndex: "className",
			key: "className",
			ellipsis: true,
		},
		{
			title: "Môn học",
			dataIndex: "courseName",
			key: "courseName",
			ellipsis: true,
		},
		{
			title: "Học kỳ",
			dataIndex: "semesterName",
			key: "semesterName",
			ellipsis: true,
		},
	];

	if (role === roles.WORKER || role === roles.ADMIN) {
		columns.push({
			title: "Giáo viên hướng dẫn",
			dataIndex: "teacherName",
			key: "teacherName",
			ellipsis: true,
		});
	}
	if (role === roles.WORKER) {
		columns.push({
			title: "Trạng thái",
			dataIndex: "enrolled",
			key: "enrolled",
			render: (_, { enrolled }) => {
				return (
					<Tag color={enrolled ? "purple-inverse" : "default"}>
						{enrolled ? "Đã tham gia" : "Chưa tham gia"}
					</Tag>
				);
			},
		});
	}

	columns.push({
		title: "Thao tác",
		key: "action",
		render: (_, record) => {
			return (
				<Dropdown menu={{ items: getActionItems(record) }}>
					<Button icon={<More />} className="flex-center" />
				</Dropdown>
			);
		},
	});

	return (
		<>
			{role === roles.FOREMAN && <Title level={5}>Lớp học của tôi</Title>}
			<Table
				dataSource={classes}
				columns={columns}
				pagination={false}
				locale={{
					emptyText: (
						<Empty description={<Text disabled>Chưa có lớp học nào</Text>} />
					),
				}}
			/>
		</>
	);
};
