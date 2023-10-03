import { Send } from "@icon-park/react";
import { Button, Descriptions, Drawer, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useContext, useRef } from "react";
import { TeamContext } from "../../../../providers/team";

export const SubmitReportDrawer = ({
	open,
	onCancel,
	onSubmit,
	confirmLoading,
	period,
}) => {
	const { team } = useContext(TeamContext);
	const formRef = useRef();

	return (
		<Drawer
			title="Nộp báo cáo"
			placement="right"
			size="large"
			open={open}
			onClose={onCancel}
			maskClosable={false}
			afterOpenChange={(isOpen) => {
				if (!isOpen) {
					formRef.current?.resetFields();
				}
			}}
		>
			<Descriptions
				items={[
					{
						label: "Sinh viên báo cáo",
						children: team?.leader?.fullName ?? "N/A",
					},
				]}
			/>
			<Descriptions
				items={[
					{
						label: "Giáo viên nhận báo cáo",
						children: team?.instructor?.fullName,
					},
				]}
			/>
			<Form
				ref={formRef}
				layout="vertical"
				onFinish={async (values) => {
					await onSubmit({ ...values, period: period });
				}}
			>
				<Form.Item
					name="title"
					label="Tiêu đề"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập tiêu đề",
						},
					]}
				>
					<Input placeholder="Nhập tiêu đề..." />
				</Form.Item>
				<Form.Item
					name="overviewReport"
					label="Báo cáo chung"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập nội dung báo cáo",
						},
					]}
				>
					<TextArea placeholder="Báo cáo tổng quan về tiến độ của nhóm..." />
				</Form.Item>
				<Form.Item
					name="doneReport"
					label="Công việc đã làm"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập công việc đã làm",
						},
					]}
				>
					<TextArea placeholder="Những công việc nhóm đã đạt được..." />
				</Form.Item>
				<Form.Item
					name="doingReport"
					label="Công việc đang làm"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập công việc đang làm",
						},
					]}
				>
					<TextArea placeholder="Những công việc nhóm đang làm..." />
				</Form.Item>
				<Form.Item name="todoReport" label="Công việc dự định làm">
					<TextArea placeholder="Những công việc nhóm đang làm..." />
				</Form.Item>

				<Button
					loading={confirmLoading}
					icon={<Send />}
					className="flex-center"
					htmlType="submit"
					type="primary"
				>
					Gửi báo cáo
				</Button>
			</Form>
		</Drawer>
	);
};
