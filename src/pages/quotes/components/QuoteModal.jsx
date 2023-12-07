import React, { useEffect, useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Button, Form, Input, Progress, Select, Space, Upload, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { getRoleName } from "../../../utils";
import storage, { contractsRef, quotesRef } from "../../../middleware/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import QuoteApi from "../../../apis/quotes";
import { UploadOutlined } from "@ant-design/icons";

export const QuoteModal = ({ data, users, isCreate, open, onCancel, onSuccess }) => {
  const dateFormat = "DD/MM/YYYY";
  const formRef = useRef();
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(-1);

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
        setProgress(-1);
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
        setProgress(-1);
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
    const body = { ...values, fileQuote: quoteUrl, fileContract: contractUrl };
    const response = isCreate ? await QuoteApi.createQuote(body) : await QuoteApi.updateQuote(body);
    if (!response.errorMessage) {
      message.success(`${typeMessage} thành công`);
      onSuccess();
    } else {
      message.error(response.errorMessage);
    }
    setLoading(false);
    !response.errorMessage && onCancel();
  };

  return (
    <BaseModal
      open={open}
      width={"50%"}
      onCancel={onCancel}
      confirmLoading={loading}
      title={`${typeMessage} báo giá`}
      onOk={() => formRef.current?.submit()}
    >
      {progress > 0 && <Progress percent={progress} />}
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
          label="Tên báo giá"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên báo giá",
            },
          ]}
        >
          <Input placeholder="Tên báo giá..." />
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
