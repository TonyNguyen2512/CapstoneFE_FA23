import { Typography, Col, Row, Space, Card } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { formatDate } from "../../../../../utils";
import { enumTaskStatuses } from "../../../../../__mocks__/jama/tasks";

export const ManagerTaskInfo = ({
	dataSource,
	loading
}) => {
	const all = useRef();
	const [task, setTask] = useState([]);
	const { Title } = Typography;

	const getTaskStatus = (status) => {
		return enumTaskStatuses[status]?.name || "Không Xác Định";
	};

	const getTaskStatusColor = (status) => {
		return enumTaskStatuses[status]?.color || "#FF0000";
	};

	useEffect(() => {
		all.current = dataSource;
		setTask(dataSource);
	}, [dataSource]);

	return (
		<Space direction="vertical" className="w-full gap-6">
			<Row justify="middle">
				<Col span={12}>
					<Title level={4} style={{ margin: 0 }} ellipsis>
						Chi tiết việc làm {task?.name}
					</Title>
				</Col>
			</Row>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Card style={{ borderRadius: "1rem" }} loading={loading}>
						<Row gutter={[16, 16]}>
							<Col className="gutter-row" span={8}>Tên đơn hàng: <strong>{task?.name}</strong></Col>
							<Col className="gutter-row" span={8}>Khách hàng: <strong>{task?.name}</strong></Col>
							<Col className="gutter-row" span={8}>Tên quản lý: <strong>{task?.name}</strong></Col>
							<Col className="gutter-row" span={8}>Ngày bắt đầu: <strong>{formatDate(task?.timeStart, "DD/MM/YYYY")}</strong>
							</Col>
							<Col className="gutter-row" span={8}>Ngày kết thúc: <strong>{formatDate(task?.timeEnd, " DD/MM/YYYY")}</strong></Col>
							<Col className="gutter-row" span={8}>
								<span>Tình trạng: <strong style={{ color: getTaskStatusColor(task?.status) }}>
									{getTaskStatus(task?.status)}</strong></span>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</Space>
	);
};