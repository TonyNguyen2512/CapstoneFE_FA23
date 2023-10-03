import { User } from "@icon-park/react";
import { Avatar, Card, Col, Row, Typography } from "antd";
import React from "react";
import { formatDate } from "../../../../utils";

const { Text, Paragraph } = Typography;

export const TeacherFeedback = ({ feedback }) => {
	return (
		<Card>
			<Row align="middle" justify="space-between">
				<Row align="middle" gutter={8} className="mb-1">
					<Col>
						<Avatar
							style={{ backgroundColor: "#f56a00" }}
							size={24}
							icon={<User size={10} />}
							className="flex-center"
						/>
					</Col>
					<Col>
						<Text style={{ padding: 0 }} strong>
							{feedback?.feedbackBy?.fullName}
						</Text>
					</Col>
				</Row>
				<Text disabled>{formatDate(feedback?.createdDate, "DD/MM/YYYY")}</Text>
			</Row>
			<Paragraph className="mt-2">{feedback?.content}</Paragraph>
		</Card>
	);
};
