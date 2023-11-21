import React, { useContext, useEffect, useRef, useState } from "react";
import BaseModal from "../../../BaseModal";
import { EditableInput } from "../../../EditableInput";
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select, Typography, Upload } from "antd";
import { EditableRichText } from "../../../EditableRichText";
import { UserContext } from "../../../../providers/user";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { attitudeTaskOptions, qualityTaskOptions, taskStatusOptions } from "../../../../constants/app";
import { TaskStatus } from "../../../../constants/enum";
import { TaskContext } from "../../../../providers/task";
import { RichTextEditor } from "../../../RichTextEditor";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { imagesRef } from "../../../../middleware/firebase";

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
	const titleRef = useRef();
	const contentRef = useRef();

	// const { task } = useContext(TaskContext);
	const { user } = useContext(UserContext);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [resourceImage, setResourceImage] = useState(task?.report?.resource ?? "");

	const isLeader = user?.userId === task?.leader?.id;
	const ownedTask =
		task?.members.find((e) => e.id === user?.userId) !== undefined;

	const isPending = task?.status === TaskStatus.pending;
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
		const title = values.title;
		const content = values.content;
		const resource = [values.resource];

		const data = {
			id,
			name,
			startTime,
			endTime,
			description,
			status,
			assignees,
		};

		if (isPending) {
			data = {
				title,
				content,
				resource,
				acceptanceTaskId: id
			}
		}

		await onSubmit(data);
	};

	const handleUploadImage = (event) => {
		setLoading(true);
		const file = event.file;
		const fileName = event.file?.name;
		const uploadTask = uploadBytesResumable(ref(imagesRef, fileName), file);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
				// update progress
				setProgress(percent);
			},
			(err) => {
				console.log(err);
				setLoading(false);
			},
			() => {
				setProgress(0);
				// download url
				getDownloadURL(uploadTask.snapshot.ref).then((url) => {
					taskFormRef.current.setFieldValue("resource", url);
					setResourceImage(url);
				});
			}
		);
		setLoading(false);
	};

	useEffect(() => {
		nameRef.current = task?.name;
		descRef.current = task?.description;
		contentRef.current = task?.report?.content;
	}, []);

	return (
		<BaseModal
			width={(isPending || isCompleted) ? "90%" : "50%"}
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
					title: task?.report?.title,
					content: task?.report?.content,
					resource: task?.report?.resource,
				}}
				onFinish={onFinish}
				layout="vertical"
			>
				<Row gutter={16}>
					<Col span={(isPending || isCompleted) ? 12 : 24}>
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
					{(isPending || isCompleted) &&
						<Col span={12} >
							<Card
								bodyStyle={{
									padding: 0,
									paddingTop: 12,
									paddingLeft: 12,
									paddingRight: 12,
									paddingBottom: 12,
								}}
								title="Đánh giá công việc"
							>
								<Form.Item
									name="title"
									rules={[
										{
											required: true,
											message: "Vui lòng thêm tên đánh giá",
										},
									]}
									label={<Text strong>Tên đánh giá</Text>}
								>
									{isCompleted &&
										<EditableRichText
											value={task?.reports?.title}
											editable={false}
										/>
									}
									{isPending &&
										<Input
											showCount
											maxLength={255}
											placeholder="Nhập tên đánh giá..."
											disabled={isCompleted}
										/>
									}
								</Form.Item>
								<Form.Item
									name="content"
									label={<Text strong>Nội dung đánh giá</Text>}
									rules={[
										{
											required: true,
											message: "Vui lòng thêm nội dung đánh giá",
										},
									]}
								>
									{isCompleted &&
										<EditableRichText
											value={task?.reports?.content}
											editable={false}
										/>
									}
									{isPending &&
										<RichTextEditor
											onChange={(value) => (contentRef.current = value)}
											placeholder="Nhập nội dung đánh giá..."
										/>
									}
								</Form.Item>
								<Form.Item
									name="resource"
									label={<Text strong>Tải ảnh</Text>}
								>
									<Upload
										listType="picture"
										beforeUpload={() => false}
										accept=".jpg,.jepg,.png,.svg,.bmp"
										onChange={handleUploadImage}
										maxCount={1}
									>
										<Button
											disabled={isCompleted}
											icon={<UploadOutlined />}>
											Upload
										</Button>
									</Upload>
								</Form.Item>
							</Card>
						</Col>
					}
				</Row>
			</Form>
		</BaseModal >
	);
};

export default TaskDetailModal;
