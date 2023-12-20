import React, { useEffect, useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Button, Card, Col, Form, Input, Progress, Row, Select, Upload, message } from "antd";
import ItemApi from "../../../apis/item";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { drawingsRef, imagesItemRef } from "../../../middleware/firebase";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { InputNumber } from "antd/lib";
import { BaseTable } from "../../../components/BaseTable";
import { Minus, Plus } from "@icon-park/react";
import Typography from "antd/lib/typography/Typography";

export const ItemModal = ({
  data,
  listItemNames,
  listCategories,
  listMaterials,
  listProcedures,
  open,
  onCancel,
  onSuccess,
}) => {
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";
  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [priceImage, setPriceImage] = useState(data?.image ?? "");
  const [drawings2D, setDrawings2D] = useState(data?.drawings2D ?? "");
  const [drawings3D, setDrawings3D] = useState(data?.drawings3D ?? "");
  const [drawingsTechnical, setDrawingsTechnical] = useState(data?.drawingsTechnical ?? "");
  const [listProcedure, setListProcedure] = useState(data?.listProcedure || []);
  const [listMaterial, setListMaterial] = useState(data?.listMaterial || []);
  const [progress, setProgress] = useState(-1);
  const [tableKey, setTableKey] = useState(0);

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
        setProgress(-1);
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

  const handleChangeProcedures = (value) => {
    setListProcedure(
      value?.map((procedureId, priority) => ({
        procedureId,
        priority,
      }))
    );
  };

  const findMaterialNameById = (materialId) => {
    const material = listMaterials.find((m) => m.value === materialId);
    return material ? material.label : "Unknown Material";
  };

  const handleChangeMaterials = async (value) => {
    setListMaterial(
      await value?.map((materialId) => {
        const existingMaterial = listMaterial.find((m) => m.materialId === materialId);
        return {
          materialId,
          materialName: findMaterialNameById(materialId),
          quantity: existingMaterial?.quantity || 100,
        };
      })
    );
  };

  const handleSubmit = async (values) => {
    // Update the values with the correct listMaterial
    const updatedValues = {
      ...values,
      image: priceImage,
      drawings2D,
      drawings3D,
      drawingsTechnical,
      listMaterial: listMaterial.filter((e) => !!e.materialId),
      listProcedure: listProcedure.filter((e) => !!e.procedureId),
    };

    if (!updatedValues.listMaterial) {
      updatedValues.listMaterial = [];
    }
    if (!updatedValues.listProcedure) {
      updatedValues.listProcedure = [];
    }
    // if (isCreate) {
    //   !!listItemNames.find((e) => e === values.name) && message.error(`Tên sản phẩm đã tồn tại`);
    //   return;
    // }

    const success = isCreate
      ? await ItemApi.createItem(updatedValues)
      : await ItemApi.updateItem(updatedValues);
    if (success) {
      onSuccess();
      message.success(`${typeMessage} thành công`);
      setLoading(false);
    } else {
      setLoading(false);
      message.error(`${typeMessage} thất bại`);
    }
    success && onCancel();
  };

  const changeProcedurePriority = (event, index) => {
    let tmp = listProcedure;
    tmp[index].priority = parseInt(event.target.value);
    setListProcedure(tmp);
  };

  const handleChangeProcedure = (value, index) => {
    let tmp = listProcedure;
    tmp[index].procedureId = value;
    setListProcedure(tmp);
  };

  const addNewProcedure = () => {
    setListProcedure((prevList) => [...prevList, { procedureId: "", priority: 0 }]);
    // Increment the key to force re-render the table
    setTableKey((prevKey) => prevKey + 1);
  };

  const removeProcedure = (index) => {
    setListProcedure((prevList) => prevList.filter((e, i) => i !== index));
    // Increment the key to force re-render the table
    setTableKey((prevKey) => prevKey + 1);
  };
  const pColumns = [
    {
      title: "Quy trình",
      dataIndex: "procedureId",
      width: "60%",
      key: "procedureId",
      render: (_, record, index) => {
        return (
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Chọn quy trình cần thực hiện..."
            defaultValue={record?.procedureId}
            onChange={(value) => handleChangeProcedure(value, index)}
            optionLabelProp="label"
            options={listProcedures.filter(
              (e) =>
                !listProcedure.find(
                  (p) => p.procedureId === e.value && p.procedureId !== record?.procedureId
                )
            )}
          />
        );
      },
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: "30%",
      // align: "center",
      render: (_, record, index) => {
        return (
          <Input
            type="number"
            defaultValue={record?.priority}
            onInput={(value) => changeProcedurePriority(value, index)}
            min={0}
          />
        );
      },
    },
    {
      key: "_",
      title: "",
      width: "10%",
      dataIndex: "_",
      render: (_, record, index) => (
        <Minus
          size={20}
          role="button"
          className="text-danger"
          onClick={() => removeProcedure(index)}
        />
      ),
    },
  ];

  // material
  const changeMaterialQuantity = (event, index) => {
    let tmp = listMaterial;
    tmp[index].quantity = parseInt(event.target.value);
    setListMaterial(tmp);
  };

  const handleChangeMaterial = (value, index) => {
    let tmp = listMaterial;
    tmp[index].materialId = value;
    setListMaterial(tmp);
  };

  const addNewMaterial = () => {
    setListMaterial((prevList) => [...prevList, { materialId: "", quantity: 0 }]);
    // Increment the key to force re-render the table
    setTableKey((prevKey) => prevKey + 1);
  };

  const removeMaterial = (index) => {
    setListMaterial((prevList) => prevList.filter((e, i) => i !== index));
    // Increment the key to force re-render the table
    setTableKey((prevKey) => prevKey + 1);
  };

  const mColumns = [
    {
      title: "Vật liệu",
      dataIndex: "materialId",
      width: "60%",
      key: "materialId",
      render: (_, record, index) => {
        return (
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Chọn vật liệu..."
            defaultValue={record?.materialId}
            onChange={(value) => handleChangeMaterial(value, index)}
            optionLabelProp="label"
            options={listMaterials.filter(
              (e) =>
                !listMaterial.find(
                  (m) => m.materialId === e.value && m.materialId !== record?.materialId
                )
            )}
          />
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "30%",
      // align: "center",
      render: (_, record, index) => {
        return (
          <Input
            type="number"
            defaultValue={record?.quantity}
            onInput={(value) => changeMaterialQuantity(value, index)}
            min={0}
          />
        );
      },
    },
    {
      key: "_",
      title: "",
      width: "10%",
      dataIndex: "_",
      render: (_, record, index) => (
        <Minus
          size={20}
          role="button"
          className="text-danger"
          onClick={() => removeMaterial(index)}
        />
      ),
    },
  ];

  useEffect(() => {
    setListProcedure(data?.listProcedure || []);
    setListMaterial(data?.listMaterial || []);
  }, [data]);

  return (
    <BaseModal
      style={{ top: "2%" }}
      width={"90%"}
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
            listMaterial: [],
            listProcedure: [],
            length: 1,
            depth: 1,
            height: 1,
            mass: 1,
            unit: "mét",
            description: "Thêm/ Cập nhật sản phẩm",
          }),
        }}
        onFinish={handleSubmit}
      >
        <Row gutter={24}>
          <Col span={10}>
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
                <Select showSearch options={listCategories} placeholder="Chọn loại sản phẩm..." />
              </Form.Item>
              <Row gutter={24}>
                <Col span={6}>
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
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
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
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
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
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
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
                </Col>
              </Row>
              <Form.Item
                name="mass"
                label="Khối"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập khối lượng",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  placeholder="Nhập khối lượng..."
                  min={0}
                />
              </Form.Item>
              <Form.Item name="description" label="Mô tả">
                <TextArea rows={3} placeholder="Nhập mô tả sản phẩm..." />
              </Form.Item>
            </Card>
          </Col>
          <Col span={10}>
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
              <Form.Item name="listProcedure" label="Danh sách quy trình">
                <BaseTable
                  key={tableKey}
                  columns={pColumns}
                  pagination={false}
                  searchOptions={{ visible: false }}
                  dataSource={listProcedure}
                  addButton={
                    <div className="mb-2">
                      <Plus
                        size={20}
                        role="button"
                        className="text-success"
                        onClick={() => addNewProcedure()}
                      />
                    </div>
                  }
                />
              </Form.Item>
              <Form.Item name="listMaterial" label="Danh sách vật liệu">
                <BaseTable
                  key={tableKey}
                  columns={mColumns}
                  pagination={false}
                  searchOptions={{ visible: false }}
                  dataSource={listMaterial}
                  addButton={
                    <div className="mb-2">
                      <Plus
                        size={20}
                        role="button"
                        className="text-success"
                        onClick={() => addNewMaterial()}
                      />
                    </div>
                  }
                />
              </Form.Item>
            </Card>
          </Col>
          <Col span={4}>
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
              <Form.Item name="image" label="Ảnh sản phẩm">
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  accept=".jpg,.jepg,.png,.svg,.bmp"
                  onChange={handleUploadImage}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Tải lên</Button>
                </Upload>
              </Form.Item>
              {/*  */}
              <Form.Item name="drawings2D" label="Bản vẽ 2D">
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  onChange={handleUploadDrawing2D}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Tải lên</Button>
                </Upload>
              </Form.Item>
              {/*  */}
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
            </Card>
          </Col>
        </Row>
      </Form>
    </BaseModal>
  );
};
