import { Delete, More, PreviewOpen } from "@icon-park/react";
import {
	Avatar,
	Button,
	Card,
	Col,
	Dropdown,
	Row,
	Tag,
	Tooltip,
	Typography,
} from "antd";
import React, { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import moment, { now } from "moment";
import { useNavigate } from "react-router-dom";
import { enumTaskStatuses } from "../../../../../__mocks__/jama/tasks";
import { TextTile } from "../../../../../components/TextTile";
import { formatDate } from "../../../../../utils";
import { SearchOutlined, StarTwoTone } from "@ant-design/icons";

const { Text } = Typography;

const WorkerTaskItem = ({ task, onView }) => {

	const { id, name, members, startTime, endTime, status } = task;

	const getTaskStatus = (status) => {
		return enumTaskStatuses[status]?.name || "Không Xác Định";
	};

	const getTaskStatusColor = (status) => {
		return enumTaskStatuses[status]?.color || "#FF0000";
	};

	return (
		<>
			<Card
				className="mb-2"
				title={`Công việc ${name}`}
				// style={{ width: 500 }}
				extra={<SearchOutlined className="mt-1" style={{ fontSize: '20px', color: '#08c' }} onClick={() => onView && onView(task)} />}
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
