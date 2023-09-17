import React from "react";
import { Table } from "antd";

export const ProjectTeamList = ({ teams }) => {
	const columns = [
		{
			title: "Tên đề tài",
			dataIndex: "projectName",
			key: "projectName",
		},
		{
			title: "Tên thành viên",
			dataIndex: "members",
			key: "members",
		},
	];

	return (
		<Table pagination={false} bordered dataSource={teams} columns={columns} />
	);
};
