import { Row, Col, Form, Input, Select, Typography, InputNumber, message, Card, Button } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { RichTextEditor } from "../../../../components/RichTextEditor";
import BaseModal from "../../../../components/BaseModal";
import { modalModes } from "../../../../constants/enum";
import { SupplyOptions } from "../../../../constants/app";
import { TaskContext } from "../../../../providers/task";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { workerTaskReportsRef } from "../../../../middleware/firebase";
import { UploadFile } from "../../../../components/UploadFile";
import MaterialApi from "../../../../apis/material";

const { Text } = Typography;

export const TaskReportModal = ({
	open,
	onCancel,
	onSubmit,
	confirmLoading,
	mode,
	title,
}) => {
	// const { user } = useContext(UserContext);
	const { material, info } = useContext(TaskContext);

	const [loading, setLoading] = useState(false);
	const [resourceErrorMsg, setResourceErrorMsg] = useState("");
	const [materialInfo, setMaterialInfo] = useState([]);

	const worderReportFormRef = useRef();

	// const isCreate = mode === modalModes.CREATE;

	const onFinish = async (values) => {
		const resource = worderReportFormRef.current?.getFieldValue('resource');
		if (handleValidateUpload()) {
			setResourceErrorMsg("");
			values.resource = [resource];
			await onSubmit({ ...values });
		}
	};

	const handleChangeUploadImage = (info) => {
		// setFileList(newFileList);
		console.log('handleChange', info);
		if (info.file.status === 'uploading') {
			console.log('setting loading to true');
			// this.setState({ loading: true });
			setLoading(true);
			// return;
		}
		if (info.file.status === 'done') {
			console.log('setting loading to false');
			setLoading(false);
		}
		setResourceErrorMsg("");
	};

	const handleValidateUpload = () => {
		if (!worderReportFormRef.current?.getFieldValue('resource')) {
			setResourceErrorMsg("Vui lòng thêm ảnh báo cáo");
			return false;
		} else {
			setResourceErrorMsg("");
			return true;
		}
	}

	useEffect(() => {
		const handleMaterialData = () => {
			MaterialApi.getAllMaterial().then((resp) => {
				setMaterialInfo(resp?.data);
			})
		}

		handleMaterialData();
	}, []);

	return (
		<BaseModal
			open={open}
			onCancel={onCancel}
			title={title}
			onOk={() => {
				handleValidateUpload();
				worderReportFormRef.current?.submit();
			}}
			confirmLoading={confirmLoading}
			width="40%"
			okText="Lưu"
		>
			<Form
				ref={worderReportFormRef}
				layout="vertical"
				onFinish={onFinish}
				initialValues={{
					leaderTaskId: info.id,
					listSupply: []
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
							<Form.Item name="leaderTaskId" hidden>
								<Input />
							</Form.Item>
							<Form.Item
								name="title"
								label={<Text strong>Tên vấn đề</Text>}
								rules={[
									{
										required: true,
										message: "Vui lòng nhập tên vấn đề",
									},
								]}
							>
								<Input
									showCount
									maxLength={255}
									placeholder="Tên vấn đề"
								/>
							</Form.Item>
							<Form.Item
								label={<Text strong>Mô tả vấn đề</Text>}
								name="content"
								rules={[
									{
										required: true,
										message: "Vui lòng thêm mô tả vấn đề",
									},
								]}
							>
								<RichTextEditor
									placeholder="Mô tả vấn đề..."
								/>
							</Form.Item>
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item
										name="supplyStatus"
										label={<Text strong>Trạng thái</Text>}
										rules={[
											{
												required: true,
												message: "Vui lòng chọn sản phẩm",
											},
										]}
									>
										<Select
											className="w-full"
											placeholder="Chọn trạng thái báo cáo"
											options={SupplyOptions?.map((e) => {
												return e;
											})}
										/>
									</Form.Item>
								</Col>
								<Col span={8}>
									<UploadFile 
										formRef={worderReportFormRef}
										imageRef={workerTaskReportsRef}
										itemName="resource"
										onChange={handleChangeUploadImage}
										fileAccept=".jpg,.jepg,.png,.svg,.bmp"
										errorMessage={resourceErrorMsg}
									/>
								</Col>
							</Row>
							<Form.Item
								label={<Text strong>Vật liệu gặp vấn đề</Text>}
							>
								<Form.List name="listSupply">
									{(fields, { add, remove }) => (
										<>
											{fields.map((field, index) => {
												return (
													<Row key={field.key} align="middle" gutter={4}>
														<Col span={22}>
															<Row gutter={16}>
																<Col span={13}>
																	<Form.Item
																		{...field}
																		label="Vật liệu"
																		key={`materialId-${index}`}
																		rules={[
																			{
																				required: true,
																				message: "Vui lòng chọn vật liệu",
																			},
																		]}
																		name={[field.name, 'materialId']}
																	>
																		<Select
																			placeholder="Chọn vật liệu"
																			allowClear
																			options={materialInfo?.map((e) => {
																				return {
																					label: e.name,
																					value: e.id,
																				};
																			})}
																		/>
																	</Form.Item>
																</Col>
																<Col span={8}>
																	<Form.Item
																		{...field}
																		label="Số lượng cần"
																		key={`amount-${index}`}
																		rules={[
																			{
																				required: true,
																				message: "Vui lòng thêm số lượng",
																			},
																		]}
																		name={[field.name, 'amount']}
																	>
																		<InputNumber
																			min={1}
																			max={10000}
																			placeholder="Số lượng"
																		/>
																	</Form.Item>
																</Col>
															</Row>
														</Col>
														<Col>
															{fields.length > 1 && index > 0 && (
																<Button
																	className="flex-center mt-1"
																	type="text"
																	danger
																	icon={<MinusCircleOutlined />}
																	onClick={() => remove(field.name)}
																/>
															)}
														</Col>
													</Row>
												);
											})}
											{fields.length < 5 && (
												<Form.Item>
													<Button
														type="dashed"
														onClick={() => {
															if (fields.length >= 5) {
																message.error("Đã vượt quá số lượng vật liệu");
																return;
															}
															add();
														}}
														block
														icon={<PlusOutlined />}
													>
														Thêm vật liệu
													</Button>
												</Form.Item>
											)}
										</>
									)}
								</Form.List>
							</Form.Item>
						</Card>
					</Col>
				</Row>
			</Form>

		</BaseModal>
	);
};
