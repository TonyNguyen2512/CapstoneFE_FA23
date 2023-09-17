import React, { useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Form, Select, message } from "antd";
import UserApi from "../../../apis/user";
import { getRoleName } from "../../../utils";

export const UpdateRoleModal = ({
	user,
	open,
	onCancel,
	allRoles,
	onSuccess,
}) => {
	const formRef = useRef();

	const [loading, setLoading] = useState(false);

	const roleOptions = allRoles?.map((e) => {
		return {
			value: e.id,
			label: getRoleName(e.name),
		};
	});

	const handleUpdateRole = async (values) => {
		const { roleId } = values;
		setLoading(true);
		const success = await UserApi.updateUserRole(user.userId, roleId);
		if (success) {
			message.success("Cập nhật vai trò thành công");
			onSuccess();
		} else {
			message.error("Cập nhật vai trò thất bại");
		}
		setLoading(false);
		onCancel();
	};

	return (
		<BaseModal
			open={open}
			onCancel={onCancel}
			title="Cập nhật vai trò"
			confirmLoading={loading}
			onOk={() => formRef.current?.submit()}
		>
			<Form
				ref={formRef}
				initialValues={{
					roleId: user?.roleId,
				}}
				onFinish={handleUpdateRole}
			>
				<Form.Item
					name="roleId"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn vai trò",
						},
					]}
				>
					<Select options={roleOptions} placeholder="Chọn vai trò" />
				</Form.Item>
			</Form>
		</BaseModal>
	);
};
