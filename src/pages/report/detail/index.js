import React, { useEffect, useState } from "react";
import { BasePageContent } from "../../../layouts/containers/BasePageContent";
import { useParams } from "react-router";
import TeamApi from "../../../apis/team";
import { Spin, Typography, message } from "antd";
import { TeamProvider } from "../../../providers/team";
import { TeacherTeamProgressOverview } from "./components/TeacherTeamProgressOverview";
import ReportApi from "../../../apis/report";
import { ReportSection } from "../components/ReportSection";
import { TeamBasicInfo } from "../../team/detail/components/TeamBasicInfo";
import { ReportDetailDrawer } from "../student/components/ReportDetailDrawer";

const {  Title } = Typography;

const ProjectReportDetailPage = () => {
	const { id } = useParams();

	const [loading, setLoading] = useState(false);
	const [sendingFeedback, setSendingFeedback] = useState(false);
	const [showReportDetailDrawer, setShowReportDetailDrawer] = useState(false);
	const [team, setTeam] = useState();
	const [reports, setReports] = useState();
	const [reportId, setReportId] = useState();

	const report1 = reports?.find((e) => e.period === 0);
	const report2 = reports?.find((e) => e.period === 1);
	const report3 = reports?.find((e) => e.period === 2);

	const getTeam = async () => {
		if (!id) return;
		setLoading(true);
		const data = await TeamApi.getProjectTeamDetailByTeacher(id);
		setTeam(data);
		setLoading(false);
	};

	const getReports = async () => {
		if (!id) return;
		setLoading(true);
		const data = await ReportApi.getReports(id);
		setReports(data);
		setLoading(false);
	};

	const onViewReport = (report) => {
		setReportId(report?.id);
		setShowReportDetailDrawer(true);
	};

	const onSendFeedback = async (values) => {
		console.log("on send feedback: ", values);
		setSendingFeedback(true);
		const success = await ReportApi.sendReportFeedback(values);
		if (success) {
			message.success("Đã gửi nhận xét cho nhóm");
			getReports();
			getTeam();
		}
		setSendingFeedback(false);
		setShowReportDetailDrawer(false);
	};

	useEffect(() => {
		getTeam();
		getReports();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return (
		<BasePageContent title="Báo cáo nhóm">
			<Spin spinning={loading}>
				<TeamProvider team={team}>
					<div className="mt-4">
						<TeamBasicInfo />
					</div>
					<div className="mt-4">
						<TeacherTeamProgressOverview />
					</div>
					<div className="mt-4 mb-2">
						<Title level={5}>Báo cáo chi tiết</Title>
					</div>
					<div className="mb-4">
						<ReportSection
							index={0}
							report={report1}
							onViewReport={onViewReport}
						/>
					</div>
					<div className="mt-4 mb-4">
						<ReportSection
							index={1}
							report={report2}
							onViewReport={onViewReport}
						/>
					</div>
					<div className="mt-4 mb-4">
						<ReportSection
							index={2}
							report={report3}
							onViewReport={onViewReport}
						/>
					</div>
					<ReportDetailDrawer
						open={showReportDetailDrawer}
						onCancel={() => setShowReportDetailDrawer(false)}
						reportId={reportId}
						afterOpenChange={(isOpen) => {
							if (!isOpen) {
								setReportId(undefined);
							}
						}}
						onSendFeedback={onSendFeedback}
						sendingFeedback={sendingFeedback}
					/>
				</TeamProvider>
			</Spin>
		</BasePageContent>
	);
};

export default ProjectReportDetailPage;
