import { Typography, Col, Row, Space, Card, Collapse, List } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { formatDate } from "../../../../../utils";
import { enumTaskStatuses } from "../../../../../__mocks__/jama/tasks";
import { UserContext } from "../../../../../providers/user";
import { eTaskColors, eTaskLabels } from "../../../../../constants/enum";

export const WorkerTaskInfo = ({
	dataLeaderTasks,
	dataGroupMembers,
	loading
}) => {
	const { Title } = Typography;
	const { user } = useContext(UserContext);

	const getTaskStatus = (status) => {
		return eTaskLabels[status] || "Không Xác Định";
	};

	const getTaskStatusColor = (status) => {
		return eTaskColors[status] || "#FF0000";
	};

	return (
		<Space direction="vertical" className="w-full gap-6">
			<Row justify="middle">
				<Col span={12}>
					<Title level={4} style={{ margin: 0 }} ellipsis>
						Chi tiết việc làm {dataLeaderTasks?.name}
					</Title>
				</Col>
			</Row>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Card style={{ borderRadius: "1rem" }} loading={loading}>
						<Row gutter={[16, 16]}>
							<Col className="gutter-row" span={8}>Tên đơn hàng: <strong>{dataLeaderTasks?.name}</strong></Col>
							<Col className="gutter-row" span={8}>Tên quản lý: <strong>{dataLeaderTasks?.leaderName}</strong></Col>
							<Col></Col>
							<Col className="gutter-row" span={8}>Ngày bắt đầu: <strong>{formatDate(dataLeaderTasks?.startTime, "DD/MM/YYYY")}</strong>
							</Col>
							<Col className="gutter-row" span={8}>Ngày kết thúc: <strong>{formatDate(dataLeaderTasks?.endTime, " DD/MM/YYYY")}</strong></Col>
							<Col className="gutter-row" span={8}>
								<span>Tình trạng: <strong style={{ color: getTaskStatusColor(dataLeaderTasks?.status) }}>
									{getTaskStatus(dataLeaderTasks?.status)}</strong></span>
							</Col>
						</Row>
						<Row gutter={[16, 16]}>
							<Col className="gutter-row" span={6}>
								<Collapse
									ghost
									items={[
										{
											label: `Thành viên nhóm (${dataGroupMembers?.length ?? 0})`,
											children: (
												<List
													rowKey={(item) => item.id}
													dataSource={dataGroupMembers}
													renderItem={(item) => {
														return (
															<List.Item>
																<span>
																	{item.fullName}
																	{user?.userId === item.id && (
																		<span className="ml-2" style={{ fontWeight: "bold" }}>
																			(Tôi)
																		</span>
																	)}
																</span>
															</List.Item>
														);
													}}
												/>
											),
										},
									]}
								/>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</Space>
	);
};