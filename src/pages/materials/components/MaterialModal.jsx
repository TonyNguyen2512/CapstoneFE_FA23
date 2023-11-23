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

export const MaterialModal = ({ data, open, onCancel, onSuccess, isCreate }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialValues, setInitialValues] = useState();
  const [color, setColor] = useState();
  const [form] = Form.useForm();
  const dateFormat = "DD/MM/YYYY";
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [materialImage, setMaterialImage] = useState(data?.image ?? "");
  const formRef = useRef();

  console.log({ ...data, importDate: dayjs(data?.importDate, "DD/MM/YYYY") });
  console.log("Data: ", data);

  const handleValue = (values) => {
    form.setFieldsValue(values);
  };

  const btnStyle = {
    width: "100%",
    height: "35px",
    // backgroundColor: form.getFieldValue("color"),
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
          formRef.current.setFieldValue("image", url);
          setMaterialImage(url);
        });
      }
    );
    setLoading(false);
  };

  const handleMaterial = async (values) => {
    setLoading(true);
    console.log("asdsdgafhgdjf", values);
    const body = { ...values, color: typeof color === "string" ? color : color.toHexString() };
    const success = isCreate
      ? await MaterialApi.createMaterial(body)
      : await MaterialApi.updateMaterial(body);
    if (success) {
      message.success(`${typeMessage} thành công`);
      onSuccess();
    } else {
      message.error(`${typeMessage} thất bại`);
    }
    setInitialValues(values);
    setLoading(false);
    onCancel();
  };

  useEffect(() => {
    handleValue({
      id: data?.id,
      name: data?.name,
      color: data?.color,
      price: data?.price,
      thickness: data?.thickness,
      supplier: data?.supplier,
      importDate: data && data.importDate ? dayjs(data.importDate) : null,
      importPlace: data?.importPlace,
      image: data?.image,
      isDeleted: data?.isDeleted,
      unit: data?.unit,
      amount: data?.amount,
      materialCategoryId: data?.materialCategoryId,
    });
  }, [data]);

  console.log(data);
  console.log(form.getFieldValue("color"));

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

  useEffect(() => {
    // console.log(form.getFieldValue("color"), color);
  }, [form, color]);

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
        form.resetFields();
      }}
    >
      <Form form={form} initialValues={initialValues} onFinish={handleMaterial} layout="vertical">
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
              style={{ ...btnStyle, backgroundColor: color || form.getFieldValue("color") }}
              align="center"
            ></Button>
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
          // rules={[
          //   {
          //     required: true,
          //     message: "Vui lòng nhập tên loại vật liệu",
          //   },
          // ]}
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
              beforeUpload={() => {
                return false;
              }}
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
