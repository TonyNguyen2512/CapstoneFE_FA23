import React from "react";
import { Modal, Typography } from "antd";
import { RawHtml } from "../../../components/RawHtml";

const { Title, Text } = Typography;

export const ProjectDescriptionModal = ({ open, project, onCancel }) => {
	return (
		<Modal
			maskClosable={false}
			footer={null}
			onCancel={onCancel}
			open={open}
			destroyOnClose
		>
			<Title level={5}>Dự án:</Title>
			<Text>{project?.projectName}</Text>
			<Title level={5}>Mô tả:</Title>
			<RawHtml html={project?.description} />
		</Modal>
	);
};
