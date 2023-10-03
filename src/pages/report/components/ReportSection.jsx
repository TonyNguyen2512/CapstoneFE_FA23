import { PreviewOpen, Send } from "@icon-park/react";
import { Button, Card, Col, Row, Tag, Typography } from "antd";
import React, { useContext } from "react";
import { ReportFeedbackStatus } from "../../../constants/enum";
import { TeamContext } from "../../../providers/team";
import { UserContext } from "../../../providers/user";
import { formatDate } from "../../../utils";

const { Text } = Typography;

export const ReportSection = ({
	index,
	report,
	onSendReport,
	onViewReport,
}) => {
	const canViewReport = report !== undefined || report != null;
	const canSubmitReport = report == null || report === undefined;

	const { user } = useContext(UserContext);
	const { team } = useContext(TeamContext);
	const isLeader = user?.userId === team?.leader?.id;

	return (
		<Card className="w-full">
			<Row align="middle" justify="space-between">
				<Col>
					<Text style={{ fontWeight: 400 }}>
						{`Báo cáo lần ${index + 1}`}{" "}
						{report ? (
							<Tag color="green-inverse" className="ml-4">
								Đã nộp
							</Tag>
						) : (
							<Tag className="ml-4">Chưa nộp</Tag>
						)}
						{report?.feedback && (
							<Tag color="purple-inverse">Đã được nhận xét</Tag>
						)}
					</Text>
					{report?.createdDate && (
						<div className="mt-3">
							<Text>
								<Text style={{ marginRight: 4 }}>Ngày nộp báo cáo:</Text>
								<Text strong>
									{formatDate(report?.createdDate, "DD/MM/YYYY")}
								</Text>
							</Text>
						</div>
					)}

					{report?.feedback && (
						<div className="mt-3">
							<Text>
								<Text style={{ marginRight: 4 }}>Đánh giá:</Text>
								<Text
									strong
									type={
										report?.feedback?.grade === ReportFeedbackStatus.passed
											? "success"
											: "danger"
									}
									style={{ fontSize: 16 }}
								>
									{report?.feedback?.grade === ReportFeedbackStatus.passed
										? "Đạt"
										: "Chưa đạt"}
								</Text>
							</Text>
						</div>
					)}
				</Col>
				<Row>
					<Col>
						{canViewReport && (
							<Button
								type="link"
								className="w-full flex-center"
								icon={<PreviewOpen />}
								onClick={() => onViewReport(report)}
							>
								Xem báo cáo
							</Button>
						)}
					</Col>
					<Col>
						{canSubmitReport && isLeader && (
							<Button
								type="link"
								className="w-full flex-center"
								icon={<Send />}
								onClick={() => onSendReport(index)}
							>
								Nộp báo cáo
							</Button>
						)}
					</Col>
				</Row>
			</Row>
		</Card>
	);
};
