import React from "react";
import { Button, Form, Input, Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const { Text } = Typography;

export const UploadFile = ({
	formRef,
	imageRef,
	itemName,
	onChange,
	fileAccept,
	errorMessage,
	children,
}) => {

	const handleUploadImage = ({
		file,
		onSuccess,
		onError,
		onProgress,
	}) => {
		const fileName = file?.name;
		const uploadTask = uploadBytesResumable(ref(imageRef, fileName), file);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
				// update progress
				onProgress(percent);
			},
			(err) => {
				console.log(err);
				onError(err);
			},
			() => {
				// download url
				getDownloadURL(uploadTask.snapshot.ref).then((url) => {
					formRef.current.setFieldValue(itemName, url);
					onSuccess(url);
				});
			}
		);
	};

	const normFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};

	const handleRemoveUploadImage = (info) => {
		info.fileList = [];
		formRef.current.setFieldValue(itemName, "");
	}

	return (
		<>
			<Form.Item name={itemName} hidden>
				<Input />
			</Form.Item>
			<Form.Item
				label={<><Text type="danger">*</Text>&nbsp;<Text strong>Tải ảnh</Text></>}
				valuePropName="fileList"
				getValueFromEvent={normFile}
				// validateStatus="error"
				help={errorMessage}
			>
				<Upload
					listType="picture"
					accept={fileAccept}
					onChange={onChange}
					maxCount={1}
					customRequest={handleUploadImage}
					onRemove={handleRemoveUploadImage}
				>
					{children ? children : (
						<Button
							icon={<UploadOutlined />}>
							Upload
						</Button>
					)}
				</Upload>
			</Form.Item>
		</>
	);
};
