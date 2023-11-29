import BaseModal from "../../../components/BaseModal";
import React, { useRef, useState } from "react";
import { Form, Select, message } from "antd";
import UserApi from "../../../apis/user";

export const UpdateRoleModal = ({ user, open, onCancel, roleOptions, onSuccess }) => {
  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [roleId, setRoleId] = useState(user?.roleId || user?.role?.id || "");

  const handleUpdateRole = async (values) => {
    const { roleId } = values;
    setLoading(true);
    const success = await UserApi.updateUserRole(user.id, roleId);
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
      title={`Cập nhật vai trò`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form
        ref={formRef}
        initialValues={{
          roleId: user?.roleId || user?.role?.id,
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
          <Select
            options={roleOptions}
            placeholder="Chọn vai trò..."
            onChange={(e) => setRoleId(e)}
          />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
