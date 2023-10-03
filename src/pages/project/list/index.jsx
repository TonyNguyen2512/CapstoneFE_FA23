import { Col, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProjectApi from "../../../apis/project";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import { ClassSelect } from "../components/ClassSelect";
import { ProjectList } from "./components/ProjectList";

const ProjectListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const permissions = usePermissions();
	const canView = permissions?.includes(ALL_PERMISSIONS.project.view);

	const [projects, setProjects] = useState([]);
	const [projectLoading, setProjectLoading] = useState(false);

  const handleChangeClass = (classId) => {
    setSearchParams({
      class: classId,
    });
  };

  const onClassesLoaded = (data) => {
    if (data && data.length > 0) {
      searchParams.set("class", data[0].classId);
      setSearchParams(searchParams);
    }
  };

  const getProjects = async () => {
    const classId = searchParams.get("class");
    if (!classId) return;

		setProjectLoading(true);
		const data = await ProjectApi.getWorkingProjects(classId);
		setProjects(data);
		setProjectLoading(false);
	};

	useEffect(() => {
		getProjects();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<div>
			<Row justify="space-between">
				<Col span={18}>
					{canView && (
						<Row align="middle">
							<span className="mr-2">Lớp:</span>
							<ClassSelect
								value={searchParams.get("class")}
								onChange={handleChangeClass}
								onLoaded={onClassesLoaded}
							/>
						</Row>
					)}
				</Col>
			</Row>
			{canView && (
				<div>
					<Spin spinning={projectLoading}>
						<ProjectList projects={projects} />
					</Spin>
				</div>
			)}
		</div>
	);
};

export default ProjectListPage;
