import React from "react";
import { ArrowLeft } from "@icon-park/react";
import { Button, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export const BasePageContent = ({ children, onBack, title, action }) => {
	const navigate = useNavigate();
	return (
		<div>
			<Row align="middle" justify="space-between">
				<Row align="middle">
					<Button
						className="flex-center mr-2"
						icon={<ArrowLeft size={24} />}
						type="text"
						onClick={onBack ? onBack : () => navigate(-1)}
					/>
					<Title level={4} style={{ margin: 0 }} ellipsis>
						{title}
					</Title>
				</Row>
				{action}
			</Row>
			{children}
		</div>
	);
};
