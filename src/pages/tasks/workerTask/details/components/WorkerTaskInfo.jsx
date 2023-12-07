import { Typography, Col, Row, Space, Card, Collapse, Button, message } from "antd";
import React, { useContext, useState } from "react";
import { formatDate, getTaskStatusColor, getTaskStatusName } from "../../../../../utils";
import { UserContext } from "../../../../../providers/user";
import { wTaskStatus } from "../../../../../constants/enum";
import { TaskContext } from "../../../../../providers/task";
import ReportApi from "../../../../../apis/task-report";
import { TaskReportModal } from "../../components/TaskReportModal";
import { roles } from "../../../../../constants/app";
import { TaskAcceptanceModal } from "../../components/TaskAcceptanceModal";
import LeaderTasksApi from "../../../../../apis/leader-task";

const { Text } = Typography;

export const WorkerTaskInfo = ({
	loading
}) => {
	const { Title } = Typography;
	const { user } = useContext(UserContext);
	const { info, team, tasks, acceptance, acceptanceTask } = useContext(TaskContext);

	const [taskReportLoading, setTaskReportLoading] = useState(false);
	const [taskAcceptanceLoading, setTaskAcceptanceLoading] = useState(false);

	const [showReportModal, setShowReportModal] = useState(false);
	const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);

	const isLeader = user?.role?.name === roles.LEADER;

	const { name, leaderName, status, startTime, endTime } = info || [];

	const completedTasks = tasks?.filter(
		(e) => e.status === wTaskStatus.Completed
	);
	const isCompletedTasks = tasks.length >= 1 && completedTasks && completedTasks.length === tasks.length;

	const handleReportCreate = async (values) => {
		setTaskReportLoading(true);
		values.createdDate = new Date();
		console.log("create report: ", values);
		const report = await ReportApi.sendProblemReport(values);
		if (report.code === 0) {
			setShowReportModal(false);
			message.info(report.message);
		} else {
			message.error(report.message);
		}
		setTaskReportLoading(false);
	}

	const handleAcceptanceCreate = async (values) => {
		setTaskAcceptanceLoading(true);
		console.log("create acceptance: ", values);
		const report = await LeaderTasksApi.createAcceptanceTasks(values);
		if (report.code === 0) {
			setShowAcceptanceModal(false);
			message.info(report.message);
			acceptanceTask();
		} else {
			message.error(report.message);
		}
		setTaskAcceptanceLoading(false);
	}

	const defaultValue = (value) => {
		return <Text style={{ color: "red" }}>{value}</Text>;
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
					<>
						<Col span={2} offset={isCompletedTasks ? 10 : 14}>
							<Button
								type="primary"
								className="btn-primary app-bg-primary font-semibold text-white"
								onClick={() => setShowReportModal(true)}
								disabled={acceptance}
							>
								Báo cáo vấn đề
							</Button>
						</Col>
						{isCompletedTasks && 
							<Col span={2} offset={1}>
								<Button
									type="primary"
									className="btn-primary app-bg-success font-semibold text-white"
									onClick={() => setShowAcceptanceModal(true)}
									disabled={acceptance}
								>
									Báo cáo nghiệm thu
								</Button>
							</Col>
						}
					</>
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
									{getTaskStatusName(status)}</strong></span>
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
				(<>
					<TaskReportModal
						open={showReportModal}
						title="Thêm báo cáo vấn đề"
						onCancel={() => {
							setShowReportModal(false);
						}}
						onSubmit={handleReportCreate}
						confirmLoading={taskReportLoading}
					/>

					<TaskAcceptanceModal
						open={showAcceptanceModal}
						title="Thêm báo cáo nghiệm thu"
						onCancel={() => {
							setShowAcceptanceModal(false);
						}}
						onSubmit={handleAcceptanceCreate}
						confirmLoading={taskAcceptanceLoading}
					/>
				</>)
			}
		</Space>
	);
};