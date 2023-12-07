import { Row, Col, Form, Input, Select, DatePicker, Typography, InputNumber, Card, Button } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { RichTextEditor } from "../../../../components/RichTextEditor";
import BaseModal from "../../../../components/BaseModal";
import dayjs from "dayjs";
import { modalModes } from "../../../../constants/enum";
import UserApi from "../../../../apis/user";
import { DownloadOutlined } from "@ant-design/icons";
import { handleDownloadFile } from "../../../../utils";
import { TaskContext } from "../../../../providers/task";
import { ETaskStatusOptions } from "../../../../constants/app";

const { Text } = Typography;

export const LeaderTaskModal = ({
	open,
	onCancel,
	onSubmit,
	confirmLoading,
	dataSource,
	mode,
}) => {
	const { info } = useContext(TaskContext);

	const [title, setTitle] = useState(false);
	const [leadersData, setLeadersData] = useState([]);

	const leadTaskFormRef = useRef();

	const isDrawings2D = dataSource?.item?.drawings2D;
	const isDrawings3D = dataSource?.item?.drawings3D;
	const isDrawingsTechnical = dataSource?.item?.drawingsTechnical;

	const isCreate = mode === modalModes.CREATE;

	const onFinish = async (values) => {
		await onSubmit({ ...values });
	};

	const initLeaderInfo = async () => {
		UserApi.getByLeaderRole().then((resp) => {
			setLeadersData(resp?.data);
		});
	}

	useEffect(() => {
		const initialData = () => {
			initLeaderInfo();
		}
		initialData();
	}, [dataSource]);

	useEffect(() => {
		switch (mode) {
			case modalModes.UPDATE:
				setTitle("Thông tin công việc")
				break;
			case modalModes.CREATE:
			default:
				setTitle("Thêm công việc")
				break;
		}
	}, [mode])

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
					leaderId: dataSource?.leaderId,
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
								label={<Text strong>Tên công việc</Text>}
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
								label={<Text strong>Tổ trưởng</Text>}
								rules={[
									{
										required: true,
										message: "Vui lòng chọn Tổ trưởng",
									},
								]}
							>
								<Select
									className="w-full"
									placeholder="Chọn Tổ trưởng"
									options={leadersData?.map((e) => {
										return {
											label: e.fullName,
											value: e.id,
										};
									})}
								/>
							</Form.Item>
							<Form.Item
								name="itemId"
								hidden
							>
								<Input />
							</Form.Item>
							<Row gutter={16}>
								<Col span={16}>
									<Form.Item
										name="dates"
										label={<Text strong>Thời gian</Text>}
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
											disabledDate={(date) => {
												return (
													date.isBefore(info.startTime)
												);
											}}
										/>
									</Form.Item>
								</Col>
								<Col span={6}>
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
											label={<Text strong>Trạng thái</Text>}
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
												options={ETaskStatusOptions}
											/>
										</Form.Item>
									}
								</Col>
								<Col span={isCreate ? 16 : 8}>
									<Form.Item
										name="itemQuantity"
										label={<Text strong>Số lượng sản phẩm</Text>}
										rules={[
											{
												required: true,
												message: "Vui lòng thêm số lượng sản phẩm",
											},
										]}
									>
										<InputNumber
											min={1}
											// max={10}
											placeholder="Số lượng sản phẩm"
										/>
									</Form.Item>
								</Col>
							</Row>
							<Form.Item
								label={<Text strong>Mô tả</Text>}
								name="description"
							>
								<RichTextEditor
									placeholder="Mô tả"
								/>
							</Form.Item>

							{!isCreate &&
								<Row gutter={16}>
									<Col span={8}>
										<Form.Item hidden name="drawings2D">
											<Input />
										</Form.Item>
										<Form.Item
											label={<Text strong>Bản vẽ 2D</Text>}
										>
											<Button
												disabled={!isDrawings2D}
												icon={<DownloadOutlined />}
												onClick={(e) => handleDownloadFile(leadTaskFormRef.current.getFieldValue("drawings2D"), "drawings2D")
												}>
												Tải bản vẽ
											</Button>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item hidden name="drawings3D">
											<Input />
										</Form.Item>
										<Form.Item
											label={<Text strong>Bản vẽ 3D</Text>}
										>
											<Button
												disabled={!isDrawings3D}
												icon={<DownloadOutlined />}
												onClick={(e) => handleDownloadFile(leadTaskFormRef.current.getFieldValue("drawings3D"), "drawings3D")
												}>
												Tải bản vẽ
											</Button>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item hidden name="drawingsTechnical">
											<Input />
										</Form.Item>
										<Form.Item
											label={<Text strong>Bản vẽ kĩ thuật</Text>}
										>
											<Button
												disabled={!isDrawingsTechnical}
												icon={<DownloadOutlined />}
												onClick={(e) => handleDownloadFile(leadTaskFormRef.current.getFieldValue("drawingsTechnical"), "drawingsTechnical")
												}>
												Tải bản vẽ
											</Button>
										</Form.Item>
									</Col>
								</Row>
							}
						</Card>
					</Col>
				</Row>
			</Form>

		</BaseModal>
	);
};
