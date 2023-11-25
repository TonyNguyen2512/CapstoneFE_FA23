import { Row, Col, Form, Input, Select, DatePicker, Typography, InputNumber, message, Card, Button, Upload } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { RichTextEditor } from "../../../../components/RichTextEditor";
import BaseModal from "../../../../components/BaseModal";
import dayjs from "dayjs";
import { eTaskLabels, eTaskStatus, modalModes } from "../../../../constants/enum";
import ItemApi from "../../../../apis/item";
import UserApi from "../../../../apis/user";
import { SupplyOptions } from "../../../../constants/app";
import { TaskContext } from "../../../../providers/task";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { imagesItemRef } from "../../../../middleware/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

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
	const { tasks, material, info } = useContext(TaskContext);

	const [resourceImage, setResourceImage] = useState("");
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	const leadReportFormRef = useRef();

	const isCreate = mode === modalModes.CREATE;

	const onFinish = async (values) => {
		values.resource = [values.resource]
		await onSubmit({ ...values });
	};

	const handleUploadImage = (event) => {
		setLoading(true);
		const file = event.file;
		const fileName = event.file?.name;
		const uploadTask = uploadBytesResumable(ref(imagesItemRef, fileName), file);
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
					leadReportFormRef.current.setFieldValue("resource", url);
					setResourceImage(url);
				});
			}
		);
		setLoading(false);
	};

	return (
		<BaseModal
			open={open}
			onCancel={onCancel}
			title={title}
			onOk={() => leadReportFormRef.current?.submit()}
			confirmLoading={confirmLoading}
			width="40%"
			okText="Lưu"
		>
			<Form
				ref={leadReportFormRef}
				layout="vertical"
				onFinish={onFinish}
				initialValues={{
					leaderTaskId: info.id,
					listSupply: [
						{
							materialId: "",
							amount: ""
						}
					]
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
									<Form.Item
										name="resource"
										label={<Text strong>Tải ảnh</Text>}
										rules={[
											{
												required: true,
												message: "Vui lòng chọn ảnh",
											},
										]}
										valuePropName="fileList"
									>
										<Upload
											listType="picture"
											beforeUpload={() => false}
											accept=".jpg,.jepg,.png,.svg,.bmp"
											onChange={handleUploadImage}
											maxCount={1}
										>
											<Button
												icon={<UploadOutlined />}>
												Upload
											</Button>
										</Upload>
									</Form.Item>
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
																			options={material?.listFromOrder?.map((e) => {
																				return {
																					label: e.name,
																					value: e.materialId,
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
