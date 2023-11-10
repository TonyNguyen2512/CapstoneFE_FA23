import { Row, Col, Form, Input, Select, DatePicker } from "antd";
import { useEffect, useRef, useState } from "react";
import BaseModal from "../../../../../components/BaseModal";
import { RichTextEditor } from "../../../../../components/RichTextEditor";


const ProcedureStatus = {
	notCompleted: 2,
	completed: 1,
	new: 0,
};

const taskStatusOptions = [
	{
		value: ProcedureStatus.new,
		label: "Đang tiến hành",
	},
	{
		value: ProcedureStatus.notCompleted,
		label: "Không đạt",
	},
	{
		value: ProcedureStatus.completed,
		label: "Đạt",
	},
];

export const LeaderTaskProcedureModal = ({
	open,
	onCancel,
	onSubmit,
	confirmLoading,
	dataSource,
	mode,
}) => {
	// const { user } = useContext(UserContext);
	// const { team } = useContext(TeamContext);

	// const isLeader = user?.userId === team?.leader?.id;

	const [title, setTitle] = useState(false);
	
	// setTitle(`${mode === "1" ? "Thêm" : "Đánh giá"} báo cáo`);

	const [initialValues, setInitialValues] = useState();
	const [leadTaskProcedureform] = Form.useForm();

	const [loading, setLoading] = useState(false);

	const handleValue = (values) => {
		leadTaskProcedureform.setFieldsValue(values);
	};

	const onFinish = async (values) => {
		const data = {
			id: values.id,
			name: values.name,
			username: values.username,
			jobName: values.jobName,
			description: values.description,
			status: values.status,
			timeReport: values?.timeReport,
			isDeleted: values?.isDeleted
		}
		await onSubmit(data);
	};

	const handleTitle = (values) => {
		if (mode === "1") {
			setTitle("Thêm quy trình")
		} else {
			setTitle(`Chỉnh sửa quy trình ${values}`)
		}
	}

	useEffect(() => {
		handleValue({
			id: dataSource?.id,
			name: dataSource?.name,
			username: dataSource?.username,
			jobName: dataSource?.jobName,
			description: dataSource?.description,
			status: dataSource?.status,
			timeReport: dataSource?.timeReport,
		});
		handleTitle(dataSource?.name);
	}, [dataSource]);

	return (
		<BaseModal
			open={open}
			onCancel={() => {
				onCancel();
				leadTaskProcedureform.resetFields();
			}}
			title={title}
			onOk={() => {
				leadTaskProcedureform.submit();
			}}
			confirmLoading={confirmLoading}
			width="50%"
			okText="Gửi"
		>
			<Form
				form={leadTaskProcedureform}
				layout="vertical"
				onFinish={onFinish}
				initialValues={initialValues}
			>
				<Form.Item name="id" hidden>
					<Input />
				</Form.Item>
				<Form.Item
					name="name"
					label="Tên quy trình"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập tên quy trình",
						},
					]}
				>
					<Input
						showCount
						maxLength={255}
						placeholder="Tên đơn hàng"
					/>
				</Form.Item>
				<Form.Item
					name="username"
					label="Tên nhóm trưởng"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập tên nhóm trưởng",
						},
					]}
				>
					<Input
						showCount
						maxLength={255}
						placeholder="Tên nhóm trưởng"
					/>
				</Form.Item>
				<Form.Item
					name="jobName"
					label="Tên việc"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập tên việc",
						},
					]}
				>
					<Input
						showCount
						maxLength={255}
						placeholder="Tên việc"
					/>
				</Form.Item>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name="status" label="Đánh giá">
							<Select
								options={taskStatusOptions}
								placeholder="Đánh giá"
							/>
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					label="Mô tả"
					name="description"
				>
					<RichTextEditor
						placeholder="Mô tả"
					/>
				</Form.Item>
			</Form>
		</BaseModal>
	);
};
