import { Row, Col, Form, Input, Select, DatePicker, Typography, InputNumber, message, Card, Upload, Image } from "antd";
import { useEffect, useRef, useState } from "react";
import { RichTextEditor } from "../../../../components/RichTextEditor";
import BaseModal from "../../../../components/BaseModal";
import dayjs from "dayjs";
import { eTaskLabels, eTaskStatus, modalModes } from "../../../../constants/enum";
import ItemApi from "../../../../apis/item";
import UserApi from "../../../../apis/user";

const { Text } = Typography;

export const LeaderTaskModal = ({
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
	const [leadersData, setLeadersData] = useState([]);
	const [itemsData, setItemsData] = useState([]);
	const [statusList, setStatusList] = useState([]);

	const leadTaskFormRef = useRef();

	const drawings2D = dataSource?.item?.drawings2D;
	const drawings3D = dataSource?.item?.drawings3D;
	const drawingsTechnical = dataSource?.item?.drawingsTechnical;

	const isCreate = mode === modalModes.CREATE;

	const onFinish = async (values) => {
		await onSubmit({ ...values });
	};

	const handleTitle = () => {
		switch (mode) {
			case modalModes.UPDATE:
				setTitle("Thông tin công việc")
				break;
			case modalModes.CREATE:
			default:
				setTitle("Thêm công việc")
				break;
		}
	}

	const initLeaderInfo = async () => {
		// const data = await UserApi.getAllUser();
		const roleId = "dd733ddb-949c-4441-b69b-08dbdf6e1008";
		const leadersData = await UserApi.getUserByRoleId(roleId);
		if (leadersData.code === 0) {
			setLeadersData(leadersData?.data);
		} else {
			message.error = leadersData.message;
		}
	}

	const initItemInfo = async () => {
		const data = await ItemApi.getAllItem();
		if (data.code === 0) {
			setItemsData(data?.data);
		} else {
			message.error = leadersData.message;
		}
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

	const initialData = async () => {
		handleTitle();
		initLeaderInfo();
		initItemInfo();
		initETaskStatus();
	}

	const handleDownloadImage = (url) => {
		// var fileName = type + "order-export.pdf";
		var a = document.createElement("a");
		a.download = "image.png";
		a.href = url;
		a.rel = 'noopener';
		a.click();
	}

	useEffect(() => {
		initialData();
	}, []);

	return (
		<BaseModal
			open={open}
			onCancel={onCancel}
			title={title}
			onOk={() => leadTaskFormRef.current?.submit()}
			confirmLoading={confirmLoading}
			width="50%"
			okText="Lưu"
		>
			<Form
				ref={leadTaskFormRef}
				layout="vertical"
				onFinish={onFinish}
				initialValues={{
					...dataSource,
					drawings2D: dataSource?.item?.drawings2D,
					drawings3D: dataSource?.item?.drawings3D,
					drawingsTechnical: dataSource?.item?.drawingsTechnical,
					dates: [dayjs(dataSource?.startTime), dayjs(dataSource?.endTime)],
				}}
			>
				<Row gutter={16}>
					<Col span={24}>
						<Card
							bodyStyle={{
								padding: 0,
								paddingLeft: 8,
								paddingTop: 12,
								paddingRight: 8,
								paddingBottom: 16,
							}}
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
								<Col span={16}>
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
											showNow
											showTime
											placeholder={["Bắt đầu", "Kết thúc"]}
											className="w-full"
											format="HH:mm DD/MM/YYYY"
										/>
									</Form.Item>
								</Col>
								<Col span={6}>
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
								<Col span={16}>
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
								</Col>
								<Col span={isCreate ? 16 : 8}>
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
								label="Mô tả"
								name="description"
							>
								<RichTextEditor
									placeholder="Mô tả"
								/>
							</Form.Item>
							
							<Form.Item
								name="drawings2D"
								label="Bản vẽ 2D"
							>
								<a href={drawings2D} download="image.png">test</a>
							</Form.Item>
						</Card>
					</Col>
				</Row>
			</Form>

		</BaseModal>
	);
};
