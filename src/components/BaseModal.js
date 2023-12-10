import { Modal, Typography } from "antd";
import React from "react";

const { Title } = Typography;

const BaseModal = ({
  open,
  onCancel,
  title,
  children,
  onOk,
  okType,
  confirmLoading,
  okButtonProps,
  cancelButtonProps,
  width,
  okText,
  footer,
}) => {
  return (
    <Modal
      destroyOnClose
      okText={okText ?? "Xác nhận"}
      cancelText="Hủy"
      open={open}
      onCancel={onCancel}
      title={<Title level={4}>{title}</Title>}
      maskClosable={false}
      onOk={onOk}
      confirmLoading={confirmLoading}
      okType={okType}
      okButtonProps={okButtonProps}
      cancelButtonProps={cancelButtonProps}
      width={width}
      footer={footer}
    >
      {children}
    </Modal>
  );
};

export default BaseModal;
