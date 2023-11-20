import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Select, Spin, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import OrderReportApi from "../../../../apis/order-report";
import { EReport, ReportMap } from "../../../../constants/enum";
import BaseModal from "../../../../components/BaseModal";

const OrderReportUpdateModal = ({ idOrderReport, open, onCancel }) => {
  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState();

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
            options={Object.keys(ReportMap)
              ?.filter((x) => x != EReport.NotAchieved)
              ?.map((x) => {
                return {
                  value: x - 0,
                  label: ReportMap[x].label,
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
