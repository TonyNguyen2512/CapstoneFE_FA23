import { Send } from "@icon-park/react";
import { Button, Card, Descriptions, Typography } from "antd";
import moment, { now } from "moment";
import React, { useContext } from "react";
import { ProgressIndicator } from "../../../../components/ProgressIndicator";
import { TaskStatus } from "../../../../constants/enum";
import { TeamContext } from "../../../../providers/team";
import { UserContext } from "../../../../providers/user";
import { useNavigate } from "react-router";
import routes from "../../../../constants/routes";

const { Title } = Typography;

export const TeacherTeamProgressOverview = () => {
	const navigate = useNavigate();

	const { team } = useContext(TeamContext);
	const { user } = useContext(UserContext);

	const isLeader = user?.userId === team?.leader?.id;
	const allTasks = team?.tasks;
	const completedTasks = allTasks?.filter(
		(e) => e.status === TaskStatus.completed
	);

	return (
		<Card
			title="Báo cáo tổng quan"
			extra={
				isLeader && (
					<Button
						type="link"
						icon={<Send />}
						className="flex-center"
						onClick={() =>
							navigate(
								`${routes.dashboard.root}/${routes.dashboard.studentReport}/${team?.id}`
							)
						}
					>
						Gửi báo cáo cho giáo viên
					</Button>
				)
			}
		>
			<Title level={5} style={{ fontWeight: 400, fontSize: 14 }}>
				Hoàn thành ({completedTasks?.length ?? 0}/{allTasks?.length ?? 0})
			</Title>
			<ProgressIndicator
				total={allTasks?.length ?? 0}
				completed={completedTasks?.length}
			/>
			<Descriptions
				items={[
					{
						label: "Tổng số công việc",
						children: team?.tasks?.length,
					},
					{
						label: "Công việc chưa làm",
						children: team?.tasks?.filter((e) => e.status === TaskStatus.new)
							?.length,
					},
					{
						label: "Công việc đang làm",
						children: team?.tasks?.filter(
							(e) => e.status === TaskStatus.inProgress
						)?.length,
					},
					{
						label: "Công việc đã hoàn thành",
						children: team?.tasks?.filter(
							(e) => e.status === TaskStatus.completed
						)?.length,
					},
					{
						label: "Công việc đã quá hạn",
						children: team?.tasks?.filter((e) =>
							moment(e.endTime).isBefore(now())
						)?.length,
					},
				]}
			/>
		</Card>
	);
};
