import { Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import TeamApi from "../../../apis/team";
import { ProjectReportList } from "./components/ProjectReportList";
const { Title } = Typography;

const ProjectReportListPage = () => {
	const [loading, setLoading] = useState(false);
	const [teams, setTeams] = useState([]);

	const getProjectTeams = async () => {
		setLoading(true);
		const list = await TeamApi.getProjectTeamsByTeacher();
		setTeams(list);
		setLoading(false);
	};

	useEffect(() => {
		getProjectTeams();
	}, []);

	return (
		<div>
			<Title level={5}>Danh sách nhóm</Title>
			<Spin spinning={loading}>
				<ProjectReportList teams={teams} />
			</Spin>
		</div>
	);
};

export default ProjectReportListPage;
