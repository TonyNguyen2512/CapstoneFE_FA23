import React, { useRef, useState } from "react";
import { Button, Form, Input, Select, message } from "antd";
import BaseModal from "../../../components/BaseModal";
import OrderApi from "../../../apis/order";
import { orderLabels } from "../../../constants/enum";

export const UpdateStatus = ({ data, open, onCancel, onSuccess }) => {
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";
  const [loading, setLoading] = useState(false);
  const nextStep = data?.status === 1 || data?.status === 4 ? data?.status + 2 : data?.status + 1;
  const formRef = useRef();

  const handleSubmit = async (value) => {
    setLoading(true);
    const success = await OrderApi.updateOrderStatus(value.status, data?.id);
    if (success) {
      message.success(`${typeMessage} thành công`);
      onSuccess();
      onCancel();
    } else {
      message.error(`${typeMessage} thất bại`);
    }
    setLoading(false);
  };

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={`${typeMessage} trạng thái đơn hàng`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form ref={formRef} initialValues={data} onFinish={handleSubmit}>
        {!isCreate && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name="status"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn trạng thái",
            },
          ]}
        >
          <Select
            options={orderLabels.map((e, i) => {
              return { label: e, value: i };
            })}
            placeholder="Chọn trạng thái..."
          />
        </Form.Item>
        {data?.status < orderLabels.length && (
          <Button onClick={() => handleSubmit({ status: nextStep })}>
            Cập nhật thành <b> "{orderLabels[nextStep]}"</b>
          </Button>
        )}
      </Form>
    </BaseModal>
  );
};
