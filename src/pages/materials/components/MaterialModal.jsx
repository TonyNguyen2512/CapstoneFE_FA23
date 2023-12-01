import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Space,
  Upload,
  message,
} from "antd";
import BaseModal from "../../../components/BaseModal";
import MaterialApi from "../../../apis/material";
import { MaterialSelect } from "./MaterialSelect";
import { useSearchParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import storage, { imagesMaterialRef } from "../../../middleware/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// const initValues = {
//   id: "",
//   name: "",
//   color: "",
//   price: 0,
//   thickness: 0,
//   supplier: "",
//   importDate: null,
//   importPlace: "",
//   image: "",
//   unit: "",
//   amount: 0,
//   materialCategoryId: "",
// };

export const MaterialModal = ({ data, open, onCancel, onSuccess }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [color, setColor] = useState(data?.color);
  const [form] = Form.useForm();
  const dateFormat = "DD/MM/YYYY";
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [materialImage, setMaterialImage] = useState(data?.image ?? "");
  const formRef = useRef();

  const btnStyle = {
    width: "100%",
    height: "35px",
    margin: "center",
  };

  const handleUploadImage = (event) => {
    setLoading(true);
    const file = event.file;
    const fileName = event.file?.name;
    const uploadTask = uploadBytesResumable(ref(imagesMaterialRef, fileName), file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // update progress
        setProgress(percent);
      },
      (err) => {
        console.log(err);
        setLoading(false);
      },
      () => {
        setProgress(0);
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          formRef.current?.setFieldValue("image", url);
          setMaterialImage(url);
        });
      }
    );
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    console.log("asdsdgafhgdjf", values);
    const body = {
      ...values,
      color: typeof color === "string" ? color : color?.toHexString(),
      image: materialImage,
    };
    const success = isCreate
      ? await MaterialApi.createMaterial(body)
      : await MaterialApi.updateMaterial(body);
    if (success) {
      message.success(`${typeMessage} thành công`);
      form.resetFields();
      onSuccess();
    } else {
      message.error(`${typeMessage} thất bại`);
    }
    setLoading(false);
    success && onCancel();
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
  useEffect(() => {}, [data]);

  return (
    <BaseModal
      open={open}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      title={`${typeMessage} vật liệu`}
      confirmLoading={loading}
      onOk={() => {
        form.submit();
      }}
    >
      <Form form={form} initialValues={data} onFinish={handleSubmit} layout="vertical">
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
          name="materialCategoryId"
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
        <Form.Item name="color" label="Màu vật liệu">
          <ColorPicker
            onChange={(value) => {
              setColor(value.toHexString());
              form.setFieldValue("color", value.toHexString());
            }}
          >
            <Button
              type="primary"
              style={{
                ...btnStyle,
                backgroundColor: color || form.getFieldValue("color"),
              }}
              align="center"
            ></Button>
          </ColorPicker>
        </Form.Item>

        <Space className="w-full justify-start">
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
              placeholder="Độ dày..."
            />
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
            <Input
              style={{
                width: "155%",
              }}
              placeholder="Đơn vị đo..."
            />
          </Form.Item>
        </Space>
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
            placeholder="Đơn giá..."
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
        <Form.Item name="image" label="Hình ảnh">
          <Space
            direction="vertical"
            style={{
              width: "100%",
            }}
            size="large"
          >
            <Upload
              listType="picture"
              defaultFileList={[
                {
                  uid: data?.id,
                  url: data?.image,
                },
              ]}
              beforeUpload={() => false}
              onChange={handleUploadImage}
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
