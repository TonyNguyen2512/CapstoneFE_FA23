import { CornerUpRight } from "@icon-park/react";
import { Card, Row, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export const ProjectItem = ({ project }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(project.projectId);
	};

	return (
		<Card className="w-full" hoverable onClick={handleClick}>
			<Row justify="space-between" align="middle">
				<Title ellipsis style={{ margin: 0 }} level={5}>
					{project.projectName}
				</Title>
				<CornerUpRight size={18} />
			</Row>
		</Card>
	);
};
