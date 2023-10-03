import { Form, Input, Typography } from "antd";
import React, { useEffect, useRef } from "react";
import BaseModal from "../../../components/BaseModal";
import { RichTextEditor } from "../../../components/RichTextEditor";
import TextArea from "antd/es/input/TextArea";

const { Text, Title } = Typography;

export const ProjectDetailModal = ({
	open,
	title,
	project,
	submitting,
	onCancel,
	onSubmit,
	edit,
}) => {
	const formRef = useRef();
	const descRef = useRef();

	useEffect(() => {
		const desc = project?.description;
		if (desc) {
			descRef.current = desc;
		}
	}, [project]);

	const handleSubmit = async (values) => {
		const { name, classId, functionalReq, nonfunctionalReq } = values;
		const data = {
			classId: classId,
			projectName: name,
			description: descRef.current,
			projectId: project?.projectId,
			functionalReq,
			nonfunctionalReq,
		};

		onSubmit && (await onSubmit(data));

		onCancel();
	};

	return (
		<BaseModal
			title={title}
			open={open}
			confirmLoading={submitting}
			onCancel={onCancel}
			onOk={() => formRef.current?.submit()}
		>
			<Form
				ref={formRef}
				layout="vertical"
				onFinish={handleSubmit}
				initialValues={{
					name: project?.name,
					description: project?.description,
					functionalReq: project?.functionalReq,
					nonfunctionalReq: project?.nonfunctionalReq,
					classId: project?.classID,
				}}
			>
				<Form.Item
					name="name"
					label="Tên dự án"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập tên dự án",
						},
					]}
				>
					<Input placeholder="Nhập tên dự án..." />
				</Form.Item>
				<div style={{ marginBottom: 8 }}>
					<Text>Mô tả</Text>
				</div>
				<RichTextEditor
					value={project?.description}
					onChange={(value) => (descRef.current = value)}
					placeholder="Nhập mô tả dự án..."
				/>

				<div className="mt-6">
					<Title level={5}>Yêu cầu của dự án</Title>
				</div>
				<Form.Item name="functionalReq" label="Yêu cầu chức năng (Functional)">
					<TextArea placeholder="Nhập chi tiết yêu cầu..." />
				</Form.Item>
				<Form.Item
					name="nonfunctionalReq"
					label="Yêu cầu phi chức năng (Non-functional)"
				>
					<TextArea placeholder="Nhập chi tiết yêu cầu..." />
				</Form.Item>
			</Form>
		</BaseModal>
	);
};
