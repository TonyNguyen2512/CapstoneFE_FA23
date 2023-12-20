import React, { useRef, useState } from "react";
import { Button, Card, Col, Form, Input, Progress, Row, Select, Upload, message } from "antd";
import ItemApi from "../../../../apis/item";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { UploadOutlined } from "@ant-design/icons";
import { drawingsRef } from "../../../../middleware/firebase";
import BaseModal from "../../../../components/BaseModal";
import OrderDetailApi from "../../../../apis/order-details";
import TextArea from "antd/lib/input/TextArea";

export const ItemOrderModal = ({ orderId, data, listItem, open, onCancel, onSuccess }) => {
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";
  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [drawings2D, setDrawings2D] = useState(data?.drawings2D ?? "");
  const [drawings3D, setDrawings3D] = useState(data?.drawings3D ?? "");
  const [drawingsTechnical, setDrawingsTechnical] = useState(data?.drawingsTechnical ?? "");
  const [progress, setProgress] = useState(-1);

  const handleUploadDrawing2D = (event) => {
    setLoading(true);
    const file = event.file;
    const fileName = event.file?.name;
    const uploadTask = uploadBytesResumable(ref(drawingsRef, fileName), file);
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
          formRef.current.setFieldValue("drawings2D", url);
          setDrawings2D(url);
        });
      }
    );
    setLoading(false);
  };

  const handleUploadDrawing3D = (event) => {
    setLoading(true);
    const file = event.file;
    const fileName = event.file?.name;
    const uploadTask = uploadBytesResumable(ref(drawingsRef, fileName), file);
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
          formRef.current.setFieldValue("drawings3D", url);
          setDrawings3D(url);
        });
      }
    );
    setLoading(false);
  };

  const handleUploadDrawingTechnical = (event) => {
    setLoading(true);
    const file = event.file;
    const fileName = event.file?.name;
    const uploadTask = uploadBytesResumable(ref(drawingsRef, fileName), file);
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
          formRef.current.setFieldValue("drawingsTechnical", url);
          setDrawingsTechnical(url);
        });
      }
    );
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    const payload = {
      ...values,
      drawings2D,
      drawings3D,
      drawingsTechnical,
      orderId,
    };

    const success = isCreate
      ? await OrderDetailApi.createOrderDetail(payload)
      : await OrderDetailApi.updateOrderDetail(payload);
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
      width={"60%"}
      open={open}
      onCancel={onCancel}
      confirmLoading={loading}
      title={`${typeMessage} sản phẩm`}
      onOk={() => formRef.current?.submit()}
    >
      {progress > 0 && <Progress percent={progress} />}
      <Form
        layout="vertical"
        ref={formRef}
        initialValues={{
          ...(data || {
            quantity: 1,
          }),
        }}
        onFinish={handleSubmit}
      >
        {!isCreate && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Row gutter={[16, 16]}>
          <Col span={20}>
            <Form.Item
              name="itemName"
              label="Sản phẩm"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn sản phẩm",
                },
              ]}
            >
              <Select showSearch options={listItem} placeholder="Chọn sản phẩm..." />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số lượng",
                },
              ]}
            >
              <Input placeholder="Số lượng..." type="number" min={1} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="description" label="Mô tả">
          <TextArea placeholder="Mô tả..." />
        </Form.Item>
        {!isCreate && (
          <>
            <Form.Item name="drawings2D" label="Bản vẽ 2D">
              <Upload
                listType="picture"
                beforeUpload={() => false}
                accept=".jpg,.jepg,.png,.svg,.bmp"
                onChange={handleUploadDrawing2D}
                maxCount={1}
                defaultValue=""
              >
                <Button icon={<UploadOutlined />}>Tải lên</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="drawings3D" label="Bản vẽ 3D">
              <Upload
                listType="picture"
                beforeUpload={() => false}
                onChange={handleUploadDrawing3D}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Tải lên</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="drawingsTechnical" label="Bảng vẽ kỹ thuật">
              <Upload
                listType="picture"
                beforeUpload={() => false}
                onChange={handleUploadDrawingTechnical}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Tải lên</Button>
              </Upload>
            </Form.Item>
          </>
        )}
        {/* hidden data */}
        <Form.Item name="listMaterial" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="listProcedure" hidden>
          <Input />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
