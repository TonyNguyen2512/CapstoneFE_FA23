import { Spin } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TeamApi from "../../../apis/group";
import { BasePageContent } from "../../../layouts/containers/BasePageContent";
import { TeamProvider } from "../../../providers/team";
import { TeamBasicInfo } from "./components/TeamBasicInfo";
import { TeamProjectInfo } from "./components/TeamProjectInfo";
import { TeamTaskManagement } from "./components/TeamTaskManagement";
import { UserContext } from "../../../providers/user";
import { TeamProgressOverview } from "./components/TeamProgressOverview";

const TeamDetailPage = () => {
	const { id } = useParams();
	const { user } = useContext(UserContext);

	const [team, setTeam] = useState();
	const [loading, setLoading] = useState(false);

	const isLeader = user?.userId === team?.leader?.id;

	const allTasks = useRef();

	const getTeam = async (teamId, handleLoading) => {
		if (handleLoading) {
			setLoading(true);
		}
		const data = await TeamApi.getJoinedProjectTeamById(teamId);
		allTasks.current = data?.tasks;
		setTeam(data);
		if (handleLoading) {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (id) {
			getTeam(id, true);
		}
	}, [id]);

	return (
		<Spin spinning={loading}>
			<TeamProvider
				team={team}
				onReload={(handleLoading) => {
					getTeam(id, handleLoading);
				}}
				onFilterTask={(memberId) => {
					console.log("filter task: ", memberId);
					if (memberId) {
						const newTeam = { ...team };
						newTeam.tasks = allTasks.current.filter(
							(e) => e?.members?.find((x) => x.id === memberId) !== undefined
						);
						setTeam(newTeam);
					} else {
						const newTeam = { ...team };
						newTeam.tasks = allTasks.current;
						setTeam(newTeam);
					}
				}}
			>
				<BasePageContent title="Nhóm của tôi">
					<div className="mt-2">
						<TeamProjectInfo />
					</div>
					<div className="mt-4">
						<TeamBasicInfo />
					</div>
					{isLeader && (
						<div className="mt-4">
							<TeamProgressOverview />
						</div>
					)}
					<div className="mt-4">
						<TeamTaskManagement />
					</div>
				</BasePageContent>
			</TeamProvider>
		</Spin>
	);
};

export default TeamDetailPage;
