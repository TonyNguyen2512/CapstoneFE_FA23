import {
	Card,
	Col,
	Row,
	Typography,
} from "antd";
import React from "react";
import { TextTile } from "../../../../../components/TextTile";
import { formatDate } from "../../../../../utils";
import { SearchOutlined } from "@ant-design/icons";
import { eTaskColors, eTaskLabels } from "../../../../../constants/enum";

const { Text } = Typography;

const WorkerTaskItem = ({ task, onView }) => {

	const { id, name, startTime, endTime, status } = task;

	const getTaskStatus = (status) => {
		return eTaskLabels[status] || "Không Xác Định";
	};

	const getTaskStatusColor = (status) => {
		return eTaskColors[status] || "#FF0000";
	};

	return (
		<>
			<Card
				className="mb-2"
				title={`Công việc ${name}`}
				extra={<SearchOutlined className="mt-1" style={{ fontSize: '20px', color: '#08c' }} onClick={() => onView && onView(task)} />}
				key={id}
			>
				<Row gutter={[16, 16]}>
					<Col className="gutter-row" span={8}>
						<TextTile label="Ngày tạo đơn" colon>
							{formatDate(startTime, "DD/MM/YYYY")}
						</TextTile>
					</Col>
					<Col className="gutter-row" span={8}>
						<TextTile label="Hạn công việc" colon>
							{formatDate(endTime, "DD/MM/YYYY")}
						</TextTile>
					</Col>
					<Col className="gutter-row" span={8}>
						<div>
							<TextTile label="Tình trạng" colon></TextTile>
						</div>
						<div>
							<Text strong style={{ color: getTaskStatusColor(status) }}>
								{getTaskStatus(status)}
							</Text>
						</div>
					</Col>
				</Row>
			</Card>
		</>
	);
};

export default WorkerTaskItem;
