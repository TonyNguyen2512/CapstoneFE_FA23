import { Empty, Table, Typography } from "antd";
import React from "react";

const { Text } = Typography;

export const StudentList = ({ students }) => {
	const columns = [
		{
			title: "MSSV",
			dataIndex: "code",
			key: "code",
		},
		{
			title: "Họ tên",
			dataIndex: "fullName",
			key: "fullName",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
	];

	return (
		<Table
			pagination={false}
			bordered
			dataSource={students}
			columns={columns}
			locale={{
				emptyText: (
					<Empty
						description={<Text disabled>Chưa có sinh viên tham gia lớp</Text>}
					/>
				),
			}}
		/>
	);
};
