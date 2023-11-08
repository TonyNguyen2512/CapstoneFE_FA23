import React, { useEffect, useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Button, Form, Input, Select, Space, Upload, message } from "antd";
import OrderApi from "../../../apis/order";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import UserApi from "../../../apis/user";
import { roles } from "../../../constants/app";
import { getRoleName } from "../../../utils";

export const OrderModal = ({ data, users, isCreate, open, onCancel, onSuccess }) => {
  const dateFormat = "DD/MM/YYYY";
  const formRef = useRef();
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";
  const [loading, setLoading] = useState(false);

  const handleUploadQuote = (event) => {
    let fileName = event.target?.name ?? event.target?.uid;
  };

  const handleUploadContract = (event) => {
    let fileName = event.target?.name ?? event.target?.uid;
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const body = { ...values };
    const success = isCreate ? await OrderApi.createOrder(body) : await OrderApi.updateOrder(body);
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
      width={"50%"}
      onCancel={onCancel}
      confirmLoading={loading}
      title={`${typeMessage} đơn hàng`}
      onOk={() => formRef.current?.submit()}
    >
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={{ ...(data || {}) }}
        onFinish={handleSubmit}
      >
        {!isCreate && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name="name"
          label="Tên đơn hàng"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên đơn hàng",
            },
          ]}
        >
          <Input placeholder="Tên đơn hàng..." />
        </Form.Item>
        <Form.Item
          name="customerName"
          label="Khách hàng"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên khách hàng",
            },
          ]}
        >
          <Input placeholder="Tên khách hàng..." />
        </Form.Item>
        <Space direction="horizontal" className="w-full grid grid-cols-2 gap-3">
          <Form.Item
            className="w-full"
            name="fileQuote"
            label="Bảng báo giá"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Space
              direction="vertical"
              style={{
                width: "100%",
              }}
            >
              <Upload
                listType="picture"
                beforeUpload={() => false}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                // disabled={!!formRef.current?.getFieldValue("fileQuote")}
                onChange={handleUploadQuote}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Space>
          </Form.Item>
          <Form.Item className="w-full" name="fileContract" label="Bảng hợp đồng">
            <Space
              direction="vertical"
              style={{
                width: "100%",
              }}
            >
              <Upload
                listType="picture"
                beforeUpload={() => false}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                // disabled={!!formRef.current?.getFieldValue("fileContract")}
                onChange={handleUploadContract}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Space>
          </Form.Item>
        </Space>
        <Form.Item
          name="assignToId"
          label="Người báo giá"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên khách hàng",
            },
          ]}
        >
          <Select
            options={users.map((v) => {
              return {
                label: `${v.fullName} - ${v.userName} (${getRoleName(v.role)})`,
                value: v.id,
              };
            })}
            placeholder="Tên khách hàng..."
          />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <TextArea
            type="textarea"
            autoSize={{ minRows: "3", maxRows: "6" }}
            placeholder="Mô tả chi tiết..."
          />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
