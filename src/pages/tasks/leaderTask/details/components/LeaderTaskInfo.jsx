import { Typography, Col, Row, Space, Card } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { formatDate } from "../../../../../utils";
import UserApi from "../../../../../apis/user";
import { orderColors, orderLabels } from "../../../../../constants/enum";
import { TaskContext } from "../../../../../providers/task";

export const LeaderTaskInfo = ({
	loading
}) => {
	const all = useRef();
	const [assignTo, setAssignTo] = useState([]);
	const { Title } = Typography;

	const { info } = useContext(TaskContext);

	const { name, customerName, startTime, endTime, status, assignToId  } = info;

	const getAssignTo = async (assignToId) => {
		const assignTo = await UserApi.getUserById(assignToId);
		setAssignTo(assignTo.fullName);
	}

	useEffect(() => {
		all.current = info;
		if (assignToId) {
			getAssignTo(assignToId)
		}
	}, []);

	return (
		<Space direction="vertical" className="w-full gap-6">
			<Row justify="middle">
				<Col span={8}>
					<Title level={4} style={{ margin: 0 }} ellipsis>
						Chi tiết việc làm {name}
					</Title>
				</Col>
			</Row>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Card style={{ borderRadius: "1rem" }} loading={loading}>
						<Row gutter={[16, 16]}>
							<Col className="gutter-row" span={8}>Tên đơn hàng: <strong>{name}</strong></Col>
							<Col className="gutter-row" span={8}>Khách hàng: <strong>{customerName}</strong></Col>
							<Col className="gutter-row" span={8}>Tên quản lý: <strong>{assignTo}</strong></Col>
							<Col className="gutter-row" span={8}>Ngày bắt đầu: <strong>{formatDate(startTime, "DD/MM/YYYY")}</strong>
							</Col>
							<Col className="gutter-row" span={8}>Ngày kết thúc: <strong>{formatDate(endTime, " DD/MM/YYYY")}</strong></Col>
							<Col className="gutter-row" span={8}>
								<span>Tình trạng: <strong style={{ color: orderColors[status] }}>
									{orderLabels[status]}</strong></span>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</Space>
	);
};