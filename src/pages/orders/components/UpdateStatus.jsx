import React, { useEffect, useRef, useState } from "react";
import { Form, Input, message } from "antd";
import BaseModal from "../../../components/BaseModal";
import OrderApi from "../../../apis/order";
import { OrderStatus } from "../../../constants/enum";

export const UpdateStatus = ({ id, data, open, onCancel, onSuccess }) => {
  const isCreate = !data;
  const typeMessage = "Cập nhật";

  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const [columns, setColumns] = useState([
    {
        id: OrderStatus.PENDING,
        title: "Chờ báo giá",
    },
    {
        id: OrderStatus.REQUEST,
        title: "Chờ duyệt",
    },
    {
        id: OrderStatus.REJECT,
        title: "Từ chối",
    },
    {
        id: OrderStatus.APPROVE,
        title: "Đã duyệt",
    },
    {
        id: OrderStatus.IN_PROGRESS,
        title: "Đang tiến hành",
    },
    {
        id: OrderStatus.CANCEL,
        title: "Đã hủy",
    },
    {
        id: OrderStatus.COMPLETED,
        title: "Hoàn thành",
    },
]);


  const handleUpdateRole = async (status) => {
    setLoading(true);
    let taskStatus;
    switch (finish.id) {
      case OrderStatus.PENDING:
        taskStatus = TaskStatus.new;
        break;
      case OrderStatus.REQUEST:
        taskStatus = TaskStatus.inProgress;
        break;
      case OrderStatus.REJECT:
        taskStatus = TaskStatus.pending;
        break;
      case OrderStatus.APPROVE:
        taskStatus = TaskStatus.completed;
        break;
      case OrderStatus.IN_PROGRESS:
        taskStatus = TaskStatus.inProgress;
        break;
      case OrderStatus.CANCEL:
        taskStatus = TaskStatus.pending;
        break;
      case OrderStatus.COMPLETED:
        taskStatus = TaskStatus.completed;
        break;
      default:
        taskStatus = TaskStatus.new;
        break;
    }
    const success = await OrderApi.updateOrderStatus(status, id);
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
      title={`${typeMessage} loại vật liệu`}
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
