import { Card, List, Typography } from "antd";
import React, { useContext } from "react";
import { ProjectContext } from "../../../../providers/project";

const { Text } = Typography;

export const ProjectStudentList = () => {
	const project = useContext(ProjectContext);

	return (
		<Card title={`Sinh viên đang tham gia (${project?.members?.length})`}>
			<List
				rowKey={(e) => e?.memberId}
				dataSource={project?.members}
				split={false}
				renderItem={(member) => {
					return (
						<List.Item>
							<Text>
								{member?.memberCode} - {member?.memberFullName}
							</Text>
						</List.Item>
					);
				}}
			/>
		</Card>
	);
};
