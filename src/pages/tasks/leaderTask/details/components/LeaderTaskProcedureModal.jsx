import { Row, Col, Form, Input, Select, DatePicker, Typography, InputNumber, message } from "antd";
import { useEffect, useState } from "react";
import BaseModal from "../../../../../components/BaseModal";
import { RichTextEditor } from "../../../../../components/RichTextEditor";
import { eTaskLabels, eTaskStatus, modalModes } from "../../../../../constants/enum";
import dayjs from "dayjs";
import UserApi from "../../../../../apis/user";
import ItemApi from "../../../../../apis/item";
import LeaderTasksApi from "../../../../../apis/leader-task";

const { Text } = Typography;

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

	const [initialValues, setInitialValues] = useState([]);
	const [leadersData, setLeadersData] = useState([]);
	const [itemsData, setItemsData] = useState([]);
	const [statusList, setStatusList] = useState([]);

	const [leadTaskform] = Form.useForm();

	const isCreate = mode === modalModes.CREATE;

	const onFinish = async (values) => {
		await onSubmit({ ...values });
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

	const initLeaderInfo = async () => {
		// const data = await UserApi.getAllUser();
		const roleId = "dd733ddb-949c-4441-b69b-08dbdf6e1008";
		const leadersData = await UserApi.getUserByRoleId(roleId);
		setLeadersData(leadersData?.data);
	}

	const initItemInfo = async () => {
		const data = await ItemApi.getAllItem();
		setItemsData(data?.data);
	}

	const initETaskStatus = () => {
		let data = [];
		for (const status in eTaskStatus) {
			data.push({
				value: eTaskStatus[status],
				label: eTaskLabels[eTaskStatus[status]],
			})
		}
		setStatusList(data);
	}

	const initLeaderTaskModal = async (eTaskId) => {
		if (!eTaskId) return;
		const data = await LeaderTasksApi.getLeaderTaskById(eTaskId);
		if (data.code === 0) {
			return data.data;
		} else {
			message.error = data.message;
		}
	}

	const initialData = async (dataSource) => {
		let data = {};
		if (!isCreate) {
			const leaderTaskData = await initLeaderTaskModal(dataSource?.id);
			if (leaderTaskData) {
				const isStartTime = leaderTaskData?.startTime ? true : false;
				const isEndTime = leaderTaskData?.endTime ? true : false;
				data = {
					...leaderTaskData,
					dates: [isStartTime ? dayjs(leaderTaskData?.startTime) : "", isEndTime ? dayjs(leaderTaskData?.endTime) : ""],
				}
			}
		}
		leadTaskform.setFieldsValue(data);
		setInitialValues(data);
		handleTitle(data?.name);
		initLeaderInfo();
		initItemInfo();
		initETaskStatus();
	}

	useEffect(() => {
		initialData(dataSource);
	}, [dataSource]);

	return (
		<BaseModal
			open={open}
			onCancel={() => {
				onCancel();
				leadTaskform.resetFields();
			}}
			title={title}
			onOk={() => leadTaskform.submit()}
			confirmLoading={confirmLoading}
			width="40%"
			okText="Gửi"
		>
			<Form
				form={leadTaskform}
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
