import { Row, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { ClassSelect } from "../../project/components/ClassSelect";
import { useSearchParams } from "react-router-dom";
import TeamApi from "../../../apis/team";
import { ProjectTeamList } from "./components/ProjectTeamList";

const { Title } = Typography;

export const TeamListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(false);

	const getJoinedTeams = async () => {
		const classId = searchParams.get("class");
		if (!classId) return;
		setLoading(true);
		const data = await TeamApi.getJoinedProjectTeams(classId);
		setTeams(data);
		setLoading(false);
	};

	useEffect(() => {
		getJoinedTeams();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<div>
			<Row align="middle">
				<span className="mr-2">Lớp học:</span>
				<ClassSelect
					onLoaded={(classes) => {
						if (classes !== undefined && classes.length > 0) {
							searchParams.set("class", classes[0].classId);
							setSearchParams(searchParams);
						}
					}}
					onChange={(classId) => {
						searchParams.set("class", classId);
						setSearchParams(searchParams);
					}}
					value={searchParams.get("class")}
				/>
			</Row>
			<Row className="mt-4">
				<Title level={4}>Nhóm đã tham gia</Title>
			</Row>
			<Spin spinning={loading}>
				<ProjectTeamList teams={teams} />
			</Spin>
		</div>
	);
};
