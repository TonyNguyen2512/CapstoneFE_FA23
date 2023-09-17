import { Button, Empty, List, Table, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import { RawHtml } from "../../../../components/RawHtml";

const { Text, Title } = Typography;

export const ProjectReportList = ({ teams }) => {
	const navigate = useNavigate();

	const columns = [
		{
			title: "Nhóm trưởng",
			render: (_, record) => {
				return record?.leader?.fullName ?? "";
			},
		},
		{
			title: "Dự án",
			render: (_, record) => {
				return record?.project?.name ?? "";
			},
		},
		{
			title: "Tổng thành viên",
			align: "center",
			render: (_, { members }) => {
				return <div>{members?.length}</div>;
			},
		},
		{
			align: "right",
			render: (_, record) => {
				return (
					<Button
						type="primary"
						onClick={() => {
							navigate(record?.id);
						}}
					>
						Xem báo cáo
					</Button>
				);
			},
		},
	];

	return (
		<Table
			dataSource={teams}
			columns={columns}
			pagination={false}
			locale={{
				emptyText: (
					<Empty description={<Text disabled>Chưa có nhóm đăng ký</Text>} />
				),
			}}
			expandable={{
				expandedRowRender: (record) => {
					return (
						<div>
							<Title level={5}>Thành viên:</Title>
							<List
								dataSource={record?.members}
								renderItem={(user) => {
									return (
										<List.Item>
											{user.mssv} - {user.fullName}
										</List.Item>
									);
								}}
							/>

							<Title level={5}>Tên dự án:</Title>
							<Text>{record?.project?.name}</Text>
							<Title level={5}>Mô tả:</Title>
							<div className="mb-4">
								<RawHtml html={record?.project?.description} />
							</div>
							<Title level={5}>Yêu cầu chức năng (Functional):</Title>
							<Text>{record?.project?.functionalReq}</Text>
							<Title level={5}>Yêu cầu phi chức năng (Non-functional):</Title>
							<Text>{record?.project?.nonfunctionalReq}</Text>
						</div>
					);
				},
			}}
		/>
	);
};
