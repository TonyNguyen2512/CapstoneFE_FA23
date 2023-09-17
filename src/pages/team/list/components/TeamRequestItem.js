import { SendEmail } from "@icon-park/react";
import { Card, Col, Descriptions, Row, Typography } from "antd";
import React from "react";

const { Title } = Typography;

export const TeamRequestItem = ({ teamRequest, onClick }) => {
	const items = [
		{
			key: "PROJECT_NAME",
			label: "Dự án",
			children: teamRequest?.projectName,
		},
		{
			key: "MEMBERS",
			label: "Số thành viên",
			children: teamRequest?.users?.length,
		},
	];

	return (
		<Card
			className="w-full cursor-pointer"
			hoverable
			onClick={() => onClick(teamRequest)}
		>
			<Row align="middle">
				<Title ellipsis level={5}>
					Yêu cầu đăng ký nhóm
				</Title>
			</Row>
			<Row justify="space-between">
				<Col span={20}>
					<Descriptions items={items} />
				</Col>
				<Col span={4}>
					<Row justify="end">
						<SendEmail size={20} />
					</Row>
				</Col>
			</Row>
		</Card>
	);
};
