import { Typography, Col, Row, Space, Card, Collapse, List, Avatar, Button, message } from "antd";
import React, { useContext, useState } from "react";
import { formatDate } from "../../../../../utils";
import { UserContext } from "../../../../../providers/user";
import { eTaskColors, eTaskLabels } from "../../../../../constants/enum";
import { TaskContext } from "../../../../../providers/task";
import ReportApi from "../../../../../apis/task-report";
import { TaskReportModal } from "../../components/TaskReportModal";
import { roles } from "../../../../../constants/app";

const {Text} = Typography;

export const WorkerTaskInfo = ({
	loading
}) => {
	const { Title } = Typography;
	const { user } = useContext(UserContext);
	const { info, team } = useContext(TaskContext);
	const [eTaskReportLoading, setETaskReportLoading] = useState([]);
	const [showReportModal, setShowReportModal] = useState(false);
	const isLeader = user?.role?.name === roles.LEADER || user?.role?.name === roles.FOREMAN;

	const { name, leaderName, status, startTime, endTime } = info || [];

	const getTaskStatus = (status) => {
		return eTaskLabels[status] || "Không Xác Định";
	};

	const getTaskStatusColor = (status) => {
		return eTaskColors[status] || "#FF0000";
	};

	const handleReportCreate = async (values) => {
		values.createdDate = new Date();
		console.log("create report: ", values);
		const report = await ReportApi.sendProblemReport(values);
		if (report.code === 0) {
			setShowReportModal(false);
			message.info(report.message);
		} else {
			message.error(report.message);
		}
		setETaskReportLoading(false);
	}

	const defaultValue = (value) => {
		return <Text style={{color: "red"}}>{value}</Text>;
	}

	return (
		<Space direction="vertical" className="w-full gap-6">
			<Row justify="middle">
				<Col span={8}>
					<Title level={4} style={{ margin: 0 }} ellipsis>
						Chi tiết việc làm {name}
					</Title>
				</Col>
				{isLeader &&
					<Col span={2} offset={14}>
						<Button
							type="primay"
							className="btn-primary app-bg-primary font-semibold text-white"
							onClick={() => setShowReportModal(true)}
						>
							Báo cáo vấn đề
						</Button>
					</Col>
				}
			</Row>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Card style={{ borderRadius: "1rem" }} loading={loading}>
						<Row gutter={[16, 16]}>
							<Col className="gutter-row" span={8}>Tên đơn hàng: <strong>{name}</strong></Col>
							<Col className="gutter-row" span={8}>Tên quản lý: <strong>{leaderName || defaultValue("Không xác định được quản lý")}</strong></Col>
							<Col></Col>
							<Col className="gutter-row" span={8}>Ngày bắt đầu: <strong>{formatDate(startTime, "DD/MM/YYYY") || defaultValue("Chưa thêm ngày")}</strong>
							</Col>
							<Col className="gutter-row" span={8}>Ngày kết thúc: <strong>{formatDate(endTime, " DD/MM/YYYY") || defaultValue("Chưa thêm ngày")}</strong></Col>
							<Col className="gutter-row" span={8}>
								<span>Tình trạng: <strong style={{ color: getTaskStatusColor(status) }}>
									{getTaskStatus(status)}</strong></span>
							</Col>
						</Row>
						<Row gutter={[16, 16]}>
							<Col className="gutter-row" span={24}>
								<Collapse
									ghost
									items={[
										{
											label: `Thành viên nhóm (${team?.length ?? 0})`,
											children: (
												<Row gutter={[16, 16]}>
													{team?.map((item, index) => (
														<Col className="gutter-row" span={4} key={item.id}>
															<Button type="text" >{index + 1}. {item.fullName}
																{user?.id === item.id && (
																	<span className="ml-2" style={{ fontWeight: "bold" }}>
																		(Tôi)
																	</span>
																)}
															</Button>
														</Col>
													))}
												</Row>
											),
										},
									]}
								/>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
			{isLeader &&
				<TaskReportModal
					open={showReportModal}
					title="Thêm báo cáo vấn đề"
					onCancel={() => {
						setShowReportModal(false);
					}}
					onSubmit={handleReportCreate}
					confirmLoading={eTaskReportLoading}
				/>
			}
		</Space>
	);
};