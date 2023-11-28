import React, { useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Button, Form, Input, message } from "antd";
import ItemApi from "../../../apis/item";

export const ItemDuplicateModal = ({ data, open, onCancel, onSuccess }) => {
  const typeMessage = "Nhân bản";
  const formRef = useRef();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    // const numValue = Number(values.num);
    // const body = { ...values, num: numValue }; // Ensure the key is 'num' and not 'numValue'

    // const success = await ItemApi.duplicateItem(body);
    // if (success) {
    //   message.success(`${typeMessage} thành công`);
    //   onSuccess();
    // } else {
    //   message.error(`${typeMessage} thất bại`);
    //   message.error(response.message);
    // }
    // setLoading(false);
    // onCancel();
    try {
      const numValue = Number(values.num);
      const body = { ...values, num: numValue };
      const response = await ItemApi.duplicateItem(body);
      console.log("Request URL:", ItemApi.duplicateItem());

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
            num: 1,
          }),
        }}
        onFinish={handleSubmit}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="num"
          label="Số lượng nhân bản"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số lượng muốn nhân bản sản phẩm",
            },
          ]}
        >
          <Input placeholder="Nhập số lượng muốn nhân bản..." />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
