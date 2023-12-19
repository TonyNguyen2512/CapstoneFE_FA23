import React, { useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Form, Input, message } from "antd";
import UserApi from "../../../apis/user";

export const ChangePasswordModal = ({ userId, open, onCancel, onSuccess }) => {
  const formRef = useRef();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const response = await UserApi.changePassword({ id: userId, ...values });
    if (response && !response.errorMessage) {
      message.success(`Đổi mật khẩu thành công!`);
      onSuccess();
    } else {
      message.error(`Đổi mật khẩu thất bại! ${response?.errorMessage || ""}`);
    }
    setLoading(false);
    response && onCancel();
  };

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={`Thay đổi mật khẩu`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form layout="vertical" ref={formRef} onFinish={handleSubmit}>
        <Form.Item
          name="oldPassword"
          label="Mật khẩu hiện tại"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu hiện tại",
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu hiện tại..." />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          dependencies={["oldPassword"]}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu mới",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("oldPassword") !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu mới không được trùng với mật khẩu hiện tại!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới..." />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Vui lòng xác nhận mật khẩu mới",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Xác nhận mật khẩu không khớp với mật khẩu mới!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập xác nhận mật khẩu mới..." />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
