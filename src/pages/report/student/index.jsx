import { Spin, message, Typography, Descriptions } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import ReportApi from "../../../apis/report";
import GroupApi from "../../../apis/group";
import { BasePageContent } from "../../../layouts/containers/BasePageContent";
import { ReportSection } from "../components/ReportSection";
import { ReportDetailDrawer } from "./components/ReportDetailDrawer";
import { SubmitReportDrawer } from "./components/SubmitReportDrawer";
import { TeamProvider } from "../../../providers/team";
import { formatDate } from "../../../utils";

const { Text } = Typography;

const StudentTeamReportPage = () => {
	const { id } = useParams();
	const reportPeriod = useRef();
	const [reportId, setReportId] = useState();

	const [showReportDrawer, setShowReportDrawer] = useState(false);
	const [showReportDetailDrawer, setShowReportDetailDrawer] = useState(false);

	const [reports, setReports] = useState([]);
	const [team, setTeam] = useState();
	const [loading, setLoading] = useState(false);
	const [sendingReport, setSendingReport] = useState(false);

	const report1 = reports?.find((e) => e.period === 0);
	const report2 = reports?.find((e) => e.period === 1);
	const report3 = reports?.find((e) => e.period === 2);

	const getReports = async () => {
		if (!id) return;

		setLoading(true);
		const data = await ReportApi.getReports(id);
		setReports(data);
		setLoading(false);
	};

	const getTeam = async () => {
		if (!id) return;

		setLoading(true);
		const data = await GroupApi.getJoinedProjectTeamById(id);
		setTeam(data);
		setLoading(false);
	};

	const onSendReport = (index) => {
		reportPeriod.current = index;
		setShowReportDrawer(true);
	};

	const onViewReport = (report) => {
		setReportId(report?.id);
		setShowReportDetailDrawer(true);
	};

	const handleSendReport = async (values) => {
		const request = { ...values, teamId: team?.id };
		setSendingReport(true);
		const success = await ReportApi.sendReport(request);
		if (success) {
			message.success("Đã gửi báo cáo cho giáo viên");
			getReports();
			getTeam();
		}
		setSendingReport(false);
		setShowReportDrawer(false);
	};

	useEffect(() => {
		getTeam();
		getReports();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return (
		<Spin spinning={loading}>
			<TeamProvider team={team}>
				<BasePageContent
					title={`Báo cáo gửi cho giáo viên: ${
						team?.instructor?.fullName ?? ""
					}`}
				>
					<div className="mt-4">
						<Descriptions
							items={[
								{
									label: "Hạn nộp báo cáo",
									children: (
										<Text>
											Từ{" "}
											<strong>
												{formatDate(team?.reportStartTime, "DD/MM/YYYY")}
											</strong>{" "}
											đến{" "}
											<strong>
												{formatDate(team?.reportEndTime, "DD/MM/YYYY")}
											</strong>
										</Text>
									),
								},
							]}
						/>
					</div>
					<div className="mb-4">
						<ReportSection
							index={0}
							report={report1}
							onSendReport={onSendReport}
							onViewReport={onViewReport}
						/>
					</div>
					<div className="mt-4 mb-4">
						<ReportSection
							index={1}
							report={report2}
							onSendReport={onSendReport}
							onViewReport={onViewReport}
						/>
					</div>
					<div className="mt-4 mb-4">
						<ReportSection
							index={2}
							report={report3}
							onSendReport={onSendReport}
							onViewReport={onViewReport}
						/>
					</div>
					<SubmitReportDrawer
						open={showReportDrawer}
						onCancel={() => setShowReportDrawer(false)}
						onSubmit={handleSendReport}
						confirmLoading={sendingReport}
						period={reportPeriod.current}
					/>
					<ReportDetailDrawer
						open={showReportDetailDrawer}
						onCancel={() => setShowReportDetailDrawer(false)}
						reportId={reportId}
						afterOpenChange={(isOpen) => {
							if (!isOpen) {
								setReportId(undefined);
							}
						}}
					/>
				</BasePageContent>
			</TeamProvider>
		</Spin>
	);
};

export default StudentTeamReportPage;
