import {
	Card,
	Col,
	Row,
	Typography,
} from "antd";
import React, { useContext } from "react";
import { TextTile } from "../../../../../components/TextTile";
import { formatDate, getTaskStatusColor, getTaskStatusName } from "../../../../../utils";
import { SearchOutlined } from "@ant-design/icons";
import { roles } from "../../../../../constants/app";
import { UserContext } from "../../../../../providers/user";

const { Text } = Typography;

const WorkerTaskItem = ({ task, onView }) => {

	const { user } = useContext(UserContext);
	const isAdmin = user?.role?.name === roles.LEADER;

	const { id, name, startTime, endTime, status, leaderTaskName } = task;

	return (
		<>
			<Card
				className="mb-2"
				title={isAdmin ? `Công việc ${name}` : `Công việc ${leaderTaskName} - ${name}`}
				extra={<SearchOutlined className="mt-1" style={{ fontSize: '20px', color: '#08c' }} onClick={() => onView && onView(task)} />}
				key={id}
			>
				<Row gutter={[16, 16]}>
					<Col className="gutter-row" xs={24} xl={8}>
						<TextTile label="Ngày tạo đơn" colon>
							{formatDate(startTime, "DD/MM/YYYY")}
						</TextTile>
					</Col>
					<Col className="gutter-row" xs={24} xl={8}>
						<TextTile label="Hạn công việc" colon>
							{formatDate(endTime, "DD/MM/YYYY")}
						</TextTile>
					</Col>
					<Col className="gutter-row" xs={24} xl={8}>
						<div>
							<TextTile label="Tình trạng" colon></TextTile>
						</div>
						<div>
							<Text strong style={{ color: getTaskStatusColor(status) }}>
								{getTaskStatusName(status)}
							</Text>
						</div>
					</Col>
				</Row>
			</Card>
		</>
	);
};

export default WorkerTaskItem;
