import React from "react";
import BaseModal from "./BaseModal";

export const ConfirmDeleteModal = ({
	open,
	onCancel,
	title,
	onOk,
	loading,
}) => {
	return (
		<BaseModal
			open={open}
			onCancel={onCancel}
			title={title}
			okType="danger"
			onOk={onOk}
			confirmLoading={loading}
		></BaseModal>
	);
};
