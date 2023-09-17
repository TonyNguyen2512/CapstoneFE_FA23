import { Card, Row, Typography } from "antd";
import React from "react";
import { usePermissions } from "../../../../hooks/permission";
import { ALL_PERMISSIONS } from "../../../../constants/app";

const { Text } = Typography;

export const CourseItem = ({ course, onDelete, onUpdate }) => {
	const permissions = usePermissions();
	const canUpdate = permissions?.includes(ALL_PERMISSIONS.course.update);

	return (
		<Card
			className="w-full cursor-pointer"
			hoverable
			onClick={() => {
				if (!canUpdate) {
					return;
				}
				onUpdate && onUpdate(course);
			}}
		>
			<Row justify="space-between">
				<div>
					<Text className="text-lg font-medium" ellipsis>
						{course.courseCode} - {course.courseName}
					</Text>
				</div>
			</Row>
		</Card>
	);
};
