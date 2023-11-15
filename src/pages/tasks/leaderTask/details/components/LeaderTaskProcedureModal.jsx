import { Row, Col, Form, Input, Select, DatePicker, Typography, InputNumber } from "antd";
import { useEffect, useRef, useState } from "react";
import BaseModal from "../../../../../components/BaseModal";
import { RichTextEditor } from "../../../../../components/RichTextEditor";
import { modalModes } from "../../../../../constants/enum";
import dayjs from "dayjs";
import UserApi from "../../../../../apis/user";
import { roles } from "../../../../../constants/app";
import ItemApi from "../../../../../apis/item";
import moment from "moment";

const { Text } = Typography;

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

	const [loading, setLoading] = useState(false);
	const [title, setTitle] = useState(false);

	const [initialValues, setInitialValues] = useState();
	const [leadTaskProcedureform] = Form.useForm();
	const [leadersData, setLeadersData] = useState([]);
	const [itemsData, setItemsData] = useState([]);
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState();

	const isCreate = mode === modalModes.CREATE;

	const handleValue = (values) => {
		leadTaskProcedureform.setFieldsValue(values);
	};

	console.log("dataSource?.id", dataSource?.id)

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
		switch (mode) {
			case modalModes.UPDATE:
				setTitle(`Chỉnh sửa quy trình ${values}`)
				break;
			case modalModes.CREATE:
			default:
				setTitle("Thêm quy trình")
				break;
		}
	}

	const getLeaderInfo = async () => {
		setLoading(true);
		const data = await UserApi.getAllUser();
		// const leadersData = await UserApi.getUserByRole(roles.LEADER)?.data;
		setLeadersData(data?.data);
		setLoading(false);
	}

	const getItemInfo = async () => {
		setLoading(true);
		const data = await ItemApi.getAllItem();
		setItemsData(data?.data);
		setLoading(false);
		console.log("itemsData", itemsData)
	}

	const handleChange = (values) => {
		setStartTime(values?.[0]);
		setEndTime(values?.[1]);
	};

	useEffect(() => {
		handleTitle(dataSource?.name);
		getLeaderInfo();
		getItemInfo();
		setStartTime(dayjs(dataSource?.startTime).format("DD/MM/YYYY"))
		setEndTime(dayjs(dataSource?.endTime).format("DD/MM/YYYY"))
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
					label="Tên công việc"
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
						placeholder="Tên công việc"
					/>
				</Form.Item>
				<Form.Item
					name="leaderId"
					label="Nhóm trưởng"
					rules={[
						{
							required: isCreate && true,
							message: "Vui lòng chọn nhóm trưởng",
						},
					]}
				>
					<Select
						className="w-full"
						placeholder="Chọn nhóm trưởng"
						options={leadersData?.map((e) => {
							return {
								label: e.fullName,
								value: e.id,
							};
						})}
						disabled={!isCreate}
					/>
				</Form.Item>
				<Form.Item
					name="itemId"
					label="Sản phẩm"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn sản phẩm",
						},
					]}
				>
					<Select
						className="w-full"
						placeholder="Chọn sản phẩm"
						options={itemsData?.map((e) => {
							return {
								label: e.name,
								value: e.id,
							};
						})}
						disabled={!isCreate}
					/>
				</Form.Item>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item 
						name="priority" 
						label="Độ ưu tiên">
							<InputNumber 
								min={1} 
								max={10}
								placeholder="Độ ưu tiên"
							/>
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					name="dates"
					label="Thời gian"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn ngày bắt đầu & kết thúc",
						},
					]}
				>
					<DatePicker.RangePicker
						value={[startTime, endTime]}
						format="DD/MM/YYYY"
						placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
						onChange={handleChange}
						className="w-full"
					/>
				</Form.Item>
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
