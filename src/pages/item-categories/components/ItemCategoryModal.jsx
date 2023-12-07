import React, { useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Form, Input, message } from "antd";
import ItemCategoryApi from "../../../apis/item-category";

export const ItemCategoryModal = ({ data, open, onCancel, onSuccess }) => {
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";
  const formRef = useRef();

  const [loading, setLoading] = useState(false);

  const handleUpdate = async (values) => {
    setLoading(true);
    const success = isCreate
      ? await ItemCategoryApi.createItem(values)
      : await ItemCategoryApi.updateItem(values);
    if (success) {
      message.success(`${typeMessage} thành công`);
      onSuccess();
    } else {
      message.error(`${typeMessage} thất bại`);
    }
    setLoading(false);
    onCancel();
  };

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={`${typeMessage} loại sản phẩm`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form layout="vertical" ref={formRef} initialValues={{ ...data }} onFinish={handleUpdate}>
        {!isCreate && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name="name"
          label="Tên loại sản phẩm"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên loại sản phẩm",
            },
          ]}
        >
          <Input placeholder="Nhập tên loại sản phẩm..." />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
