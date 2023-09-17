import { Progress } from "antd";
import React from "react";

export const ProgressIndicator = ({ total, completed }) => {
	const calculatePercentage = () => {
		return Math.round((completed / total) * 100);
	};

	return <Progress percent={calculatePercentage()} />;
};
