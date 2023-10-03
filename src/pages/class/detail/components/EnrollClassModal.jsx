import { Form, Input, message } from "antd";
import React, { useRef, useState } from "react";
import BaseModal from "../../../../components/BaseModal";
import ClassApi from "../../../../apis/class";

export const EnrollClassModal = ({ open, onCancel, onSuccess, classId }) => {
	const formRef = useRef();

	const [loading, setLoading] = useState(false);

	const onSubmit = async (values) => {
		if (!classId) return;
		console.log(values);
		const { enrollCode } = values;
		setLoading(true);
		const success = await ClassApi.enrollClass(classId, enrollCode);
		if (success) {
			message.success("Tham gia lớp học thành công");
			onSuccess();
		} else {
			message.error("Mã tham gia không hợp lệ");
		}

		onCancel();
		setLoading(false);
	};

	return (
		<BaseModal
			open={open}
			onCancel={onCancel}
			title="Tham gia lớp học"
			onOk={() => formRef.current?.submit()}
			confirmLoading={loading}
		>
			<Form ref={formRef} onFinish={onSubmit}>
				<Form.Item
					name="enrollCode"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập mã tham gia",
						},
					]}
				>
					<Input.Password placeholder="Mã tham gia lớp học..." />
				</Form.Item>
			</Form>
		</BaseModal>
	);
};
