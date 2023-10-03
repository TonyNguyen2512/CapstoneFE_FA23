import { Empty, List, Typography } from "antd";
import React from "react";
import { ProjectTeamItem } from "./ProjectTeamItem";

const { Text } = Typography;

export const ProjectTeamList = ({ teams }) => {
	const renderItem = (item, index) => {
		return (
			<List.Item>
				<ProjectTeamItem team={item} index={index} />
			</List.Item>
		);
	};
	return (
		<List
			rowKey={(team) => team.id}
			dataSource={teams}
			renderItem={renderItem}
			locale={{
				emptyText: (
					<Empty description={<Text disabled>Chưa có dữ liệu</Text>} />
				),
			}}
		/>
	);
};
