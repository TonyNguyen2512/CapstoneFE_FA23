import React, { useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Button, Form, Input, message } from "antd";
import ItemApi from "../../../apis/item";
import { useParams } from "react-router-dom";

export const ItemDuplicateModal = ({ data, id, open, onCancel, onSuccess }) => {
  const typeMessage = "Sao chép";
  const formRef = useRef();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const numValue = Number(values.number);
      const response = await ItemApi.duplicateItem(id, numValue); // Fix: Pass 'numValue' instead of 'number'
      console.log("Request URL:", ItemApi.duplicateItem(id, numValue));

      // Check if the API call was successful
      if (response.code === 0) {
        message.success(`${typeMessage} thành công`);
        onSuccess();
      } else {
        // Display API error message
        message.error(response.errorMessage || `${typeMessage} thất bại`);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("API Error:", error);
      message.error("Đã xảy ra lỗi không mong muốn");
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      confirmLoading={loading}
      title={`${typeMessage} sản phẩm`}
      onOk={() => formRef.current?.submit()}
    >
      <Form
        layout="vertical"
        ref={formRef}
        initialValues={{
          ...(data || {
            number: 1,
          }),
        }}
        onFinish={handleSubmit}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="number"
          label="Số lượng sao chép"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số lượng muốn sao chép sản phẩm",
            },
          ]}
        >
          <Input placeholder="Nhập số lượng muốn sao chép..." />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
