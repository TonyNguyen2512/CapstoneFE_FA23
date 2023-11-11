import React, { useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { DatePicker, Form, Input, Select, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { roles } from "../../../constants/app";
import UserApi from "../../../apis/user";

export const AccountModal = ({ data, roleOptions, open, onCancel }) => {
  const defaultRoleId = "9d6bc81a-65e6-4952-0f98-08dbe279bce0";
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";
  const formRef = useRef();

  const [roleName, setRoleName] = useState(roleOptions.find((r) => r.value === defaultRoleId).key);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (val) => {
    setLoading(true);
    const {} = val;
    console.log(val);
    const success = await UserApi.createUser(roleName, val);
    if (success) {
      message.success(`${typeMessage} thành công`);
    } else {
      message.error(`${typeMessage} thất bại`);
    }
    setLoading(false);
    success && onCancel();
  };

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={`${typeMessage} tài khoản`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form layout="vertical" ref={formRef} initialValues={data} onFinish={handleSubmit}>
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
          name="email"
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email" }]}
        >
          <Input placeholder="Nhập email..." />
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
        <Form.Item name="roleId" label="Vai trò">
          <Select
            defaultValue={"e0acdcdf-704a-49c6-6aad-08dbe2a052a2"}
            options={roleOptions}
            placeholder="Chọn cai trò..."
            onChange={(val) => {
              formRef.current.roleId = val;
              setRoleName(roleOptions.find((role) => role.id === val)?.name || roles.WORKER);
            }}
          />
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
