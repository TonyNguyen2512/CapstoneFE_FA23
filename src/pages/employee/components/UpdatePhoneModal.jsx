import BaseModal from "../../../components/BaseModal";
import React, { useRef, useState } from "react";
import { Form, Input, Select, message } from "antd";
import UserApi from "../../../apis/user";

export const UpdatePhoneModal = ({ data, open, onCancel, onSuccess }) => {
  const formRef = useRef();

  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async (values) => {
    setLoading(true);
    const success = await UserApi.updateUserPhone(values);
    if (success) {
      message.success("Cập nhật số điện thoại thành công");
      onSuccess();
    } else {
      message.error("Cập nhật số điện thoại thất bại");
    }
    setLoading(false);
    success && onCancel();
  };

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={`Cập nhật số điện thoại`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form
        layout="vertical"
        ref={formRef}
        initialValues={{
          id: data?.id,
          phoneNumber: data?.phoneNumber ? data?.phoneNumber : data?.userName,
        }}
        onFinish={handleUpdateRole}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="Nhập số điện thoại..." />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
