import React, { useEffect, useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Button, DatePicker, Form, Input, Select, Space, Upload, message } from "antd";
import OrderApi from "../../../apis/order";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { getRoleName } from "../../../utils";
import storage, { contractsRef, quotesRef } from "../../../middleware/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { locale } from "dayjs";

export const OrderModal = ({ data, users, isCreate, open, onCancel, onSuccess }) => {
  const dateFormat = "DD/MM/YYYY";
  const formRef = useRef();
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [quoteUrl, setQuoteUrl] = useState(data?.fileQuote ?? "");
  const [contractUrl, setContractUrl] = useState(data?.fileContract ?? "");

  const handleUploadQuote = (event) => {
    setLoading(true);
    const file = event.file;
    const fileName = event.file?.name;
    const uploadTask = uploadBytesResumable(ref(quotesRef, fileName), file);
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
          formRef.current.setFieldValue("fileQuote", url);
          setQuoteUrl(url);
        });
      }
    );
    setLoading(false);
  };

  const handleUploadContract = (event) => {
    setLoading(true);
    const file = event.file;
    const fileName = event.file?.name;
    const uploadTask = uploadBytesResumable(ref(contractsRef, fileName), file);
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
          formRef.current.setFieldValue("fileContract", url);
          setContractUrl(url);
        });
      }
    );
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    console.log(values);
    const dates = values.dates;
    const startTime = dates?.[0];
    const endTime = dates?.[1];
    const body = {
      ...values,
      fileQuote: quoteUrl,
      fileContract: contractUrl,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    };
    const success = isCreate ? await OrderApi.createOrder(body) : await OrderApi.updateOrder(body);
    if (success) {
      message.success(`${typeMessage} thành công`);
      onSuccess();
    } else {
      message.error(`${typeMessage} thất bại`);
    }
    setLoading(false);
    success && onCancel();
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
      {/* <div>
        <input type="file" accept="image/*" onChange={handleChange} />
        <button>Upload to Firebase</button>
      </div> */}
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
                accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
                accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
                label: `${v.fullName} - ${v.userName}`,
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
        <Form.Item
          name="dates"
          label="Ngày bắt đầu và kết thúc"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên khách hàng",
            },
          ]}
        >
          <DatePicker.RangePicker
            className="w-full"
            placeholder={["Bắt đầu", "Kết thúc"]}
            format="HH:mm DD/MM/YYYY"
            showTime={{
              format: "HH:mm",
            }}
            locale={locale}
          />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
