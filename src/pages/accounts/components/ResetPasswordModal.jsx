import React, { useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Form, Input, message } from "antd";
import UserApi from "../../../apis/user";

export const ResetPasswordModal = ({ data, open, onCancel, onSuccess }) => {
  const formRef = useRef();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const response = await UserApi.resetPassword({ phoneNumber: data?.userName, ...values });
    if (response && !response.errorMessage) {
      message.success(`Đặt lại mật khẩu thành công!`);
      onSuccess();
    } else {
      message.error(`Đặt lại mật khẩu thất bại! ${response?.errorMessage || ""}`);
    }
    setLoading(false);
    response && onCancel();
  };

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={`Đặt lại mật khẩu`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form layout="vertical" ref={formRef} onFinish={handleSubmit}>
        <div className="fs-6 my-3">
          Người dùng: {data?.fullName || ""} - {data?.userName || ""}
        </div>
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu mới",
            },
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
