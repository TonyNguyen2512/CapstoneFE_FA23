import { Row, Col, Form, Input, Select, DatePicker, Typography, InputNumber } from "antd";
import { useEffect, useRef, useState } from "react";
import BaseModal from "../../../../../components/BaseModal";
import { RichTextEditor } from "../../../../../components/RichTextEditor";
import { eTaskLabels, eTaskStatus, modalModes } from "../../../../../constants/enum";
import dayjs from "dayjs";
import UserApi from "../../../../../apis/user";
import { roles } from "../../../../../constants/app";
import ItemApi from "../../../../../apis/item";
import moment from "moment";
import { formatDate } from "../../../../../utils";

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
	const [statusList, setStatusList] = useState([]);
	const isStartTime = dataSource?.startTime ? true : false;
	const isEndTime = dataSource?.endTime ? true : false;

	const isCreate = mode === modalModes.CREATE;

	const onFinish = async (values) => {
		const dates = values.dates;
		console.log("values", values)
		let data = {};
		if (isCreate) {
			data = {
				name: values?.name,
				leaderId: values?.leaderId,
				orderId: dataSource?.orderId,
				itemId: values?.itemId,
				priority: values?.priority,
				itemQuantity: values?.itemQuantity,
				startTime: '2023-11-01',
				endTime: '2023-11-02',
				description: values?.description,
			}
		} else {
			data = {
				id: values?.id,
				name: values?.name,
				priority: values?.priority,
				itemQuantity: values?.itemQuantity,
				startTime: dates?.[0],
				endTime: dates?.[1],
				description: values?.description,
				status: values?.status,
			}
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
	}

	const getETaskStatus = () => {
		let data = [];
		for (const status in eTaskStatus) {
			data.push({
				value: eTaskStatus[status],
				label: eTaskLabels[eTaskStatus[status]],
			})
		}
		setStatusList(data);
	}

	useEffect(() => {
		setInitialValues({
			id: dataSource?.id || "",
			name: dataSource?.name || "",
			leaderId: dataSource?.leaderId || "",
			itemId: dataSource?.itemId || "",
			priority: dataSource?.priority || "",
			description: dataSource?.description || "",
			itemQuantity: dataSource?.itemQuantity || "",
			dates: [isStartTime ? dayjs(dataSource?.startTime) : "", isEndTime ? dayjs(dataSource?.endTime) : ""],
			status: dataSource?.status || "",
		});
		handleTitle(dataSource?.name);
		getLeaderInfo();
		getItemInfo();
		getETaskStatus();
	}, [dataSource]);

	return (
		<BaseModal
			open={open}
			onCancel={onCancel}
			title={title}
			onOk={() => leadTaskProcedureform.submit()}
			confirmLoading={confirmLoading}
			width="40%"
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
							required: true,
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
							label="Độ ưu tiên"
							rules={[
								{
									required: true,
									message: "Vui lòng thêm độ ưu tiên",
								},
							]}
						>
							<InputNumber
								min={1}
								max={10}
								defaultValue=""
								placeholder="Độ ưu tiên"
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name="itemQuantity"
							label="Số lượng sản phẩm"
							rules={[
								{
									required: true,
									message: "Vui lòng thêm số lượng sản phẩm",
								},
							]}
						>
							<InputNumber
								min={1}
								max={10}
								defaultValue=""
								placeholder="Số lượng sản phẩm"
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
						format="DD/MM/YYYY"
						placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
						className="w-full"
					/>
				</Form.Item>
				{!isCreate &&
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
						<Select
							className="w-full"
							placeholder="Chọn sản phẩm"
							options={statusList}
						/>
					</Form.Item>
				}
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
