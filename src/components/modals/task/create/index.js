import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import React, { useContext, useRef } from "react";
import { TaskStatus } from "../../../../constants/enum";
import { TeamContext } from "../../../../providers/team";
import { UserContext } from "../../../../providers/user";
import BaseModal from "../../../BaseModal";
import { RichTextEditor } from "../../../RichTextEditor";
import locale from "antd/es/date-picker/locale/vi_VN";
import { taskStatusOptions } from "../../../../constants/app";

export const TaskCreateModal = ({
	open,
	onCancel,
	onSubmit,
	confirmLoading,
}) => {
	const { user } = useContext(UserContext);
	const { team } = useContext(TeamContext);

	const isLeader = user?.userId === team?.leader?.id;

	const formRef = useRef();
	const descRef = useRef();

	return (
		<BaseModal
			open={open}
			onCancel={onCancel}
			title="Thêm công việc"
			onOk={() => formRef.current.submit()}
			confirmLoading={confirmLoading}
			width="50%"
		>
			<Form
				ref={formRef}
				layout="vertical"
				onFinish={async (values) => {
					const dates = values.dates;
					const startTime = dates?.[0];
					const endTime = dates?.[1];
					await onSubmit({
						...values,
						taskDescription: descRef.current,
						startTime: new Date(startTime),
						endTime: new Date(endTime),
					});
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
					<Input
						showCount
						maxLength={255}
						placeholder="Nhập tên công việc..."
					/>
				</Form.Item>
				<Form.Item label="Mô tả công việc">
					<RichTextEditor
						onChange={(value) => (descRef.current = value)}
						placeholder="Nhập mô tả công việc..."
					/>
				</Form.Item>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name="dates" label="Thời hạn công việc">
							<DatePicker.RangePicker
								className="w-full"
								placeholder={["Bắt đầu", "Kết thúc"]}
								format="HH:mm DD/MM/YYYY"
								showTime={{
									format: "HH:mm",
								}}
								locale={locale}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="status" label="Trạng thái">
							<Select
								defaultValue={TaskStatus.new}
								options={taskStatusOptions}
								placeholder="Chọn trạng thái"
							/>
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					name="assignees"
					label="Thành viên được phân công"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn ít nhất 1 thành viên để phân công",
						},
					]}
				>
					<Select
						options={team?.members?.map((e) => {
							const isLeader = team?.leader?.id === e.id;
							return {
								label: `${e.fullName}${isLeader ? " (Trưởng nhóm)" : ""}`,
								value: e.id,
							};
						})}
						mode="multiple"
						placeholder="Chọn thành viên"
					/>
				</Form.Item>
			</Form>
		</BaseModal>
	);
};
