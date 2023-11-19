import React, { useContext, useEffect, useRef } from "react";
import BaseModal from "../../../BaseModal";
import { EditableInput } from "../../../EditableInput";
import { Card, Col, DatePicker, Form, Row, Select, Typography } from "antd";
import { EditableRichText } from "../../../EditableRichText";
import { UserContext } from "../../../../providers/user";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { taskStatusOptions } from "../../../../constants/app";
import { TaskStatus } from "../../../../constants/enum";
import { TaskContext } from "../../../../providers/task";

dayjs.extend(weekday);
dayjs.extend(localeData);

const { Text } = Typography;

const TaskDetailModal = ({
	open,
	onCancel,
	onSubmit,
	confirmLoading,
}) => {
	const formRef = useRef();
	const nameRef = useRef();
	const descRef = useRef();

	const { task } = useContext(TaskContext);
	const { user } = useContext(UserContext);

	const isLeader = user?.userId === task?.leader?.id;
	const ownedTask =
		task?.members.find((e) => e.id === user?.userId) !== undefined;

	const onFinish = async (values) => {
		const dates = values.dates;
		const taskId = task?.id;
		const startTime = dates?.[0];
		const endTime = dates?.[1];
		const taskName = nameRef.current;
		const description = descRef.current;
		const status = values.status;
		const assignees = values.assignees;

		const data = {
			taskId,
			startTime,
			endTime,
			taskName,
			description,
			status,
			assignees,
		};

		await onSubmit(data);
	};

	useEffect(() => {
		nameRef.current = task?.name;
		descRef.current = task?.description;
	}, [task]);

	return (
		<BaseModal
			width="70%"
			title="Thông tin công việc"
			open={open}
			onCancel={onCancel}
			okText="Lưu"
			onOk={() => formRef.current?.submit()}
			confirmLoading={confirmLoading}
		>
			<Form
				ref={formRef}
				initialValues={{
					taskName: task?.name,
					description: task?.description,
					dates: [dayjs(task?.startTime), dayjs(task?.endTime)],
					assignees: task?.members?.map((e) => e.id),
					status: task?.status,
				}}
				onFinish={onFinish}
			>
				<Row gutter={16}>
					<Col span={15}>
						<Card
							bodyStyle={{
								padding: 0,
								paddingLeft: 8,
								paddingTop: 12,
								paddingRight: 8,
								paddingBottom: 16,
							}}
						>
							<div className="ml-1 mb-1">
								<Text strong>Tiêu đề</Text>
							</div>
							<EditableInput
								placeholder="Tên công việc"
								value={task?.name}
								onChange={(value) => (nameRef.current = value)}
								editable={isLeader}
							/>
							<div className="mt-4 ml-1 mb-1">
								<Text strong>Mô tả</Text>
							</div>
							<EditableRichText
								onChange={(v) => (descRef.current = v)}
								value={task?.description}
								editable={isLeader}
							/>
							<div className="mt-4 ml-1 mb-1">
								<Text strong>Thời hạn</Text>
							</div>
							<Form.Item name="dates">
								<DatePicker.RangePicker
									showNow
									showTime
									placeholder={["Bắt đầu", "Kết thúc"]}
									disabled={!isLeader}
									className="w-full"
									format="HH:mm DD/MM/YYYY"
								/>
							</Form.Item>
						</Card>
					</Col>
					<Col span={9}>
						<Card
							bodyStyle={{
								padding: 0,
								paddingTop: 12,
								paddingLeft: 12,
								paddingRight: 12,
								paddingBottom: 12,
							}}
						>
							<div className="mb-2">
								<Text strong>Thành viên đang làm</Text>
							</div>
							<Form.Item
								name="assignees"
								rules={[
									{
										required: true,
										message: "Vui lòng chọn ít nhất 1 thành viên cho công việc",
									},
								]}
							>
								<Select
									mode="multiple"
									className="w-full"
									placeholder="Chọn thành viên"
									options={task?.members?.map((e) => {
										return {
											label: e.fullName,
											value: e.id,
										};
									})}
									disabled={!isLeader}
								/>
							</Form.Item>
							<div className="mb-2">
								<Text strong>Trạng thái</Text>
							</div>
							<Form.Item name="status">
								<Select
									className="w-full"
									placeholder="Chọn trạng thái"
									options={taskStatusOptions}
									defaultValue={TaskStatus.new}
									disabled={isLeader ? false : ownedTask ? false : true}
								/>
							</Form.Item>
						</Card>
					</Col>
				</Row>
			</Form>
		</BaseModal>
	);
};

export default TaskDetailModal;
