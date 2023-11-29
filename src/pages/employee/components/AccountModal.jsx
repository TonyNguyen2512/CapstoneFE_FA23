import React, { useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { DatePicker, Form, Input, Select, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import UserApi from "../../../apis/user";
import dayjs from "dayjs";

export const AccountModal = ({ data, roleOptions, open, onCancel, onSuccess }) => {
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";
  const formRef = useRef();

  const [roleName, setRoleName] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (val) => {
    setLoading(true);
    console.log(roleName);
    const response = isCreate
      ? await UserApi.createUser(roleName, val)
      : await UserApi.updateUserInfo(val);
    if (!response || !response.errorMessage) {
      message.success(`${typeMessage} thành công`);
      onSuccess()
    } else {
      message.error(`${typeMessage} thất bại. ${response.errorMessage}`);
    }
    setLoading(false);
    !response.errorMessage && onCancel();
  };

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={`${typeMessage} tài khoản`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form
        layout="vertical"
        ref={formRef}
        initialValues={{ ...data, data, dob: data?.dob ? dayjs(data.dob) : null }}
        onFinish={handleSubmit}
      >
        {isCreate ? (
          <>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
            >
              <Input placeholder="Nhập số điện thoại..." />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật Khẩu"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu..."
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item
              name="roleId"
              label="Vai trò"
              rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
            >
              <Select
                options={roleOptions}
                placeholder="Chọn vai trò..."
                onChange={(val) => {
                  console.log(roleOptions.find((role) => role.value === val).key);
                  formRef.current.roleId = val;
                  setRoleName(roleOptions.find((role) => role.value === val).key);
                }}
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="phoneNumber" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="userName" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="roleId" hidden>
              <Input />
            </Form.Item>
          </>
        )}
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email" }]}
        >
          <Input disabled={!isCreate} placeholder="Nhập email..." />
        </Form.Item>
        <Form.Item
          name="fullName"
          label="Họ tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input placeholder="Nhập họ tên..." />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input placeholder="Nhập địa chỉ..." />
        </Form.Item>
        <Form.Item name="dob" label="Ngày sinh">
          <DatePicker
            className="w-full"
            placeholder="Chọn ngày sinh..."
            format="DD/MM/YYYY"
            showTime={false}
          />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
