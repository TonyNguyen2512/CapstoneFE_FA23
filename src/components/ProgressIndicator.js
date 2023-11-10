import { Progress } from "antd";
import React from "react";
import styles from './style.css';

export const ProgressIndicator = ({ total, completed, notCompleted, inprocess, expireDate }) => {
	const calculatePercentage = () => {
		return Math.round((completed / total) * 100);
	};

	const strokeColor = () => {
		
		return ;
	};

	return <Progress percent={100} style={{"--minCustom" : 170}} className={styles.progress} format={() => ""} steps={total} strokeColor={['#29CB00', '#CB7A00', '#FF0000']}/>;
};
