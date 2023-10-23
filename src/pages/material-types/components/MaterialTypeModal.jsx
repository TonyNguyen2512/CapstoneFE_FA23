import React, { useEffect, useRef, useState } from "react";
import { Form, Input, message } from "antd";
import BaseModal from "../../../components/BaseModal";
import MaterialCategoryApi from "../../../apis/material-category";

export const MaterialTypeModal = ({ data, open, onCancel, onSuccess }) => {
  const isCreate = !data;
  const typeMessage = isCreate ? "Tạo" : "Cập nhật";

  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async (values) => {
    setLoading(true);
    const success = isCreate
      ? await MaterialCategoryApi.createMaterialCategory(values)
      : await MaterialCategoryApi.updateMaterialCategory(values);
    if (success) {
      message.success(`${typeMessage} thành công`);
      onSuccess();
    } else {
      message.error(`${typeMessage} thất bại`);
    }
    setLoading(false);
    onCancel();
  };

  useEffect(() => {
    console.log(isCreate, data);
  }, []);

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={`${typeMessage} Loại vật liệu`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form
        ref={formRef}
        initialValues={{
          id: data?.id,
          name: data?.name,
          isDeleted: data?.isDeleted,
        }}
        onFinish={handleUpdateRole}
      >
        {!isCreate && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên loại vật liệu",
            },
          ]}
        >
          <Input showCount maxLength={255} placeholder="Tên loại vật liệu..." />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
