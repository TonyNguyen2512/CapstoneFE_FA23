import { Typography, Col, Row, Space, Card } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { formatDate } from "../../../../../utils";
import { enumTaskStatuses } from "../../../../../__mocks__/jama/tasks";
import OrderApi from "../../../../../apis/order";
import { UserContext } from "../../../../../providers/user";
import UserApi from "../../../../../apis/user";

export const LeaderTaskInfo = ({
	dataSource,
	loading
}) => {
	const all = useRef();
	const [orderInfo, setOrderInfo] = useState([]);
	const [assignTo, setAssignTo] = useState([]);
	const { Title } = Typography;
  
	const { user } = useContext(UserContext);

	const getTaskStatus = (status) => {
		return enumTaskStatuses[status]?.name || "Không Xác Định";
	};

	const getTaskStatusColor = (status) => {
		return enumTaskStatuses[status]?.color || "#FF0000";
	};

	const getAssignTo = async (assignToId) => {
		console.log("getAssignTo")
		console.log(assignToId)
		const assignTo = await UserApi.getUserById(assignToId);
		setAssignTo(assignTo.fullName);
	}

	useEffect(() => {
		all.current = dataSource;
		console.log("info")
		console.log(dataSource)
		setOrderInfo(dataSource);
		if (dataSource?.assignToId) {
			getAssignTo(dataSource?.assignToId)
		}
	}, [dataSource]);

	return (
		<Space direction="vertical" className="w-full gap-6">
			<Row justify="middle">
				<Col span={12}>
					<Title level={4} style={{ margin: 0 }} ellipsis>
						Chi tiết việc làm {orderInfo?.name}
					</Title>
				</Col>
			</Row>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Card style={{ borderRadius: "1rem" }} loading={loading}>
						<Row gutter={[16, 16]}>
							<Col className="gutter-row" span={8}>Tên đơn hàng: <strong>{orderInfo?.name}</strong></Col>
							<Col className="gutter-row" span={8}>Khách hàng: <strong>{orderInfo?.customerName}</strong></Col>
							<Col className="gutter-row" span={8}>Tên quản lý: <strong>{assignTo}</strong></Col>
							<Col className="gutter-row" span={8}>Ngày bắt đầu: <strong>{formatDate(orderInfo?.startTime, "DD/MM/YYYY")}</strong>
							</Col>
							<Col className="gutter-row" span={8}>Ngày kết thúc: <strong>{formatDate(orderInfo?.endTime, " DD/MM/YYYY")}</strong></Col>
							<Col className="gutter-row" span={8}>
								<span>Tình trạng: <strong style={{ color: getTaskStatusColor(orderInfo?.status) }}>
									{getTaskStatus(orderInfo?.status)}</strong></span>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</Space>
	);
};