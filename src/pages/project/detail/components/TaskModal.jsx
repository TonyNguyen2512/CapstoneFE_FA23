import { Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useRef } from "react";
import BaseModal from "../../../../components/BaseModal";
import { TaskStatus } from "../../../../constants/enum";

export const TaskModal = ({
	open,
	onCancel,
	title,
	onSubmit,
	edit,
	task,
	confirmLoading,
}) => {
	const formRef = useRef();

	const statusOptions = [
		{
			value: TaskStatus.New,
			label: "Cần làm",
		},
		{
			value: TaskStatus.InProgress,
			label: "Đang làm",
		},
		{
			value: TaskStatus.Completed,
			label: "Đã hoàn thành",
		},
	];

	return (
		<BaseModal
			open={open}
			onCancel={onCancel}
			title={title}
			onOk={() => formRef.current?.submit()}
			confirmLoading={confirmLoading}
		>
			<Form
				ref={formRef}
				layout="vertical"
				onFinish={(values) => {
					onSubmit({ ...values, taskId: task?.taskId });
				}}
				initialValues={{
					taskName: task?.taskName,
					taskDescription: task?.taskDescription,
					status: task?.status,
				}}
			>
				<Form.Item
					name="taskName"
					label="Tên công việc"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập tên công việc",
						},
					]}
				>
					<Input placeholder="Nhập tên công việc..." />
				</Form.Item>
				<Form.Item name="taskDescription" label="Mô tả công việc">
					<TextArea placeholder="Nhập mô tả công việc..." />
				</Form.Item>
				{edit && (
					<Form.Item
						name="status"
						label="Trạng thái"
						rules={[
							{
								required: true,
								message: "Vui lòng chọn trạng thái",
							},
						]}
					>
						<Select options={statusOptions} />
					</Form.Item>
				)}
			</Form>
		</BaseModal>
	);
};
