import { Empty, List, Typography } from "antd";
import React from "react";
import { ProjectItem } from "./ProjectItem";

const { Text } = Typography;

export const ProjectList = ({ projects }) => {
	const renderItem = (item) => {
		return (
			<List.Item>
				<ProjectItem project={item} />
			</List.Item>
		);
	};

	return (
		<List
			dataSource={projects}
			renderItem={renderItem}
			rowKey={(item) => item.id}
			locale={{
				emptyText: (
					<Empty description={<Text disabled>Chưa có dự án nào</Text>} />
				),
			}}
		/>
	);
};
