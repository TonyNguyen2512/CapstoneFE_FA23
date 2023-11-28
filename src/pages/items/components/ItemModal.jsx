import React, { useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Button, Card, Col, Form, Input, Row, Select, Upload, message } from "antd";
import ItemApi from "../../../apis/item";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { drawingsRef, imagesItemRef } from "../../../middleware/firebase";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { InputNumber } from "antd/lib";

export const ItemModal = ({ data, listCategories, listProcedures, open, onCancel, onSuccess }) => {
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";
  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [priceImage, setPriceImage] = useState(data?.image ?? "");
  const [drawings2D, setDrawings2D] = useState(data?.drawings2D ?? "");
  const [drawings3D, setDrawings3D] = useState(data?.drawings3D ?? "");
  const [drawingsTechnical, setDrawingsTechnical] = useState(data?.drawingsTechnical ?? "");
  const [listProcedure, setListProcedure] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleUploadImage = (event) => {
    setLoading(true);
    const file = event.file;
    const fileName = event.file?.name;
    const uploadTask = uploadBytesResumable(ref(imagesItemRef, fileName), file);
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
          setPriceImage(url);
        });
      }
    );
    setLoading(false);
  };

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
        setProgress(0);
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
        setProgress(0);
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
        setProgress(0);
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          formRef.current.setFieldValue("drawingsTechnical", url);
          setDrawingsTechnical(url);
        });
      }
    );
    setLoading(false);
  };

  const handleChangeProcedures = (value) => {
    setListProcedure(
      value?.map((e, i) => {
        return {
          stepId: e,
          priority: i,
        };
      })
    );
  };

  //
  const handleSubmit = async (values) => {
    setLoading(true);
    const body = { ...values, image: priceImage, drawings2D, drawings3D, drawingsTechnical };
    if (!values.listMaterial) {
      body.listMaterial = [];
    }
    if (!values.listProcedure) {
      body.listProcedure = [];
    }

    const success = isCreate ? await ItemApi.createItem(body) : await ItemApi.updateItem(body);
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
      width={"60%"}
      open={open}
      onCancel={onCancel}
      confirmLoading={loading}
      title={`${typeMessage} sản phẩm`}
      onOk={() => formRef.current?.submit()}
    >
      <Form
        layout="vertical"
        ref={formRef}
        initialValues={{
          ...(data || {
            listMaterial: [],
            listProcedure: [],
            length: 1,
            depth: 1,
            height: 1,
            mass: 1,
          }),
        }}
        onFinish={handleSubmit}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Card
              bordered={false}
              bodyStyle={{
                padding: 0,
                paddingLeft: 8,
                paddingTop: 12,
                paddingRight: 8,
                paddingBottom: 16,
              }}
            >
              {!isCreate && (
                <Form.Item name="id" hidden>
                  <Input />
                </Form.Item>
              )}
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên sản phẩm",
                  },
                ]}
              >
                <Input placeholder="Nhập tên sản phẩm..." />
              </Form.Item>
              <Form.Item
                name="itemCategoryId"
                label="Loại sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại sản phẩm",
                  },
                ]}
              >
                <Select options={listCategories} placeholder="Chọn loại sản phẩm..." />
              </Form.Item>
              <Form.Item
                name="listProcedure"
                label="Danh sách quy trình"
                // rules={[
                //   {
                //     required: true,
                //     message: "Vui lòng chọn quy trình cần thực hiện",
                //   },
                // ]}
              >
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Chọn quy trình cần thực hiện..."
                  defaultValue={data?.listProcedure}
                  onChange={handleChangeProcedures}
                  optionLabelProp="label"
                  options={listProcedures}
                />
              </Form.Item>
              <Form.Item
                name="image"
                label="Ảnh sản phẩm"
                // rules={[
                //   {
                //     required: !priceImage,
                //     message: "Vui lòng chọn bảng báo giá",
                //   },
                // ]}
              >
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  accept=".jpg,.jepg,.png,.svg,.bmp"
                  onChange={handleUploadImage}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              {/*  */}
              <Form.Item
                name="drawings2D"
                label="Bản vẽ 2D"
                // rules={[
                //   {
                //     required: !drawings2D,
                //     message: "Vui lòng chọn bản vẽ 2D",
                //   },
                // ]}
              >
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  accept=".jpg,.jepg,.png,.svg,.bmp"
                  onChange={handleUploadDrawing2D}
                  maxCount={1}
                  defaultValue=""
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              {/*  */}
              <Form.Item
                name="drawings3D"
                label="Bản vẽ 3D"
                // rules={[
                //   {
                //     required: !drawings3D,
                //     message: "Vui lòng chọn bản vẽ 3D",
                //   },
                // ]}
              >
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  accept=".jpg,.jepg,.png,.svg,.bmp"
                  onChange={handleUploadDrawing3D}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="drawingsTechnical"
                label="Bảng vẽ kỹ thuật"
                // rules={[
                //   {
                //     required: !drawingsTechnical,
                //     message: "Vui lòng chọn bản vẽ kỹ thuật",
                //   },
                // ]}
              >
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  accept=".jpg,.jepg,.png,.svg,.bmp"
                  onChange={handleUploadDrawingTechnical}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>

              {/* hidden data */}
              <Form.Item name="listMaterial" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="listProcedure" hidden>
                <Input />
              </Form.Item>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              bordered={false}
              bodyStyle={{
                padding: 0,
                paddingLeft: 8,
                paddingTop: 12,
                paddingRight: 8,
                paddingBottom: 16,
              }}
            >
              <Form.Item
                name="length"
                label="Chiều dài"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập chiều dài",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  placeholder="Nhập chiều dài..."
                />
              </Form.Item>
              <Form.Item
                name="depth"
                label="Chiều rông"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập chiều rộng",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  placeholder="Nhập chiều rộng..."
                />
              </Form.Item>
              <Form.Item
                name="height"
                label="Chiều cao"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập chiều cao",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  placeholder="Nhập chiều cao..."
                />
              </Form.Item>
              <Form.Item
                name="unit"
                label="Đơn vị tính"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đơn vị tính",
                  },
                ]}
              >
                <Input placeholder="Nhập đơn vị tính..." />
              </Form.Item>
              <Form.Item
                name="description"
                label="Mô tả"
                // rules={[
                //   {
                //     required: true,
                //     message: "Vui lòng nhập mô tả sản phẩm",
                //   },
                // ]}
              >
                <TextArea rows={5} placeholder="Nhập mô tả sản phẩm..." />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </BaseModal>
  );
};
