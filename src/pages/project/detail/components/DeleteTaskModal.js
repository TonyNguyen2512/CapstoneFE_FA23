import React, { useState } from "react";
import BaseModal from "../../../../components/BaseModal";
import TaskApi from "../../../../apis/task";
import { message } from "antd";

export const DeleteTaskModal = ({ open, onCancel, task, onSuccess }) => {
	const [loading, setLoading] = useState(false);

	const handleDelete = () => {
		setLoading(true);
		const { taskId } = task;
		TaskApi.deleteTask(taskId).then((success) => {
			if (!success) {
				message.error("Có lỗi xảy ra");
			} else {
				onSuccess();
			}
			setLoading(false);
			onCancel();
		});
	};

	return (
		<BaseModal
			open={open}
			onCancel={onCancel}
			title="Bạn muốn xóa công việc này?"
			okType="danger"
			onOk={handleDelete}
			confirmLoading={loading}
		></BaseModal>
	);
};
