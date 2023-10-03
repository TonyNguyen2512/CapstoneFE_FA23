import { Edit, More, Plus } from "@icon-park/react";
import { Button, Dropdown } from "antd";
import React from "react";
import { BaseTable } from "../../../../components/BaseTable";
import { usePermissions } from "../../../../hooks/permission";
import { ALL_PERMISSIONS } from "../../../../constants/app";

export const CourseList = ({
	courses,
	onDelete,
	onUpdate,
	onAdd,
	onSearch,
}) => {
	const permissions = usePermissions();
	const canCreate = permissions?.includes(ALL_PERMISSIONS.course.create);

	const getActionItems = (record) => {
		return [
			{
				label: "Cập nhật",
				icon: <Edit />,
				onClick: () => {
					onUpdate(record);
				},
			},
		];
	};

	const columns = [
		{
			title: "Mã môn học",
			dataIndex: "courseCode",
			filter: {
				placeholder: "Chọn mã môn",
				label: "Mã môn",
			},
		},
		{
			title: "Tên môn học",
			dataIndex: "courseName",
		},
		{
			title: "Thao tác",
			render: (_, record) => {
				return (
					<Dropdown menu={{ items: getActionItems(record) }}>
						<Button icon={<More />} className="flex-center" />
					</Dropdown>
				);
			},
		},
	];

	return (
		<BaseTable
			title="Danh sách môn học"
			searchOptions={{
				visible: true,
				placeholder: "Tìm môn học theo mã hoặc tên...",
				width: 300,
				onSearch: onSearch,
			}}
			dataSource={courses}
			columns={columns}
			pagination={true}
			actions={[
				canCreate && (
					<Button
						onClick={onAdd}
						type="primary"
						icon={<Plus />}
						className="flex-center"
					>
						Thêm môn học
					</Button>
				),
			]}
		/>
	);
};
