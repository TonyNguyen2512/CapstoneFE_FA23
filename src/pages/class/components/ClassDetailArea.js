import { Down, Up } from "@icon-park/react";
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { Row, Typography, Collapse } from "antd";

const { Title } = Typography;

const Container = styled.div`
	cursor: pointer;
	transition: 0.3s;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const ClassDetailArea = ({ title, children, action }) => {
	const items = [
		{
			key: "COLLAPSE_AREA",
			label: <Title level={5}>{title}</Title>,
			children: children,
			extra: action,
		},
	];

	return <Collapse ghost items={items} defaultActiveKey="COLLAPSE_AREA" />;
};
