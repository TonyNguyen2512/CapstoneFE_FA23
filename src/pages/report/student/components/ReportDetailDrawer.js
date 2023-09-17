import {
	Button,
	Collapse,
	Descriptions,
	Divider,
	Drawer,
	Empty,
	Form,
	Select,
	Spin,
	Typography,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { TextTile } from "../../../../components/TextTile";
import { TeacherFeedback } from "./TeacherFeedback";
import ReportApi from "../../../../apis/report";
import { TeamContext } from "../../../../providers/team";
import { useRole } from "../../../../hooks/role";
import { roles } from "../../../../constants/app";
import TextArea from "antd/es/input/TextArea";
import { Send } from "@icon-park/react";
import { ReportFeedbackStatus } from "../../../../constants/enum";

const { Title, Text } = Typography;

export const ReportDetailDrawer = ({
	reportId,
	open,
	onCancel,
	afterOpenChange,
	onSendFeedback,
	sendingFeedback,
}) => {
	const formRef = useRef();

	const role = useRole();
	const { team } = useContext(TeamContext);
	const [report, setReport] = useState();
	const [loading, setLoading] = useState(false);

	const getReport = async () => {
		if (!reportId) return;
		setLoading(true);
		const data = await ReportApi.getReportById(reportId);
		setReport(data);
		setLoading(false);
	};

	useEffect(() => {
		getReport();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reportId]);

	useEffect(() => {
		formRef.current?.setFieldValue("content", report?.feedback?.content);
		formRef.current?.setFieldValue("grade", report?.feedback?.grade);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [report]);

	return (
		<Drawer
			open={open}
			onClose={onCancel}
			maskClosable={false}
			title={`Báo cáo lần ${report?.period + 1 ?? ""}`}
			placement="right"
			size="large"
			afterOpenChange={afterOpenChange}
		>
			<Spin spinning={loading}>
				<Descriptions
					items={[
						{
							label: "Sinh viên báo cáo",
							children: team?.leader?.fullName ?? "N/A",
						},
					]}
				/>
				<Descriptions
					items={[
						{
							label: "Giáo viên nhận báo cáo",
							children: team?.instructor?.fullName ?? "N/A",
						},
					]}
				/>
				<TextTile label="Tiêu đề" colon>
					<div className="mt-1">{report?.title ?? "-"}</div>
				</TextTile>
				<Divider />
				<TextTile label="Báo cáo chung" colon>
					<div className="mt-1">{report?.overviewReport ?? "-"}</div>
				</TextTile>
				<Divider />
				<TextTile label="Công việc đã làm" colon>
					<div className="mt-1">{report?.doneReport ?? "-"}</div>
				</TextTile>
				<Divider />
				<TextTile label="Công việc đang làm" colon>
					<div className="mt-1">{report?.doingReport ?? "-"}</div>
				</TextTile>
				<Divider />
				<TextTile label="Công việc dự định làm" colon>
					<div className="mt-1">{report?.todoReport ?? "-"}</div>
				</TextTile>
				<Divider />
				{role === roles.WORKER && (
					<Collapse
						ghost
						items={[
							{
								label: <Title level={5}>Nhận xét của giáo viên</Title>,
								children: report?.feedback ? (
									<div>
										<TeacherFeedback feedback={report?.feedback} />
									</div>
								) : (
									<Empty description={<Text disabled>Chưa có nhận xét</Text>} />
								),
							},
						]}
					/>
				)}
				{role === roles.FACTORY && (
					<Form
						ref={formRef}
						layout="vertical"
						initialValues={{
							content: report?.feedback?.content,
							grade: report?.feedback?.grade,
						}}
						onFinish={async (values) => {
							const data = { ...values, reportId: report?.id };
							await onSendFeedback(data);
						}}
					>
						<Title level={4}>Gửi nhận xét</Title>
						<Form.Item
							name="content"
							label="Nội dung"
							rules={[
								{
									required: true,
									message: "Vui lòng nhập nhận xét",
								},
							]}
						>
							<TextArea
								disabled={report?.feedback ? true : false}
								placeholder="Nhập nhận xét..."
							/>
						</Form.Item>
						<Form.Item
							name="grade"
							label="Đánh giá"
							rules={[
								{
									required: true,
									message: "Vui lòng chọn đánh giá",
								},
							]}
						>
							<Select
								disabled={report?.feedback ? true : false}
								placeholder="Chọn đánh giá"
								options={[
									{
										label: "Đạt",
										value: ReportFeedbackStatus.passed,
									},
									{
										label: "Chưa đạt",
										value: ReportFeedbackStatus.notPassed,
									},
								]}
							/>
						</Form.Item>
						{!report?.feedback && (
							<Button
								className="flex-center"
								icon={<Send />}
								htmlType="submit"
								type="primary"
								loading={sendingFeedback}
							>
								Gửi
							</Button>
						)}
					</Form>
				)}
			</Spin>
		</Drawer>
	);
};
