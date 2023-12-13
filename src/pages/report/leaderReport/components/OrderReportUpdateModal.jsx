import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Select, Spin, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import OrderReportApi from "../../../../apis/order-report";
import { EReport, ReportMap, WReport, orderReportMap } from "../../../../constants/enum";
import BaseModal from "../../../../components/BaseModal";
import { imagesReportRef } from "../../../../middleware/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const OrderReportUpdateModal = ({ data, idOrderReport, open, onCancel, getReports }) => {
  const isUpdate = !data;
  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState();
  const [reportImage, setReportImage] = useState(data?.image ?? "");

  const handleUploadReportImage = (event) => {
    setLoading(true);
    const file = event.file;
    const fileName = event.file?.name;
    const uploadTask = uploadBytesResumable(ref(imagesReportRef, fileName), file);
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
          setReportImage(url);
        });
      }
    );
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      getOrderReportDetailById(idOrderReport);
    } else {
      setLoading(false);
      setReport();
    }
  }, [open]);

  const getOrderReportDetailById = async (id) => {
    setLoading(true);
    const data = await OrderReportApi.getOrderReportById(id);
    setReport(data);
    formRef.current.setFieldsValue(data);
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    console.log({ values });
    setLoading(true);
    const res = await OrderReportApi.updateOrderReport(values);
    if (res) {
      message.success("Cập nhật báo cáo thành công");
      onCancel();
    } else {
      message.error("Cập nhật báo cáo thất bại");
    }
    getReports();
    setLoading(false);
  };

  return (
    <BaseModal
      open={open}
      width={"50%"}
      onCancel={onCancel}
      confirmLoading={loading}
      title="Cập nhật báo cáo"
      onOk={() => formRef.current?.submit()}
    >
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={{ ...(report || {}) }}
        onFinish={handleSubmit}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="title"
          label="Tên báo cáo"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên báo cáo",
            },
          ]}
        >
          <Input placeholder="Tên báo cáo..." />
        </Form.Item>
        <Form.Item
          name="content"
          label="Nội dung"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập nội dung",
            },
          ]}
        >
          <Input placeholder="Nội dung..." />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn trạng thái",
            },
          ]}
        >
          <Select
            options={Object.keys(orderReportMap)
              ?.filter((x) => x != EReport.Achieved)
              ?.map((x) => {
                return {
                  value: x - 0,
                  label: orderReportMap[x].label,
                };
              })}
            placeholder="Trạng thái..."
          />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default OrderReportUpdateModal;
