import React, { useContext, useEffect, useRef, useState } from "react";
import BaseModal from "../../../BaseModal";
import { EditableInput } from "../../../EditableInput";
import { Button, Card, Col, DatePicker, Form, Image, Input, InputNumber, Row, Select, Typography } from "antd";
import { EditableRichText } from "../../../EditableRichText";
import { UserContext } from "../../../../providers/user";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { WTaskStatusOptions } from "../../../../constants/app";
import { ErrorImage, ETaskStatus, TaskStatus } from "../../../../constants/enum";
import { TaskContext } from "../../../../providers/task";
import { RichTextEditor } from "../../../RichTextEditor";
import { UploadOutlined } from "@ant-design/icons";
import { taskFeedbackReportsRef, workerTaskReportsRef } from "../../../../middleware/firebase";
import { UploadFile } from "../../../UploadFile";

dayjs.extend(weekday);
dayjs.extend(localeData);

const { Text } = Typography;

const TaskDetailModal = ({
	open,
	onCancel,
	onSubmit,
	confirmLoading,
	task,
}) => {
	const taskFormRef = useRef();
	const nameRef = useRef();
	const descRef = useRef();
	const contentRef = useRef();

	const { user } = useContext(UserContext);
	const { team, info } = useContext(TaskContext);

	const [resourceImage] = useState(task?.resource?.[0] ?? "");
	const [resourceErrorMsg, setResourceErrorMsg] = useState("");
	// const [fileListUrl, setFileListUrl] = useState([]);

	const isLeader = user?.userId === task?.leader?.id;
	// const ownedTask =
	// 	task?.members?.find((e) => e.id === user?.userId) !== undefined;

	const isPending = task?.status === TaskStatus.Pending;
	const isCompleted = task?.status === TaskStatus.Completed;

	const onFinish = async (values) => {

		const resourceImg = taskFormRef.current.getFieldValue('resource');
		if (handleValidateUpload()) {
			const dates = values.dates;
			const id = task?.id;
			const startTime = dates?.[0];
			const endTime = dates?.[1];
			const name = nameRef.current;
			const description = descRef.current;
			const status = values.status;
			const assignees = values.assignees;
			const feedbackTitle = values.feedbackTitle;
			const feedbackContent = values.feedbackContent;
			const resource = [resourceImg];

			let data = {
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
					workerTaskId: id,
					status,
					feedbackTitle,
					feedbackContent,
					resource,
				}
			}

			await onSubmit(data);
		}
	};

	const handleValidateUpload = () => {
		if (isPending) {
			const resource = taskFormRef.current?.getFieldValue('resource');
			if (!resource || resource.length === 0) {
				setResourceErrorMsg("Vui lòng thêm ảnh báo cáo");
				return false;
			} else {
				setResourceErrorMsg("");
				return true;
			}
		} else {
			setResourceErrorMsg("");
			return true;
		}
	}

	const handleChangeUploadImage = (info) => {
		// console.log('handleChange', info);
		// if (info.file.status === 'uploading') {
		// 	console.log('setting loading to true');
		// 	// this.setState({ loading: true });
		// 	setLoading(true);
		// 	// return;
		// }
		// if (info.file.status === 'done') {
		// 	console.log('setting loading to false');
		// 	setLoading(false);
		// }
		setResourceErrorMsg("");
	};

	useEffect(() => {
		nameRef.current = task?.name;
		descRef.current = task?.description;
		contentRef.current = task?.feedbackContent;
	}, [task]);

	return (
		<BaseModal
			width={(isPending || isCompleted) ? "90%" : "50%"}
			title="Thông tin công việc"
			open={open}
			onCancel={() => {
				setResourceErrorMsg("");
				onCancel();
			}}
			okText="Lưu"
			onOk={() => {
				isPending && handleValidateUpload();
				taskFormRef.current?.submit();
			}}
			confirmLoading={confirmLoading}
			okButtonProps={{ style: { display: isCompleted ? 'none' : '' } }}
		>
			<Form
				ref={taskFormRef}
				initialValues={{
					description: task?.description,
					dates: [task?.startTime ? dayjs(task?.startTime) : "", task?.startTime ? dayjs(task?.endTime) : ""],
					assignees: task?.members?.map((e) => e.memberId),
					status: task?.status || ETaskStatus.New,
					...task,
					resource: task?.resource?.[0],
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
										rules={[
										  {
											required: true,
											message: "Vui lòng nhập thời hạn công việc",
										  },
										]}
									>
										<DatePicker.RangePicker
											showNow
											showTime
											placeholder={["Bắt đầu", "Kết thúc"]}
											className="w-full"
											format="HH:mm DD/MM/YYYY"
											rang
											disabled={!isLeader || isCompleted}
											disabledDate={(date) => {
												return (
													date.isBefore(info.startTime, "day")
												);
											}}
										/>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										name="status"
										label={<Text strong>Trạng thái</Text>}
										rules={[
										  {
											required: true,
											message: "Vui lòng nhập trạng thái",
										  },
										]}
									>
										<Select
											className="w-full"
											placeholder="Chọn trạng thái"
											options={WTaskStatusOptions}
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
											options={team?.map((e) => {
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
							{(isPending || isCompleted) &&
								<Row gutter={[16, 16]}>
									<Col span={24}>
										<Text strong>Tệp đính kèm</Text>
									</Col>
									<Col span={24}>
										<Row gutter={[16, 16]}>
											{task?.resource?.map((x) => (
												<Col span={3}>
													<Image src={x} fallback={ErrorImage} width="100%" />
												</Col>
											))}
											{task?.resource?.length === 0 &&
												<Col>
													<Text>&nbsp;Không có</Text>
												</Col>
											}
										</Row>
									</Col>
								</Row>
							}
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
									name="feedbackTitle"
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
											value={task?.feedbackTitle}
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
									name="feedbackContent"
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
											value={task?.feedbackContent}
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
								<UploadFile
									formRef={taskFormRef}
									imageRef={taskFeedbackReportsRef}
									itemName="resource"
									onChange={handleChangeUploadImage}
									fileAccept=".jpg,.jepg,.png,.svg,.bmp"
									errorMessage={resourceErrorMsg}
								>
									{resourceImage ? <img src={resourceImage} alt="avatar" style={{ width: '100%' }} /> : <></>}
									{isPending ? (
										<Button
											disabled={isCompleted}
											icon={<UploadOutlined />}>
											Upload
										</Button>
									) : <></>
									}
								</UploadFile>
							</Card>
						</Col>
					}
				</Row>
			</Form>
		</BaseModal >
	);
};

export default TaskDetailModal;
