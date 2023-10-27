import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Upload,
  message,
  theme,
} from "antd";
import BaseModal from "../../../components/BaseModal";
import MaterialApi from "../../../apis/material";
import { MaterialSelect } from "./MaterialSelect";
import { useSearchParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

export const MaterialModal = ({ data, open, onCancel, onSuccess }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [placement, SetPlacement] = useState("topLeft");
  // const { token } = theme.useToken();
  // const [color, setColor] = useState(token.colorPrimary);
  // const bgColor = useMemo(() => (typeof color === "string" ? color : color.toHexString()), [color]);

  const [color, setColor] = useState("#ffffff");

  const handleColorChange = (newColor) => {
    setColor(newColor.toHexString());
  };

  const btnStyle = {
    width: "100%",
    height: "35px",
    backgroundColor: color,
    margin: "center",
  };
  console.log("Color: ", color);

  const dateFormat = "DD/MM/YYYY";
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";

  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleMaterial = async (values) => {
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
  }, [searchParams]);

  const placementChange = (e) => {
    SetPlacement(e.target.value);
  };

  const handleChangeMaterial = (id) => {
    setSearchParams({
      material: id,
    });
  };

  const onMaterialsLoaded = (data) => {
    if (data && data.length > 0) {
      searchParams.set("material", data[0].id);
      setSearchParams(searchParams);
    }
  };

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
          color: data?.color,
          price: data?.price,
          thickness: data?.thickness,
          supplier: data?.supplier,
          importDate: data?.importDate,
          importPlace: data?.importPlace,
          image: data?.image,
          isDeleted: data?.isDeleted,
          categoryId: data?.categoryId,
        }}
        onFinish={handleMaterial}
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
        {/* <Form.Item
          name="categoryId"
          label="Loại vật liệu"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn tên loại vật liệu",
            },
          ]}
        >
          <MaterialSelect
            value={searchParams.get("material")}
            onChange={handleChangeMaterial}
            onLoaded={onMaterialsLoaded}
          />
        </Form.Item> */}
        <Form.Item
          name="color"
          label="Màu vật liệu"
          // rules={[
          //   {
          //     required: true,
          //     message: "Vui lòng nhập tên loại vật liệu",
          //   },
          // ]}
        >
          <ColorPicker value={color} onChange={handleColorChange}>
            <Button type="primary" style={btnStyle} align="center"></Button>
          </ColorPicker>
        </Form.Item>
        <Form.Item
          name="unit"
          label="Đơn vị đo"
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
            inputReadOnly="true"
            style={{
              width: "100%",
            }}
            format={dateFormat}
            placeholder="Chọn ngày nhập vật liệu..."
          />
        </Form.Item>
        <Form.Item
          name="importDate"
          label="Chọn hình"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên loại vật liệu",
            },
          ]}
        >
          <Space
            direction="vertical"
            style={{
              width: "100%",
            }}
            size="large"
          >
            <Upload
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Space>
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
