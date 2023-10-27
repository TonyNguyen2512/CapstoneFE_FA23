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
import dayjs from "dayjs";

export const MaterialModal = ({ data, open, onCancel, onSuccess }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [placement, SetPlacement] = useState("topLeft");
  const { token } = theme.useToken();
  const [color, setColor] = useState(token.colorPrimary);

  const btnStyle = {
    width: "100%",
    height: "35px",
    backgroundColor: color,
    margin: "center",
  };

  const dateFormat = "DD/MM/YYYY";
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";

  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  console.log({...data, importDate : dayjs(data?.importDate , "DD/MM/YYYY")});
  console.log(data)

  const handleMaterial = async (values) => {
    setLoading(true);
    const body = {...values, color: typeof color === "string" ? color : color.toHexString()};
    const success = isCreate
      ? await MaterialApi.createMaterial(body)
      : await MaterialApi.updateMaterial(body);
      console.log(values);
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
          importDate: data && data.importDate ? dayjs(data.importDate) : null,
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
          <Input placeholder="Tên loại vật liệu..." />
        </Form.Item>
        <Form.Item
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
        </Form.Item>
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
          <ColorPicker value={color} onChange={(color) => setColor(color.toHexString())}>
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
          name="image"
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
              listType="picture"
              beforeUpload={() => { return false }}
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
