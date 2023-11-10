// import { Row, Col, Form, Input, Select, DatePicker } from "antd";
// import { useEffect, useRef, useState } from "react";
// import BaseModal from "../../../../../components/BaseModal";
// import { RichTextEditor } from "../../../../../components/RichTextEditor";


// const ProcedureStatus = {
// 	notCompleted: 2,
// 	completed: 1,
// 	new: 0,
// };

// const taskStatusOptions = [
// 	{
// 		value: ProcedureStatus.new,
// 		label: "Đang tiến hành",
// 	},
// 	{
// 		value: ProcedureStatus.notCompleted,
// 		label: "Không đạt",
// 	},
// 	{
// 		value: ProcedureStatus.completed,
// 		label: "Đạt",
// 	},
// ];

// export const WorkerTaskProcedureModal = ({
// 	open,
// 	onCancel,
// 	onSubmit,
// 	confirmLoading,
// 	dataSource,
// 	mode,
// }) => {
// 	// const { user } = useContext(UserContext);
// 	// const { team } = useContext(TeamContext);

// 	// const isLeader = user?.userId === team?.leader?.id;

// 	const [title, setTitle] = useState(false);
	
// 	// setTitle(`${mode === "1" ? "Thêm" : "Đánh giá"} báo cáo`);

// 	const [initialValues, setInitialValues] = useState();
// 	const [wkTaskProcedureform] = Form.useForm();

// 	const [loading, setLoading] = useState(false);

// 	const handleValue = (values) => {
// 		wkTaskProcedureform.setFieldsValue(values);
// 	};

// 	const onFinish = async (values) => {
// 		const data = {
// 			id: values.id,
// 			name: values.name,
// 			username: values.username,
// 			jobName: values.jobName,
// 			description: values.description,
// 			status: values.status,
// 			timeReport: values?.timeReport,
// 			isDeleted: values?.isDeleted
// 		}
// 		await onSubmit(data);
// 	};

// 	const handleTitle = (values) => {
// 		if (mode === "1") {
// 			setTitle("Thêm đánh giá báo cáo")
// 		} else {
// 			setTitle(`Đánh giá báo cáo ${values}`)
// 		}
// 	}

// 	useEffect(() => {
// 		const tasks = dataSource?.tasks;
// 		handleValue({
// 			id: tasks?.id,
// 			name: tasks?.name,
// 			username: tasks?.username,
// 			jobName: tasks?.jobName,
// 			description: tasks?.description,
// 			status: tasks?.status,
// 			timeReport: tasks?.timeReport,
// 		});
// 		handleTitle(dataSource?.name);
// 	}, [dataSource]);

// 	return (
// 		<BaseModal
// 			open={open}
// 			onCancel={() => {
// 				onCancel();
// 				wkTaskProcedureform.resetFields();
// 			}}
// 			title={title}
// 			onOk={() => {
// 				wkTaskProcedureform.current.submit();
// 			}}
// 			confirmLoading={confirmLoading}
// 			width="50%"
// 			okText="Gửi"
// 		>
// 			<Form
// 				form={wkTaskProcedureform}
// 				layout="vertical"
// 				onFinish={onFinish}
// 				initialValues={initialValues}
// 			>
// 				<Form.Item name="id" hidden>
// 					<Input />
// 				</Form.Item>
// 				<Form.Item
// 					name="name"
// 					label="Tên đơn hàng"
// 					rules={[
// 						{
// 							required: true,
// 							message: "Vui lòng nhập tên đơn hàng",
// 						},
// 					]}
// 				>
// 					<Input
// 						showCount
// 						maxLength={255}
// 						placeholder="Tên đơn hàng"
// 					/>
// 				</Form.Item>
// 				<Form.Item
// 					name="username"
// 					label="Tên quản lý"
// 					rules={[
// 						{
// 							required: true,
// 							message: "Vui lòng nhập tên quản lý",
// 						},
// 					]}
// 				>
// 					<Input
// 						showCount
// 						maxLength={255}
// 						placeholder="Tên quản lý"
// 					/>
// 				</Form.Item>
// 				<Form.Item
// 					name="jobName"
// 					label="Tên việc"
// 					rules={[
// 						{
// 							required: true,
// 							message: "Vui lòng nhập tên việc",
// 						},
// 					]}
// 				>
// 					<Input
// 						showCount
// 						maxLength={255}
// 						placeholder="Tên việc"
// 					/>
// 				</Form.Item>
// 				<Row gutter={16}>
// 					<Col span={12}>
// 						<Form.Item name="status" label="Đánh giá">
// 							<Select
// 								options={taskStatusOptions}
// 								placeholder="Đánh giá"
// 							/>
// 						</Form.Item>
// 					</Col>
// 				</Row>
// 				<Form.Item
// 					label="Mô tả"
// 					name="description"
// 				>
// 					<RichTextEditor
// 						placeholder="Mô tả"
// 					/>
// 				</Form.Item>
// 			</Form>
// 		</BaseModal>
// 	);
// };
