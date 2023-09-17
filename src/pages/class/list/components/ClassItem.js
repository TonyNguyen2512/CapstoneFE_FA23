import { Button, Card, Descriptions, Tag, Typography } from "antd";
import React from "react";
import { formatDate } from "../../../../utils";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../../../hooks/role";
import { ALL_PERMISSIONS, roles } from "../../../../constants/app";
import { usePermissions } from "../../../../hooks/permission";
import { Delete } from "@icon-park/react";

const { Text } = Typography;

export const ClassItem = ({ data, onDelete }) => {
	const navigate = useNavigate();
	const permissions = usePermissions();
	const canDelete = permissions?.includes(ALL_PERMISSIONS.class.delete);

	const role = useRole();

	const items = [
		{
			key: "1",
			label: "Ngày bắt đầu",
			children: formatDate(data.startTime, "DD/MM/yyyy"),
		},
		{
			key: "2",
			label: "Ngày kết thúc",
			children: formatDate(data.endTime, "DD/MM/yyyy"),
		},
	];

	const handleClick = () => {
		navigate(data.classId);
	};

	const handleDelete = (e) => {
		e.stopPropagation();
		onDelete(data);
	};

	return (
		<Card
			className="w-full cursor-pointer"
			hoverable
			title={
				<Text className="text-base">
					<span className="font-light">Lớp</span> {data.className}
				</Text>
			}
			extra={
				role === roles.WORKER && (
					<Tag color={data.enrolled ? "blue-inverse" : "default"}>
						{data.enrolled ? "Đã tham gia" : "Chưa tham gia"}
					</Tag>
				)
			}
			onClick={handleClick}
		>
			<Descriptions layout="vertical" items={items} />
			<Descriptions
				items={[
					{
						label: "Môn học",
						children: `${data.courseCode} - ${data?.courseName}`,
					},
				]}
			/>
			{role === roles.WORKER && (
				<Descriptions
					items={[
						{
							label: "Giáo viên",
							children: data.teacherName,
						},
					]}
				/>
			)}
			{canDelete && (
				<Button
					className="flex-center"
					icon={<Delete size={"20px"}></Delete>}
					danger
					type="text"
					onClick={handleDelete}
				/>
			)}
		</Card>
	);
};
