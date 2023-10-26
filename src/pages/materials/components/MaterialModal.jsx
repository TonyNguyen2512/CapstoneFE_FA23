import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  theme,
} from "antd";
import BaseModal from "../../../components/BaseModal";
import MaterialApi from "../../../apis/material";
import { MaterialSelect } from "./MaterialSelect";

export const MaterialModal = ({ data, open, onCancel, onSuccess }) => {
  const { token } = theme.useToken();
  const [color, setColor] = useState(token.colorPrimary);
  const bgColor = useMemo(() => (typeof color === "string" ? color : color.toHexString()), [color]);
  const btnStyle = {
    width: "100%",
    height: "35px",
    backgroundColor: bgColor,
    margin: "center",
  };

  const dateFormat = "DD/MM/YYYY";
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";

  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async (values) => {
    setLoading(true);
    const success = isCreate
      ? await MaterialApi.createMaterial(values)
      : await MaterialApi.updateMaterial(values);
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
      title={`${typeMessage} vật liệu`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form
        ref={formRef}
        initialValues={{
          name: data?.name,
          categoryId: data?.categoryId,
          price: data?.price,
          thickness: data?.thickness,
          supplier: data?.supplier,
          importDate: data?.importDate,
          importPlace: data?.importPlace,
          image: data?.image,
          color: data?.color,
          isDeleted: data?.isDeleted,
        }}
        onFinish={handleUpdateRole}
        layout="vertical"
      >
        {!isCreate && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name="name"
          label="Tên vật liệu"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên loại liệu",
            },
          ]}
        >
          <Input showCount maxLength={255} placeholder="Tên loại vật liệu..." />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại vật liệu"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên loại vật liệu",
            },
          ]}
        >
          <MaterialSelect />
        </Form.Item>
        <Form.Item
          name="color"
          label="Màu vật liệu"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên loại vật liệu",
            },
          ]}
        >
          <ColorPicker value={color} onChange={setColor}>
            <Button type="primary" style={btnStyle} align="center"></Button>
          </ColorPicker>
        </Form.Item>
        <Form.Item
          name="amount"
          label="Số lượng"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên loại vật liệu",
            },
          ]}
        >
          <InputNumber
            style={{
              width: "100%",
            }}
            placeholder="Tên loại vật liệu..."
          />
        </Form.Item>
        <Form.Item
          name="thickness"
          label="Độ dày"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên loại vật liệu",
            },
          ]}
        >
          <InputNumber
            style={{
              width: "100%",
            }}
            placeholder="Tên loại vật liệu..."
          />
        </Form.Item>
        <Form.Item
          name="price"
          label="Đơn giá"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên loại vật liệu",
            },
          ]}
        >
          <InputNumber
            suffix="VNĐ"
            style={{
              width: "100%",
            }}
            placeholder="Tên loại vật liệu..."
          />
        </Form.Item>
        <Form.Item
          name="supplier"
          label="Nhà cung cấp"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên loại vật liệu",
            },
          ]}
        >
          <Input placeholder="Tên loại vật liệu..." />
        </Form.Item>
        <Form.Item
          name="importPlace"
          label="Nơi nhập"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên loại vật liệu",
            },
          ]}
        >
          <Input placeholder="Tên loại vật liệu..." />
        </Form.Item>
        <Form.Item
          name="importDate"
          label="Ngày nhập"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên loại vật liệu",
            },
          ]}
        >
          <DatePicker
            readOnly={true}
            style={{
              width: "100%",
            }}
            format={dateFormat}
            placeholder="Chọn ngày nhập vật liệu..."
          />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
