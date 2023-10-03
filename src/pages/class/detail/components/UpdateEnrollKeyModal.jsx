import React, { useRef, useState } from "react";
import BaseModal from "../../../../components/BaseModal";
import { Form, Input, message } from "antd";
import ClassApi from "../../../../apis/class";

export const UpdateEnrollKeyModal = ({ open, onCancel, data, onSuccess }) => {
	const formRef = useRef();

	const [loading, setLoading] = useState(false);

	const handleUpdate = async (values) => {
		const { enrollCode } = values;

		const request = {
			classId: data?.classId,
			enrollCode,
		};

		setLoading(true);
		const success = await ClassApi.updateEnrollCode(request);
		if (success) {
			message.success("Cập nhật mã tham gia thành công");
			onSuccess && onSuccess();
		} else {
			message.error("Cập nhật mã tham gia thất bại");
		}
		setLoading(false);
		onCancel();
	};

	return (
		<BaseModal
			open={open}
			onCancel={onCancel}
			title="Cập nhật mã tham gia"
			onOk={() => formRef.current?.submit()}
			confirmLoading={loading}
		>
			<Form
				ref={formRef}
				layout="vertical"
				onFinish={handleUpdate}
				initialValues={{
					enrollCode: data?.enrollCode,
				}}
			>
				<Form.Item
					name="enrollCode"
					label="Mã tham gia"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập mã tham gia",
						},
					]}
				>
					<Input.Password place holder="Nhập mã tham gia..." />
				</Form.Item>
			</Form>
		</BaseModal>
	);
};
