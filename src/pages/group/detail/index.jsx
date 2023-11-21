import { Spin } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TeamApi from "../../../apis/group";
import { BasePageContent } from "../../../layouts/containers/BasePageContent";
import { UserContext } from "../../../providers/user";

const GroupDetailPage = () => {
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
		<p></p>
	);
};

export default GroupDetailPage;
