import { Row, Col, Form, Input, Select, Typography, InputNumber, message, Card, Button, Upload } from "antd";
import { useContext, useRef, useState } from "react";
import { RichTextEditor } from "../../../../components/RichTextEditor";
import BaseModal from "../../../../components/BaseModal";
import { modalModes } from "../../../../constants/enum";
import { SupplyOptions } from "../../../../constants/app";
import { TaskContext } from "../../../../providers/task";
import { LoadingOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { imagesItemRef, leaderTaskReportsRef } from "../../../../middleware/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const { Text } = Typography;

export const LeaderTaskReportModal = ({
	open,
	onCancel,
	onSubmit,
	confirmLoading,
	mode,
	title,
}) => {
	// const { user } = useContext(UserContext);
	const { info } = useContext(TaskContext);

	// const [resourceImage, setResourceImage] = useState([]);
	const [loading, setLoading] = useState(false);
	const [resourceErrorMsg, setResourceErrorMsg] = useState("");

	const leadReportFormRef = useRef();

	const isCreate = mode === modalModes.CREATE;

	const onFinish = async (values) => {
		const resource = leadReportFormRef.current?.getFieldValue('resource');
		if (!resource || resource?.length === 0) {
			handleValidateUpload();
		} else {
			setResourceErrorMsg("");
			values.resource = [resource];
			await onSubmit({ ...values });
		}
	};

	const handleUploadImage = ({
		file,
		onSuccess,
		onError,
		onProgress,
	}) => {
		console.log("handleUploadImage");
		setLoading(true);
		// const file = event.file;
		const fileName = file?.name;
		const uploadTask = uploadBytesResumable(ref(leaderTaskReportsRef, fileName), file);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
				// update progress
				onProgress(percent);

				switch (snapshot.state) {
					case 'paused': // or 'paused'
						console.log("Upload is p aused");
						break;
					case 'running': // or 'running'
						console.log("Upload is running");
						break;
				}
			},
			(err) => {
				console.log(err);
				setLoading(false);
				onError(err);
			},
			() => {
				// download url
				getDownloadURL(uploadTask.snapshot.ref).then((url) => {
					leadReportFormRef.current.setFieldValue("resource", url);
					// setResourceImage(url);
					console.log("handleUploadImage success", url);

					onSuccess(url);
				});
			}
		);
		setLoading(false);
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

	const handleRemoveUploadImage = (info) => {
		info.fileList = [];
		// setResourceImage([]);
		leadReportFormRef.current.setFieldValue("resource", "");
	}

	const normFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};

	const handleValidateUpload = () => {
		setResourceErrorMsg("Vui lòng thêm ảnh báo cáo");
	}

	return (
		<BaseModal
			open={open}
			onCancel={() => {
				setResourceErrorMsg("");
				onCancel();
			}}
			title={title}
			onOk={() => {
				if (!leadReportFormRef.current?.getFieldValue('resource')) {
					handleValidateUpload();
				}
				leadReportFormRef.current?.submit();
			}}
			confirmLoading={confirmLoading}
			width="40%"
			okText="Lưu"
		>
			<Form
				ref={leadReportFormRef}
				layout="vertical"
				onFinish={onFinish}
				initialValues={{
					acceptanceTaskId: info.id,
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
							<Form.Item name="acceptanceTaskId" hidden>
								<Input />
							</Form.Item>
							<Form.Item
								name="title"
								label={<Text strong>Tên báo cáo</Text>}
								rules={[
									{
										required: true,
										message: "Vui lòng nhập tên báo cáo",
									},
								]}
							>
								<Input
									showCount
									maxLength={255}
									placeholder="Tên báo cáo"
								/>
							</Form.Item>
							<Form.Item
								label={<Text strong>Mô tả báo cáo</Text>}
								name="content"
								rules={[
									{
										required: true,
										message: "Vui lòng thêm mô tả báo cáo",
									},
								]}
							>
								<RichTextEditor
									placeholder="Mô tả báo cáo..."
								/>
							</Form.Item>
							<Form.Item name="resource" hidden>
								<Input />
							</Form.Item>
							<Form.Item
								label={<><Text type="danger">*</Text>&nbsp;<Text strong>Tải ảnh</Text></>}
								valuePropName="fileList"
								getValueFromEvent={normFile}
								validateStatus="error"
								help={resourceErrorMsg}
							>
								<Upload
									listType="picture"
									// beforeUpload={() => false}
									accept=".jpg,.jepg,.png,.svg,.bmp"
									onChange={handleChangeUploadImage}
									maxCount={1}
									customRequest={handleUploadImage}
									onRemove={handleRemoveUploadImage}
								>
									<Button
										icon={<UploadOutlined />}>
										Upload
									</Button>
								</Upload>
							</Form.Item>
						</Card>
					</Col>
				</Row>
			</Form>

		</BaseModal>
	);
};
