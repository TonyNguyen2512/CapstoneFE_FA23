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
  const [gender, setGender] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (val) => {
    const payload = { ...val, phoneNumber: val.phoneNumber, gender };
    setLoading(true);
    console.log(roleName);
    const response = isCreate
      ? await UserApi.createUser(roleName, payload)
      : await UserApi.updateUserInfo(payload);
    if (!response || !response.errorMessage) {
      message.success(`${typeMessage} thành công`);
      onSuccess();
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
        initialValues={{
          ...data,
          dob: data?.dob ? dayjs(data.dob) : null,
          phoneNumber: data?.phoneNumber || data?.userName,
        }}
        onFinish={handleSubmit}
      >
        {isCreate ? (
          <>
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
                showSearch
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
            <Form.Item name="userName" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="roleId" hidden>
              <Input />
            </Form.Item>
          </>
        )}
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="Nhập số điện thoại..." />
        </Form.Item>
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
        <Form.Item name="gender" label="Giới tính">
          <Select
            placeholder="Giới tính..."
            onChange={(e) => setGender(e)}
            options={[
              { label: "Nam", value: 0 },
              { label: "Nữ", value: 1 },
              { label: "Khác", value: 2 },
            ]}
          />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
