import { Form, Input } from "antd";
import React, { useRef } from "react";
import BaseModal from "../../../components/BaseModal";

export const CourseFormModal = ({
	title,
	course,
	open,
	onCancel,
	onSubmit,
	confirmLoading,
}) => {
	const formRef = useRef();

	const onFinish = (values) => {
		onSubmit({ ...values, courseId: course?.courseId });
	};

	return (
		<BaseModal
			title={title}
			open={open}
			onCancel={onCancel}
			onOk={() => formRef.current.submit()}
			confirmLoading={confirmLoading}
		>
			<Form
				ref={formRef}
				layout="vertical"
				initialValues={{
					code: course?.courseCode,
					name: course?.courseName,
				}}
				onFinish={onFinish}
			>
				<Form.Item
					name="code"
					label="Mã môn học"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập mã môn học",
						},
					]}
				>
					<Input placeholder="Mã môn học..." />
				</Form.Item>
				<Form.Item
					name="name"
					label="Tên môn học"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập tên môn học",
						},
					]}
				>
					<Input placeholder="Tên môn học..." />
				</Form.Item>
			</Form>
		</BaseModal>
	);
};
