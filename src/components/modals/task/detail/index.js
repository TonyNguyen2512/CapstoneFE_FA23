import React, { useContext, useEffect, useRef } from "react";
import BaseModal from "../../../BaseModal";
import { EditableInput } from "../../../EditableInput";
import { Card, Col, DatePicker, Form, InputNumber, Row, Select, Typography } from "antd";
import { EditableRichText } from "../../../EditableRichText";
import { UserContext } from "../../../../providers/user";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { attitudeTaskOptions, qualityTaskOptions, taskStatusOptions } from "../../../../constants/app";
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
	task,
	dataGroupMembers,
}) => {
	const taskFormRef = useRef();
	const nameRef = useRef();
	const descRef = useRef();

	console.log("task dataGroupMembers", task?.members)

	// const { task } = useContext(TaskContext);
	const { user } = useContext(UserContext);

	const isLeader = user?.userId === task?.leader?.id;
	const ownedTask =
		task?.members.find((e) => e.id === user?.userId) !== undefined;

	const isInEvaluete = task?.status === TaskStatus.inEvaluete;
	const isCompleted = task?.status === TaskStatus.completed;

	const onFinish = async (values) => {
		const dates = values.dates;
		const id = task?.id;
		const startTime = dates?.[0];
		const endTime = dates?.[1];
		const name = nameRef.current;
		const description = descRef.current;
		const status = values.status;
		const assignees = values.assignees;

		const data = {
			id,
			name,
			startTime,
			endTime,
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
			width={(isInEvaluete || isCompleted) ? "70%" : "50%"}
			title="Thông tin công việc"
			open={open}
			onCancel={onCancel}
			okText="Lưu"
			onOk={() => taskFormRef.current?.submit()}
			confirmLoading={confirmLoading}
			okButtonProps={{ style: { display: isCompleted ? 'none' : '' } }}
		>
			<Form
				ref={taskFormRef}
				initialValues={{
					taskName: task?.name,
					description: task?.description,
					dates: [dayjs(task?.startTime), dayjs(task?.endTime)],
					assignees: task?.members?.map((e) => e.memberId),
					status: task?.status,
					priority: task?.priority,
					qualityTask: task?.evaluete?.qualityTask,
					attitudeTask: task?.evaluete?.attitude,
				}}
				onFinish={onFinish}
				layout="vertical"
			>
				<Row gutter={16}>
					<Col span={(isInEvaluete || isCompleted) ? 16 : 24}>
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
								editable={isLeader && !isCompleted}
							/>
							<div className="mt-4 ml-1 mb-1">
								<Text strong>Mô tả</Text>
							</div>
							<EditableRichText
								onChange={(v) => (descRef.current = v)}
								value={task?.description}
								editable={isLeader && !isCompleted}
							/>
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item
										name="dates"
										label={<Text strong>Thời hạn công việc</Text>}
									>
										<DatePicker.RangePicker
											showNow
											showTime
											placeholder={["Bắt đầu", "Kết thúc"]}
											className="w-full"
											format="HH:mm DD/MM/YYYY"
											disabled={!isLeader || isCompleted}
										/>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										name="status"
										label={<Text strong>Trạng thái</Text>}
									>
										<Select
											className="w-full"
											placeholder="Chọn trạng thái"
											options={taskStatusOptions}
											defaultValue={TaskStatus.new}
											disabled={!isLeader || isCompleted}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item
										name="assignees"
										rules={[
											{
												required: true,
												message: "Vui lòng chọn ít nhất 1 thành viên cho công việc",
											},
										]}
										label={<Text strong>Thành viên được phân công</Text>}
									>
										<Select
											mode="multiple"
											className="w-full"
											placeholder="Chọn thành viên"
											options={dataGroupMembers?.map((e) => {
												return {
													label: `${e.fullName}`,
													value: e.id,
												};
											})}
											disabled={!isLeader || isCompleted}
										/>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										name="priority"
										label={<Text strong>Độ ưu tiên</Text>}
										rules={[
											{
												required: true,
												message: "Vui lòng thêm độ ưu tiên",
											},
										]}
									>
										<InputNumber
											min={0}
											max={10}
											placeholder="Độ ưu tiên"
											disabled={!isLeader || isCompleted}
										/>
									</Form.Item>
								</Col>
							</Row>
						</Card>
					</Col>
					{(isInEvaluete || isCompleted) &&
						<Col span={8} >
							<Card
								bodyStyle={{
									padding: 0,
									paddingTop: 12,
									paddingLeft: 12,
									paddingRight: 12,
									paddingBottom: 12,
								}}
								title="Đánh giá công nhân"
							>
								<Form.Item
									name="qualityTask"
									rules={[
										{
											required: true,
											message: "Vui lòng chọn ít nhất 1 thành viên cho công việc",
										},
									]}
									label={<Text strong>Chất lượng công việc</Text>}
								>
									<Select
										className="w-full"
										placeholder="Chất lượng công việc"
										options={qualityTaskOptions}
										disabled={!isLeader || isCompleted}
									/>
								</Form.Item>
								<Form.Item
									name="attitudeTask"
									label={<Text strong>Độ ưu tiên</Text>}
									rules={[
										{
											required: true,
											message: "Vui lòng chọn thái độ làm việc",
										},
									]}
								>
									<Select
										className="w-full"
										placeholder="Thái độ làm việc"
										options={attitudeTaskOptions}
										disabled={!isLeader || isCompleted}
									/>
								</Form.Item>
							</Card>
						</Col>
					}
				</Row>
			</Form>
		</BaseModal>
	);
};

export default TaskDetailModal;
