import { Typography, Col, Row, Space, Card, Button } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { formatDate } from "../../../../../utils";
import { enumTaskStatuses } from "../../../../../__mocks__/jama/tasks";
import OrderApi from "../../../../../apis/order";
import { UserContext } from "../../../../../providers/user";
import UserApi from "../../../../../apis/user";
import { orderColors, orderLabels } from "../../../../../constants/enum";
import { TaskContext } from "../../../../../providers/task";

export const LeaderTaskInfo = ({
	loading
}) => {
	const all = useRef();
	const [assignTo, setAssignTo] = useState([]);
	const { Title } = Typography;

	const { user } = useContext(UserContext);
	const { order } = useContext(TaskContext);

	const getAssignTo = async (assignToId) => {
		const assignTo = await UserApi.getUserById(assignToId);
		setAssignTo(assignTo.fullName);
	}

	const setShowReportModal = () => {

	}

	useEffect(() => {
		all.current = order;
		if (order?.assignToId) {
			getAssignTo(order?.assignToId)
		}
	}, []);

	return (
		<Space direction="vertical" className="w-full gap-6">
			<Row justify="middle">
				<Col span={8}>
					<Title level={4} style={{ margin: 0 }} ellipsis>
						Chi tiết việc làm {order?.name}
					</Title>
				</Col>
				<Col span={4} offset={12}>
					<Button
						type="primay"
						className="btn-primary app-bg-primary font-semibold text-white"
						onClick={() => setShowReportModal(true)}
					>
						Báo cáo vấn đề
					</Button>
				</Col>
			</Row>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Card style={{ borderRadius: "1rem" }} loading={loading}>
						<Row gutter={[16, 16]}>
							<Col className="gutter-row" span={8}>Tên đơn hàng: <strong>{order?.name}</strong></Col>
							<Col className="gutter-row" span={8}>Khách hàng: <strong>{order?.customerName}</strong></Col>
							<Col className="gutter-row" span={8}>Tên quản lý: <strong>{assignTo}</strong></Col>
							<Col className="gutter-row" span={8}>Ngày bắt đầu: <strong>{formatDate(order?.startTime, "DD/MM/YYYY")}</strong>
							</Col>
							<Col className="gutter-row" span={8}>Ngày kết thúc: <strong>{formatDate(order?.endTime, " DD/MM/YYYY")}</strong></Col>
							<Col className="gutter-row" span={8}>
								<span>Tình trạng: <strong style={{ color: orderColors[order?.status] }}>
									{orderLabels[order?.status]}</strong></span>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</Space>
	);
};